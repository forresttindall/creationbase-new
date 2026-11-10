import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { LiquidMetal } from '@paper-design/shaders-react';
import { traceShapes } from './traceShapes';

// Turns a transparent PNG (or the generated text mask) into a 3D object.
//
// look="metal"  → solid extrusion. The front face is textured live with the
//                 Paper Liquid Metal shader (rendered offscreen on the cropped
//                 logo), the sides are brushed metal slices.
// look="glass"  → liquid glass. A single bevelled face (normal map generated
//                 from the silhouette) with a transmissive material that
//                 refracts the live background layer behind it.
//
// Rendered with three.js into a canvas so the Material Lab compositor can drop
// it over the background layer like any other logo shader.

const LM_TEX_SIZE = 768;

// Global pause for live preview loops (e.g. while the exported MP4 plays in
// the page, so playback isn't starved of GPU time).
export const livePreview = { paused: false };

// DVD-screensaver style: position moves at a constant speed and reverses
// exactly at the edges (triangle wave between min and max).
export const bounceBetween = (min, max, t, velocity) => {
  const span = max - min;
  if (span <= 1e-6) return (min + max) / 2;
  const u = (t * velocity) / (2 * span);
  const f = u - Math.floor(u);
  return min + span * (1 - Math.abs(2 * f - 1));
};

const loadImage = (src) => new Promise((resolve, reject) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = src;
});

const cropToAlpha = (img) => {
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  const px = ctx.getImageData(0, 0, w, h).data;
  let x0 = w; let y0 = h; let x1 = -1; let y1 = -1;
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      if (px[(y * w + x) * 4 + 3] > 8) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) return c;
  // Padding leaves room for the bevel blur and Liquid Metal's edge falloff.
  const pad = Math.round(Math.max(x1 - x0, y1 - y0) * 0.04) + 2;
  x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad);
  x1 = Math.min(w - 1, x1 + pad); y1 = Math.min(h - 1, y1 + pad);
  const out = document.createElement('canvas');
  out.width = x1 - x0 + 1;
  out.height = y1 - y0 + 1;
  out.getContext('2d').drawImage(c, x0, y0, out.width, out.height, 0, 0, out.width, out.height);
  return out;
};

const scaledCanvas = (src, maxSide) => {
  const k = Math.min(1, maxSide / Math.max(src.width, src.height));
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(src.width * k));
  c.height = Math.max(1, Math.round(src.height * k));
  c.getContext('2d').drawImage(src, 0, 0, c.width, c.height);
  return c;
};

// Alpha copied into RGB so it can drive alphaMap (which samples green).
const buildMaskCanvas = (src) => {
  const c = document.createElement('canvas');
  c.width = src.width;
  c.height = src.height;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(src, 0, 0);
  const data = ctx.getImageData(0, 0, c.width, c.height);
  const px = data.data;
  for (let i = 0; i < px.length; i += 4) {
    const a = px[i + 3];
    px[i] = a; px[i + 1] = a; px[i + 2] = a; px[i + 3] = 255;
  }
  ctx.putImageData(data, 0, 0);
  return c;
};

// Rounded "pillow" bevel: blur the silhouette into a height field and turn
// its gradient into a tangent-space normal map.
const buildNormalCanvas = (mask, bevel) => {
  const w = mask.width;
  const h = mask.height;
  const blurPx = Math.max(1, Math.round(Math.min(w, h) * (0.01 + bevel * 0.06)));
  const hc = document.createElement('canvas');
  hc.width = w;
  hc.height = h;
  const hctx = hc.getContext('2d', { willReadFrequently: true });
  hctx.fillStyle = '#000';
  hctx.fillRect(0, 0, w, h);
  hctx.filter = `blur(${blurPx}px)`;
  hctx.drawImage(mask, 0, 0);
  hctx.filter = 'none';
  const hp = hctx.getImageData(0, 0, w, h).data;
  const H = (x, y) => hp[((Math.min(h - 1, Math.max(0, y)) * w) + Math.min(w - 1, Math.max(0, x))) * 4] / 255;
  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  const octx = out.getContext('2d');
  const img = octx.createImageData(w, h);
  const strength = blurPx * 1.2;
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const nx = -(H(x + 1, y) - H(x - 1, y)) * 0.5 * strength;
      const ny = (H(x, y + 1) - H(x, y - 1)) * 0.5 * strength;
      const len = Math.hypot(nx, ny, 1);
      const i = (y * w + x) * 4;
      img.data[i] = ((nx / len) * 0.5 + 0.5) * 255;
      img.data[i + 1] = ((ny / len) * 0.5 + 0.5) * 255;
      img.data[i + 2] = ((1 / len) * 0.5 + 0.5) * 255;
      img.data[i + 3] = 255;
    }
  }
  octx.putImageData(img, 0, 0);
  return out;
};

export const EXTRUDE_MOTIONS = [
  { value: 'sway', label: 'Sway' },
  { value: 'float', label: 'Float' },
  { value: 'spin', label: 'Spin' },
  { value: 'tumble', label: 'Tumble' },
  { value: 'still', label: 'Still (3/4 view)' },
];

const poseFor = (motion, t) => {
  switch (motion) {
    case 'spin':
      return { rx: 0.12, ry: t * 0.9, y: 0 };
    case 'float':
      return { rx: Math.cos(t * 0.7) * 0.12, ry: Math.sin(t * 0.5) * 0.4, y: Math.sin(t * 1.1) * 0.03 };
    case 'tumble':
      return { rx: Math.sin(t * 0.55) * 0.5, ry: t * 0.7, y: 0 };
    case 'drift':
      return { rx: Math.sin(t * 0.4) * 0.08, ry: Math.sin(t * 0.3) * 0.15, y: Math.sin(t * 0.6) * 0.05, x: Math.cos(t * 0.45) * 0.05 };
    case 'flat':
      return { rx: 0, ry: 0, y: 0 };
    case 'still':
      return { rx: 0.15, ry: -0.38, y: 0 };
    case 'sway':
    default:
      return { rx: Math.sin(t * 0.6) * 0.15 + 0.05, ry: Math.sin(t * 0.8) * 0.65, y: 0 };
  }
};

function Extrude3D({
  image,
  look = 'metal',
  width,
  height,
  style,
  scale = 1,
  rotation = 0,
  offsetX = 0,
  offsetY = 0,
  speed = 1,
  depth = 0.35,
  motion = 'sway',
  bounce = false,
  // When set (seconds), render exactly this moment instead of wall-clock
  // time — used for frame-accurate video export.
  time = null,
  liquidMetal = {},
  glass = {},
  getBackdrop,
  backdropColor = '#000000',
}) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const lmMountRef = useRef(null);
  const stateRef = useRef(null);
  const paramsRef = useRef({});
  const [cropped, setCropped] = useState(null);
  paramsRef.current = { time, scale, rotation, offsetX, offsetY, speed, motion, bounce, width, height, look, getBackdrop, backdropColor };

  // Renderer, scene, lights and the render loop live for the component's
  // lifetime; the logo object is rebuilt separately when its inputs change.
  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: false });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 4);

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(-2, 3, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 0.8);
    rim.position.set(3, -1, -2);
    scene.add(rim);

    const pivot = new THREE.Group();
    scene.add(pivot);

    const state = { renderer, scene, camera, pivot, raf: 0, start: performance.now(), aspect: 1, liveTextures: [], backdropTex: null, backdropSrc: null };
    stateRef.current = state;

    const resize = () => {
      const p = paramsRef.current;
      const w = p.width || wrapRef.current?.clientWidth || 1;
      const h = p.height || wrapRef.current?.clientHeight || 1;
      renderer.setPixelRatio(p.width ? 1 : Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    state.resize = resize;
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    if (ro && wrapRef.current) ro.observe(wrapRef.current);

    const updateBackdrop = (p) => {
      if (p.look !== 'glass') {
        scene.background = null;
        return;
      }
      const src = p.getBackdrop ? p.getBackdrop() : null;
      if (src && src.width && src.height) {
        if (state.backdropSrc !== src) {
          state.backdropTex?.dispose();
          state.backdropTex = new THREE.CanvasTexture(src);
          state.backdropTex.colorSpace = THREE.SRGBColorSpace;
          state.backdropSrc = src;
        }
        state.backdropTex.needsUpdate = true;
        scene.background = state.backdropTex;
      } else {
        scene.background = new THREE.Color(p.backdropColor);
      }
    };

    const draw = (timeSec) => {
      const p = paramsRef.current;
      const t = timeSec * p.speed;
      const pose = poseFor(p.motion, t);

      // Fit the logo inside the frame (contain), then apply the user scale.
      const viewH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const viewW = viewH * camera.aspect;
      const fit = Math.min(viewW / state.aspect, viewH) * 0.82 * p.scale;
      pivot.scale.set(fit, fit, fit);
      if (p.bounce) {
        // The cropped silhouette is aspect × 1 units before scaling.
        const halfW = (fit * state.aspect) / 2;
        const halfH = fit / 2;
        const v = viewH * 0.22;
        pivot.position.set(
          bounceBetween(-viewW / 2 + halfW, viewW / 2 - halfW, t + 7.3, v),
          bounceBetween(-viewH / 2 + halfH, viewH / 2 - halfH, t + 3.1, v * 0.82),
          0,
        );
      } else {
        pivot.position.set(
          p.offsetX * viewW * 0.5 + (pose.x || 0) * viewW,
          p.offsetY * viewH * 0.5 + pose.y * viewH,
          0,
        );
      }
      pivot.rotation.set(pose.rx, pose.ry, THREE.MathUtils.degToRad(-p.rotation));

      state.liveTextures.forEach((tex) => {
        // Reallocate if the source canvas was resized (GPU storage is sized
        // on first upload, and Paper's canvas starts small).
        const size = `${tex.image.width}x${tex.image.height}`;
        if (tex.userData.size !== size) {
          tex.dispose();
          tex.userData.size = size;
        }
        tex.needsUpdate = true;
      });
      updateBackdrop(p);
      renderer.toneMapping = p.look === 'glass' ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = p.look === 'glass' ? 1 : 1.25;

      renderer.render(scene, camera);
    };
    const tick = () => {
      // While exporting (time set) frames are drawn on demand via __renderAt.
      if (paramsRef.current.time == null && !livePreview.paused) draw((performance.now() - state.start) / 1000);
      state.raf = requestAnimationFrame(tick);
    };
    state.raf = requestAnimationFrame(tick);
    // Synchronous render of an exact moment (seconds) for video export: steps
    // the offscreen Liquid Metal to the same moment, then draws the 3D frame.
    canvas.__renderAt = (sec) => {
      const p = paramsRef.current;
      const lm = lmMountRef.current?.querySelector('[data-paper-shader]')?.paperShaderMount;
      lm?.setFrame(sec * 1000 * p.speed);
      draw(sec);
    };

    return () => {
      cancelAnimationFrame(state.raf);
      ro?.disconnect();
      state.backdropTex?.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      stateRef.current = null;
    };
  }, []);

  useEffect(() => {
    stateRef.current?.resize?.();
  }, [width, height]);

  // Crop the source once per image; both looks build from the cropped canvas.
  useEffect(() => {
    let cancelled = false;
    loadImage(image).then((img) => {
      if (cancelled) return;
      const c = cropToAlpha(img);
      setCropped({ canvas: c, url: c.toDataURL('image/png'), aspect: c.width / c.height });
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [image]);

  const lmW = cropped ? (cropped.aspect >= 1 ? LM_TEX_SIZE : Math.round(LM_TEX_SIZE * cropped.aspect)) : LM_TEX_SIZE;
  const lmH = cropped ? (cropped.aspect >= 1 ? Math.round(LM_TEX_SIZE / cropped.aspect) : LM_TEX_SIZE) : LM_TEX_SIZE;

  // (Re)build the 3D object whenever the source or its look changes.
  useEffect(() => {
    const s = stateRef.current;
    if (!s || !cropped) return undefined;
    let cancelled = false;
    let raf = 0;
    const disposables = [];
    const group = new THREE.Group();
    s.aspect = cropped.aspect;

    const src = scaledCanvas(cropped.canvas, 1024);
    const maskCanvas = buildMaskCanvas(src);
    const maskTex = new THREE.CanvasTexture(maskCanvas);
    const geo = new THREE.PlaneGeometry(cropped.aspect, 1);
    disposables.push(maskTex, geo);

    if (look === 'glass') {
      const normalTex = new THREE.CanvasTexture(buildNormalCanvas(scaledCanvas(maskCanvas, 640), glass.bevel ?? 0.5));
      disposables.push(normalTex);
      const refraction = glass.refraction ?? 0.6;
      const glassMat = new THREE.MeshPhysicalMaterial({
        alphaMap: maskTex,
        alphaTest: 0.5,
        transmission: 1,
        thickness: 0.2 + refraction * 1.2,
        ior: 1.2 + refraction * 0.6,
        roughness: glass.frost ?? 0.08,
        color: glass.tint || '#ffffff',
        attenuationColor: glass.tint || '#ffffff',
        attenuationDistance: 2,
        normalMap: normalTex,
        normalScale: new THREE.Vector2(1 + refraction * 2, 1 + refraction * 2),
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        clearcoatNormalMap: normalTex,
        specularIntensity: 1,
        dispersion: (glass.dispersion ?? 0.4) * 6,
        envMapIntensity: 1.2,
      });
      disposables.push(glassMat);
      group.add(new THREE.Mesh(geo, glassMat));
      s.liveTextures = [];
      s.pivot.add(group);
    } else {
      // Solid extrusion: trace the silhouette into vector outlines and build
      // one closed, bevelled mesh. Caps (group 0) show the live Liquid Metal
      // exactly; side walls (group 1) use it as the texture of a lit metal
      // material so they catch light like a real solid edge.
      const { shapes } = traceShapes(src);
      const aspect = cropped.aspect;
      const thickness = 0.03 + depth * 0.45;
      const bevel = Math.min(0.02, thickness * 0.18);

      const alphaCtx = src.getContext('2d', { willReadFrequently: true });
      const alphaPx = alphaCtx.getImageData(0, 0, src.width, src.height).data;
      const alphaAt = (x, y) => {
        const px = Math.round((x / aspect + 0.5) * (src.width - 1));
        const py = Math.round((0.5 - y) * (src.height - 1));
        if (px < 0 || py < 0 || px >= src.width || py >= src.height) return 0;
        return alphaPx[(py * src.width + px) * 4 + 3];
      };
      const proj = (x, y) => new THREE.Vector2(x / aspect + 0.5, y + 0.5);
      const uvGenerator = {
        generateTopUV: (g, v, a, b, c) => [a, b, c].map((i) => proj(v[i * 3], v[i * 3 + 1])),
        // Sample the shader just inside the outline so the wall shows the
        // metal colour of the adjacent face rather than its transparent rim.
        generateSideWallUV: (g, v, a, b, c, d) => {
          const ax = v[a * 3]; const ay = v[a * 3 + 1];
          const bx = v[b * 3]; const by = v[b * 3 + 1];
          let nx = by - ay;
          let ny = -(bx - ax);
          const len = Math.hypot(nx, ny) || 1;
          nx /= len; ny /= len;
          const mx = (ax + bx) / 2;
          const my = (ay + by) / 2;
          const probe = 0.012;
          const sign = alphaAt(mx + nx * probe, my + ny * probe) >= alphaAt(mx - nx * probe, my - ny * probe) ? 1 : -1;
          const inset = 0.02;
          return [a, b, c, d].map((i) => {
            // Let the colour drift a little with depth so the walls read as
            // a continuous metal band rather than a flat smear.
            const z = v[i * 3 + 2];
            return proj(v[i * 3] + sign * nx * (inset + z * 0.15), v[i * 3 + 1] + sign * ny * (inset + z * 0.15));
          });
        },
      };

      const solidGeo = new THREE.ExtrudeGeometry(shapes, {
        depth: thickness,
        steps: 2,
        bevelEnabled: true,
        bevelThickness: bevel,
        bevelSize: bevel * 0.6,
        bevelSegments: 4,
        UVGenerator: uvGenerator,
      });
      solidGeo.translate(0, 0, -thickness / 2);
      solidGeo.computeVertexNormals();
      disposables.push(solidGeo);

      const capPlaceholder = new THREE.MeshPhysicalMaterial({ color: '#ffffff', metalness: 1, roughness: 0.12 });
      const wallMat = new THREE.MeshPhysicalMaterial({
        color: '#ffffff',
        metalness: 0.8,
        roughness: 0.22,
        clearcoat: 0.6,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.3,
      });
      disposables.push(capPlaceholder, wallMat);
      const solid = new THREE.Mesh(solidGeo, [capPlaceholder, wallMat]);
      group.add(solid);
      s.pivot.add(group);

      // Swap in the live Liquid Metal texture as soon as its canvas exists.
      const attach = () => {
        if (cancelled) return;
        const lmCanvas = lmMountRef.current?.querySelector('canvas');
        if (!lmCanvas || !lmCanvas.width) {
          raf = requestAnimationFrame(attach);
          return;
        }
        const lmTex = new THREE.CanvasTexture(lmCanvas);
        lmTex.colorSpace = THREE.SRGBColorSpace;
        lmTex.wrapS = THREE.MirroredRepeatWrapping;
        lmTex.wrapT = THREE.MirroredRepeatWrapping;
        const capMat = new THREE.MeshBasicMaterial({ map: lmTex, toneMapped: false });
        wallMat.map = lmTex;
        wallMat.needsUpdate = true;
        disposables.push(lmTex, capMat);
        solid.material = [capMat, wallMat];
        s.liveTextures = [lmTex];
      };
      attach();
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (stateRef.current) stateRef.current.liveTextures = [];
      group.parent?.remove(group);
      disposables.forEach((d) => d.dispose());
    };
  }, [cropped, look, depth, glass.bevel, glass.refraction, glass.frost, glass.tint, glass.dispersion]);

  const sized = width && height;
  return (
    <div ref={wrapRef} style={{ position: 'relative', overflow: 'hidden', ...(sized ? { width, height } : { width: '100%', height: '100%', ...style }) }}>
      {/* Main canvas first: the exporter grabs the first canvas in the mount. */}
      <canvas
        ref={canvasRef}
        width={sized ? width : undefined}
        height={sized ? height : undefined}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
      {look === 'metal' && cropped && (
        <div
          ref={lmMountRef}
          aria-hidden="true"
          style={{ position: 'absolute', left: 0, top: 0, width: lmW, height: lmH, opacity: 0, pointerEvents: 'none', zIndex: -1 }}
        >
          <LiquidMetal
            style={{ width: lmW, height: lmH }}
            minPixelRatio={1}
            maxPixelCount={lmW * lmH}
            webGlContextAttributes={{ preserveDrawingBuffer: true }}
            image={cropped.url}
            fit="contain"
            scale={1}
            speed={time != null ? 0 : speed}
            frame={time != null ? time * 1000 * speed : undefined}
            shape="none"
            colorBack="#00000000"
            colorTint="#ffffff"
            repetition={liquidMetal.repetition}
            softness={liquidMetal.softness}
            shiftRed={liquidMetal.shiftRed}
            shiftBlue={liquidMetal.shiftBlue}
            distortion={liquidMetal.distortion}
            contour={liquidMetal.contour}
            angle={liquidMetal.angle}
          />
        </div>
      )}
    </div>
  );
}

export default Extrude3D;
