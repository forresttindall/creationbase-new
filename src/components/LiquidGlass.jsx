import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { bounceBetween, livePreview } from './Extrude3D';

// "Liquid glass" logo in the style of Apple / Figma / Framer glass: a flat
// slab of clear glass whose rounded rim refracts (magnifies and bends) the
// live background, with light frosting, chromatic fringing on the rim, a thin
// specular edge highlight and a soft drop shadow.
//
// The logo silhouette is converted to a signed distance field on the CPU
// (exact Euclidean distance transform). A full-frame fragment shader uses the
// distance to build a circular bezel profile and its gradient as the surface
// normal, then samples the background layer's canvas through that lens.

export const GLASS_MOTIONS = [
  { value: 'float', label: 'Float' },
  { value: 'drift', label: 'Drift' },
  { value: 'sway', label: 'Sway' },
  { value: 'flat', label: 'Still' },
];

const SDF_MAX_SIDE = 512;

const loadImage = (src) => new Promise((resolve, reject) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = src;
});

// Felzenszwalb & Huttenlocher 1D squared distance transform.
const edt1d = (f, n, d, v, z) => {
  let k = 0;
  v[0] = 0;
  z[0] = -Infinity;
  z[1] = Infinity;
  for (let q = 1; q < n; q += 1) {
    let s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k -= 1;
      s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k += 1;
    v[k] = q;
    z[k] = s;
    z[k + 1] = Infinity;
  }
  k = 0;
  for (let q = 0; q < n; q += 1) {
    while (z[k + 1] < q) k += 1;
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]];
  }
};

// Distance (px) from every "seed == false" pixel to the nearest seed pixel.
const edt = (seed, w, h) => {
  const INF = 1e20;
  const grid = new Float64Array(w * h);
  for (let i = 0; i < w * h; i += 1) grid[i] = seed[i] ? 0 : INF;
  const n = Math.max(w, h);
  const f = new Float64Array(n);
  const d = new Float64Array(n);
  const v = new Int32Array(n);
  const z = new Float64Array(n + 1);
  for (let x = 0; x < w; x += 1) {
    for (let y = 0; y < h; y += 1) f[y] = grid[y * w + x];
    edt1d(f, h, d, v, z);
    for (let y = 0; y < h; y += 1) grid[y * w + x] = d[y];
  }
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) f[x] = grid[y * w + x];
    edt1d(f, w, d, v, z);
    for (let x = 0; x < w; x += 1) grid[y * w + x] = Math.sqrt(d[x]);
  }
  return grid;
};

// Crops to the visible pixels (with room for the shadow), downsamples, and
// packs: R = inside distance, G = coverage (alpha), B = outside distance.
// Distances are normalised by the shape's short side so the bezel slider
// behaves the same for a chunky logo and a line of text.
const buildShapeField = (img) => {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const probe = document.createElement('canvas');
  probe.width = iw;
  probe.height = ih;
  const pctx = probe.getContext('2d', { willReadFrequently: true });
  pctx.drawImage(img, 0, 0);
  const all = pctx.getImageData(0, 0, iw, ih).data;
  let x0 = iw; let y0 = ih; let x1 = -1; let y1 = -1;
  for (let y = 0; y < ih; y += 1) {
    for (let x = 0; x < iw; x += 1) {
      if (all[(y * iw + x) * 4 + 3] > 8) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) { x0 = 0; y0 = 0; x1 = iw - 1; y1 = ih - 1; }
  const cw = x1 - x0 + 1;
  const ch = y1 - y0 + 1;
  const pad = Math.round(Math.min(cw, ch) * 0.35) + 4;
  const k = Math.min(1, SDF_MAX_SIDE / (Math.max(cw, ch) + pad * 2));
  const w = Math.max(8, Math.round((cw + pad * 2) * k));
  const h = Math.max(8, Math.round((ch + pad * 2) * k));
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(probe, x0 - pad, y0 - pad, cw + pad * 2, ch + pad * 2, 0, 0, w, h);
  const px = ctx.getImageData(0, 0, w, h).data;
  const inside = new Uint8Array(w * h);
  const outside = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i += 1) {
    const on = px[i * 4 + 3] > 127;
    inside[i] = on ? 1 : 0;
    outside[i] = on ? 0 : 1;
  }
  const dIn = edt(outside, w, h); // inside pixels: distance to the edge
  const dOut = edt(inside, w, h); // outside pixels: distance to the shape
  const contentShort = Math.max(1, Math.min(cw, ch) * k);
  let maxIn = 0;
  for (let i = 0; i < w * h; i += 1) if (dIn[i] > maxIn) maxIn = dIn[i];
  const data = new Float32Array(w * h * 4);
  // Flip rows so texture v grows upward like screen space.
  for (let y = 0; y < h; y += 1) {
    const ty = h - 1 - y;
    for (let x = 0; x < w; x += 1) {
      const i = y * w + x;
      const o = (ty * w + x) * 4;
      data[o] = dIn[i] / contentShort;
      data[o + 1] = px[i * 4 + 3] / 255;
      data[o + 2] = dOut[i] / contentShort;
      data[o + 3] = 1;
    }
  }
  const tex = new THREE.DataTexture(data, w, h, THREE.RGBAFormat, THREE.FloatType);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  // maxInside: half-width of the thickest part, in the same units as R.
  return { tex, aspect: w / h, width: w, height: h, contentShortPx: contentShort, maxInside: Math.max(1e-3, maxIn / contentShort) };
};

const vertexShader = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uBg;
  uniform float uHasBg;
  uniform vec3 uBgColor;
  uniform sampler2D uShape;
  uniform vec2 uShapeSize;   // texels
  uniform vec2 uRes;         // canvas px
  uniform vec2 uCenter;      // screen uv
  uniform vec2 uBox;         // shape box size in screen uv
  uniform float uAngle;
  uniform float uShortPx;    // shape short side in screen px
  uniform float uBezel;
  uniform float uRefract;
  uniform float uFrost;
  uniform float uDisp;
  uniform vec3 uTint;
  uniform float uTintAmt;
  uniform float uHighlight;

  // Manual bilinear fetch (float textures are sampled with NEAREST).
  vec4 shapeAt(vec2 uv) {
    vec2 p = uv * uShapeSize - 0.5;
    vec2 i = floor(p);
    vec2 f = p - i;
    vec2 t = 1.0 / uShapeSize;
    vec2 b = (i + 0.5) * t;
    vec4 a = texture2D(uShape, b);
    vec4 bx = texture2D(uShape, b + vec2(t.x, 0.0));
    vec4 by = texture2D(uShape, b + vec2(0.0, t.y));
    vec4 bxy = texture2D(uShape, b + t);
    return mix(mix(a, bx, f.x), mix(by, bxy, f.x), f.y);
  }

  vec3 bgAt(vec2 uv) {
    if (uHasBg < 0.5) return uBgColor;
    return texture2D(uBg, clamp(uv, vec2(0.001), vec2(0.999))).rgb;
  }

  // Frosted sample: small golden-angle disc blur.
  vec3 frosted(vec2 uv, float radiusPx) {
    if (radiusPx < 0.5) return bgAt(uv);
    vec3 acc = vec3(0.0);
    float wsum = 0.0;
    for (int k = 0; k < 16; k++) {
      float fk = float(k);
      float r = sqrt((fk + 0.5) / 16.0) * radiusPx;
      float th = fk * 2.39996323;
      vec2 o = vec2(cos(th), sin(th)) * r / uRes;
      acc += bgAt(uv + o);
      wsum += 1.0;
    }
    return acc / wsum;
  }

  mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

  void main() {
    vec2 px = vUv * uRes;
    vec2 centerPx = uCenter * uRes;
    vec2 boxPx = uBox * uRes;
    vec2 local = rot(-uAngle) * (px - centerPx);
    vec2 luv = local / boxPx + 0.5;

    if (luv.x < 0.0 || luv.y < 0.0 || luv.x > 1.0 || luv.y > 1.0) {
      gl_FragColor = vec4(0.0);
      return;
    }

    vec4 s = shapeAt(luv);
    float cover = smoothstep(0.35, 0.65, s.g);

    // Soft drop shadow outside the glass.
    float shadowLuvY = luv.y + 0.035 * uShortPx / boxPx.y;
    vec4 sShadow = shapeAt(vec2(luv.x, shadowLuvY));
    float shadow = (1.0 - smoothstep(0.0, 0.22, sShadow.b)) * 0.28 * (1.0 - cover);

    if (cover < 0.002) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, shadow);
      return;
    }

    // Bezel: 0 at the rim → 1 on the flat top.
    float bez = max(uBezel, 0.004);
    float t = clamp(s.r / bez, 0.0, 1.0);
    float edge = 1.0 - t;

    // Surface normal from the distance gradient (points inward), screen space.
    vec2 e = 1.5 / uShapeSize;
    float gx = shapeAt(luv + vec2(e.x, 0.0)).r - shapeAt(luv - vec2(e.x, 0.0)).r;
    float gy = shapeAt(luv + vec2(0.0, e.y)).r - shapeAt(luv - vec2(0.0, e.y)).r;
    vec2 g = vec2(gx / boxPx.x, gy / boxPx.y);
    vec2 n = length(g) > 1e-9 ? normalize(rot(uAngle) * g) : vec2(0.0);

    // Circular bezel: displacement grows steeply toward the rim, like a lens.
    float profile = 1.0 - sqrt(max(0.0, 1.0 - edge * edge));
    float bezelPx = bez * uShortPx;
    float dispPx = (profile * 1.6 + edge * 0.25) * bezelPx * uRefract;
    // Slight overall magnification of the flat top as well.
    vec2 fromCenter = (px - centerPx);
    vec2 magPx = -fromCenter * 0.04 * uRefract * t;

    float spread = uDisp * 0.35;
    vec2 baseUv = (px + magPx) / uRes;
    vec2 dir = -n * dispPx / uRes;
    float frostPx = uFrost * 18.0 + edge * uFrost * 6.0;
    vec3 col;
    col.r = frosted(baseUv + dir * (1.0 + spread), frostPx).r;
    col.g = frosted(baseUv + dir, frostPx).g;
    col.b = frosted(baseUv + dir * (1.0 - spread), frostPx).b;

    // Glass body: slight brightening + tint, a touch more saturation.
    float l = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(l), col, 1.12);
    col = mix(col, col * uTint + uTint * 0.08, uTintAmt);
    col = col * 1.03 + 0.008;

    // Specular rim: bright on the edge facing the light (top-left), a dimmer
    // bounce on the opposite edge, and a crisp 1px edge line all around.
    vec2 L = normalize(vec2(-0.7, 0.75));
    float facing = max(dot(-n, L), 0.0);
    float back = max(dot(n, L), 0.0);
    float rim = pow(edge, 3.0);
    float edgeLine = 1.0 - smoothstep(0.0, 1.6 / uShortPx, s.r);
    vec3 hi = vec3(1.0) * (rim * (0.9 * facing + 0.18 * back) + edgeLine * 0.3) * uHighlight;
    // Subtle inner shading toward the lower rim for volume.
    col *= 1.0 - 0.18 * rim * back;
    col += hi;

    float a = cover + shadow * (1.0 - cover);
    gl_FragColor = vec4(col, a);
  }
`;

const poseFor = (motion, t) => {
  switch (motion) {
    case 'drift':
      return { x: Math.cos(t * 0.45) * 0.03, y: Math.sin(t * 0.6) * 0.03 };
    case 'sway':
      return { x: Math.sin(t * 0.8) * 0.04, y: 0 };
    case 'flat':
      return { x: 0, y: 0 };
    case 'float':
    default:
      return { x: 0, y: Math.sin(t * 1.1) * 0.015 };
  }
};

function LiquidGlass({
  image,
  width,
  height,
  style,
  scale = 1,
  rotation = 0,
  offsetX = 0,
  offsetY = 0,
  speed = 1,
  motion = 'float',
  bounce = false,
  time = null,
  bevel = 0.5,
  refraction = 0.6,
  frost = 0.08,
  dispersion = 0.4,
  highlight = 0.7,
  tint = '#ffffff',
  getBackdrop,
  backdropColor = '#000000',
}) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const paramsRef = useRef({});
  paramsRef.current = { time, scale, rotation, offsetX, offsetY, speed, motion, bounce, bevel, refraction, frost, dispersion, highlight, tint, getBackdrop, backdropColor, width, height };

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, preserveDrawingBuffer: true, premultipliedAlpha: false });
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uBg: { value: null },
      uHasBg: { value: 0 },
      uBgColor: { value: new THREE.Color('#000000') },
      uShape: { value: null },
      uShapeSize: { value: new THREE.Vector2(1, 1) },
      uRes: { value: new THREE.Vector2(1, 1) },
      uCenter: { value: new THREE.Vector2(0.5, 0.5) },
      uBox: { value: new THREE.Vector2(0.5, 0.5) },
      uAngle: { value: 0 },
      uShortPx: { value: 100 },
      uBezel: { value: 0.3 },
      uRefract: { value: 0.6 },
      uFrost: { value: 0.1 },
      uDisp: { value: 0.4 },
      uTint: { value: new THREE.Color('#ffffff') },
      uTintAmt: { value: 0 },
      uHighlight: { value: 0.7 },
    };
    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true, depthTest: false });
    // Shader output is already display-referred sRGB.
    material.toneMapped = false;
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

    const state = { renderer, scene, camera, uniforms, material, quad, raf: 0, start: performance.now(), shape: null, bgTex: null, bgSrc: null };
    stateRef.current = state;

    const resize = () => {
      const p = paramsRef.current;
      const w = p.width || wrapRef.current?.clientWidth || 1;
      const h = p.height || wrapRef.current?.clientHeight || 1;
      renderer.setPixelRatio(p.width ? 1 : Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
    };
    resize();
    state.resize = resize;
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    if (ro && wrapRef.current) ro.observe(wrapRef.current);

    const draw = (timeSec) => {
      const p = paramsRef.current;
      const shape = state.shape;
      const W = canvas.width;
      const H = canvas.height;
      if (shape && W && H) {
        const t = timeSec * p.speed;
        // Background source: the live background shader canvas, else fill.
        const src = p.getBackdrop ? p.getBackdrop() : null;
        if (src && src.width && src.height) {
          if (state.bgSrc !== src) {
            state.bgTex?.dispose();
            state.bgTex = new THREE.CanvasTexture(src);
            state.bgTex.minFilter = THREE.LinearFilter;
            state.bgTex.generateMipmaps = false;
            state.bgSrc = src;
            state.bgSize = '';
          }
          // GPU storage is sized on first upload; the shader canvas starts
          // small and grows, so reallocate whenever its size changes.
          const size = `${src.width}x${src.height}`;
          if (state.bgSize !== size) {
            state.bgTex.dispose();
            state.bgSize = size;
          }
          state.bgTex.needsUpdate = true;
          uniforms.uBg.value = state.bgTex;
          uniforms.uHasBg.value = 1;
        } else {
          uniforms.uHasBg.value = 0;
        }
        uniforms.uBgColor.value.set(p.backdropColor);

        // Fit (contain) the padded shape box, then apply the user scale.
        const fa = W / H;
        const a = shape.aspect;
        const boxH = Math.min(fa / a, 1) * 0.9 * p.scale;
        const boxW = (boxH * a) / fa;
        // The visible glyphs are a bit smaller than the padded box.
        const contentW = boxW * shape.contentFracW;
        const contentH = boxH * shape.contentFracH;
        let cx;
        let cy;
        if (p.bounce) {
          cx = bounceBetween(contentW / 2, 1 - contentW / 2, t + 7.3, 0.22);
          cy = bounceBetween(contentH / 2, 1 - contentH / 2, t + 3.1, 0.18);
        } else {
          const pose = poseFor(p.motion, t);
          cx = 0.5 + p.offsetX * 0.5 + pose.x;
          cy = 0.5 - p.offsetY * 0.5 + pose.y;
        }
        uniforms.uRes.value.set(W, H);
        uniforms.uCenter.value.set(cx, cy);
        uniforms.uBox.value.set(boxW, boxH);
        uniforms.uAngle.value = THREE.MathUtils.degToRad(-p.rotation);
        uniforms.uShortPx.value = Math.min(contentW * W, contentH * H);
        // Bevel is relative to the thickest stroke: 0 → hairline rim,
        // 1 → the rim reaches the middle of the thickest part.
        uniforms.uBezel.value = shape.maxInside * (0.12 + p.bevel * 0.85);
        uniforms.uRefract.value = p.refraction;
        uniforms.uFrost.value = p.frost;
        uniforms.uDisp.value = p.dispersion;
        uniforms.uHighlight.value = p.highlight;
        uniforms.uTint.value.set(p.tint);
        uniforms.uTintAmt.value = String(p.tint).toLowerCase() === '#ffffff' ? 0 : 0.35;
        renderer.render(scene, camera);
      }
    };
    const tick = () => {
      // While exporting (time set) frames are drawn on demand via __renderAt.
      if (paramsRef.current.time == null && !livePreview.paused) draw((performance.now() - state.start) / 1000);
      state.raf = requestAnimationFrame(tick);
    };
    state.raf = requestAnimationFrame(tick);
    canvas.__renderAt = (sec) => draw(sec);

    return () => {
      cancelAnimationFrame(state.raf);
      ro?.disconnect();
      state.bgTex?.dispose();
      state.shape?.tex.dispose();
      quad.geometry.dispose();
      material.dispose();
      renderer.dispose();
      stateRef.current = null;
    };
  }, []);

  useEffect(() => {
    stateRef.current?.resize?.();
  }, [width, height]);

  useEffect(() => {
    let cancelled = false;
    loadImage(image).then((img) => {
      const s = stateRef.current;
      if (cancelled || !s) return;
      const field = buildShapeField(img);
      s.shape?.tex.dispose();
      s.shape = {
        ...field,
        contentFracW: 1,
        contentFracH: 1,
      };
      // Measure the content box inside the padded field for accurate bounce.
      const data = field.tex.image.data;
      let x0 = field.width; let x1 = -1; let y0 = field.height; let y1 = -1;
      for (let y = 0; y < field.height; y += 1) {
        for (let x = 0; x < field.width; x += 1) {
          if (data[(y * field.width + x) * 4 + 1] > 0.5) {
            if (x < x0) x0 = x;
            if (x > x1) x1 = x;
            if (y < y0) y0 = y;
            if (y > y1) y1 = y;
          }
        }
      }
      if (x1 >= 0) {
        s.shape.contentFracW = (x1 - x0 + 1) / field.width;
        s.shape.contentFracH = (y1 - y0 + 1) / field.height;
      }
      s.uniforms.uShape.value = field.tex;
      s.uniforms.uShapeSize.value.set(field.width, field.height);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [image]);

  const sized = width && height;
  return (
    <div ref={wrapRef} style={sized ? { width, height } : { width: '100%', height: '100%', ...style }}>
      <canvas
        ref={canvasRef}
        width={sized ? width : undefined}
        height={sized ? height : undefined}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  );
}

export default LiquidGlass;
