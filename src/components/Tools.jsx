import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ColorPanels,
  GrainGradient,
  Heatmap,
  LiquidMetal,
  MeshGradient,
  PerlinNoise,
  SimplexNoise,
  SmokeRing,
} from '@paper-design/shaders-react';

const UI_LIGHT = 'var(--color-text)';
const UI_DARK = 'var(--color-bg)';

const FRAME_PRESETS = [
  { id: 'ig-post-1080x1350', label: 'Instagram Post (1080×1350)', width: 1080, height: 1350 },
  { id: 'ig-reel-1080x1920', label: 'Instagram Reel (1080×1920)', width: 1080, height: 1920 },
  { id: 'ig-square-1080', label: 'Instagram Square (1080×1080)', width: 1080, height: 1080 },
  { id: '16x9-1920x1080', label: '16:9 (1920×1080)', width: 1920, height: 1080 },
];

// Master label list for every shader still offered. The Logo and Background
// layers expose curated subsets of this list (see below).
const SHADER_OPTIONS = [
  { id: 'none', label: 'None' },
  { id: 'liquid-metal', label: 'Liquid Metal' },
  { id: 'heatmap', label: 'Heatmap' },
  { id: 'mesh-gradient', label: 'Mesh Gradient' },
  { id: 'grain-gradient', label: 'Grain Gradient' },
  { id: 'smoke-ring', label: 'Smoke Ring' },
  { id: 'color-panels', label: 'Color Panels' },
  { id: 'simplex-noise', label: 'Simplex Noise' },
  { id: 'perlin-noise', label: 'Perlin Noise' },
];

const optionsFor = (ids) => ids.map((id) => SHADER_OPTIONS.find((opt) => opt.id === id));

// The Logo layer offers the image shaders (they shape themselves to the
// uploaded logo's silhouette) plus a few full-frame shaders that fill the logo.
const LOGO_SHADER_OPTIONS = optionsFor([
  'none',
  'liquid-metal',
  'heatmap',
  'mesh-gradient',
  'grain-gradient',
  'smoke-ring',
  'color-panels',
]);

// The Background layer only offers full-frame shaders.
const BG_SHADER_OPTIONS = optionsFor([
  'none',
  'grain-gradient',
  'mesh-gradient',
  'simplex-noise',
  'perlin-noise',
]);

const FONT_OPTIONS = [
  { value: "'PP Neue Machina', system-ui, sans-serif", label: 'Neue Machina' },
  { value: "'Ark es', system-ui, sans-serif", label: 'Ark ES' },
  { value: "'Tiposka', Georgia, serif", label: 'Tiposka' },
  { value: "'Bucklane Script', cursive", label: 'Bucklane Script' },
  { value: "'Mark W1G', cursive", label: 'Mark W1G' },
  { value: "'Doto', system-ui, sans-serif", label: 'Doto' },
];

const DEFAULT_TEXT_FONT = FONT_OPTIONS[0].value;

const DEMO_MASK_URL = '/images/isometric-city-blue.svg';

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const sanitizeSvgMarkup = (raw) => {
  if (!raw) return raw;
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(raw, 'image/svg+xml');
    const root = doc.documentElement;
    if (!root || root.nodeName.toLowerCase() !== 'svg') return raw.replace(/add comment/gi, '');

    const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const parentsToRemove = new Set();
    for (;;) {
      const node = walker.nextNode();
      if (!node) break;
      const text = (node.nodeValue || '').trim();
      if (!text) continue;
      if (/add comment/i.test(text)) {
        if (node.parentElement) parentsToRemove.add(node.parentElement);
      }
    }
    parentsToRemove.forEach((el) => el.remove());

    const serializer = new XMLSerializer();
    return serializer.serializeToString(root);
  } catch {
    return raw.replace(/add comment/gi, '');
  }
};

const buildTextMaskDataUrl = ({ text, color, bold, tracking, fill, font, width, height }) => {
  const value = (text || '').trim();
  if (!value) return null;
  if (typeof document === 'undefined') return null;

  const w = Math.max(64, Math.round(width || 1024));
  const h = Math.max(64, Math.round(height || 1024));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const lines = value.split('\n').map((line) => line.trimEnd()).filter((line) => line.length > 0);
  if (!lines.length) return null;

  const weight = bold ? 700 : 400;
  const family = font || DEFAULT_TEXT_FONT;
  const spacing = clamp(tracking ?? 0, -0.2, 0.6);
  const targetHeight = h * clamp(fill ?? 0.8, 0.12, 1);
  const maxLineWidth = w * 0.9;

  const BASE = 100;
  ctx.font = `${weight} ${BASE}px ${family}`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${(spacing * BASE).toFixed(2)}px`;

  const widest = lines.reduce((max, line) => Math.max(max, ctx.measureText(line).width), 1);
  const blockHeight = lines.length * BASE * 1.08;

  const scale = Math.min(maxLineWidth / widest, targetHeight / blockHeight);
  const fontSize = Math.max(8, BASE * scale);
  const lineHeight = fontSize * 1.08;

  ctx.font = `${weight} ${fontSize}px ${family}`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${(spacing * fontSize).toFixed(2)}px`;
  ctx.fillStyle = color || '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const totalHeight = lineHeight * lines.length;
  const startY = h / 2 - totalHeight / 2 + lineHeight / 2;
  lines.forEach((line, index) => {
    ctx.fillText(line, w / 2, startY + index * lineHeight);
  });

  try {
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  }
};

const loadImageElement = (src) => new Promise((resolve) => {
  if (!src) {
    resolve(null);
    return;
  }
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => resolve(img);
  img.onerror = () => resolve(null);
  img.src = src;
});

const fitRect = (iw, ih, w, h, mode, extraScale = 1) => {
  if (!iw || !ih) {
    const dw = w * extraScale;
    const dh = h * extraScale;
    return { x: (w - dw) / 2, y: (h - dh) / 2, w: dw, h: dh };
  }
  const s = (mode === 'cover' ? Math.max(w / iw, h / ih) : Math.min(w / iw, h / ih)) * extraScale;
  const dw = iw * s;
  const dh = ih * s;
  return { x: (w - dw) / 2, y: (h - dh) / 2, w: dw, h: dh };
};

// Draws the background shader full-frame, then composites the logo shader on
// top. Generative logo shaders are clipped to the logo's opaque area (CSS
// mask-image in preview, destination-in here); image shaders are already
// confined to the source alpha and are drawn through unclipped.
const composeLayersWithSource = (ctx, { bgCanvas, logoCanvas, logoPlain, clipLogo = true, sourceImg, width, height, fitMode, logoScale, scratch }) => {
  if (bgCanvas) ctx.drawImage(bgCanvas, 0, 0, width, height);
  if (logoPlain) {
    if (!sourceImg) return;
    const pr = fitRect(sourceImg.naturalWidth || width, sourceImg.naturalHeight || height, width, height, fitMode, logoScale);
    ctx.drawImage(sourceImg, pr.x, pr.y, pr.w, pr.h);
    return;
  }
  if (!logoCanvas) return;
  if (!clipLogo || !sourceImg) {
    ctx.drawImage(logoCanvas, 0, 0, width, height);
    return;
  }
  if (scratch.width !== width) scratch.width = width;
  if (scratch.height !== height) scratch.height = height;
  const sc = scratch.getContext('2d');
  if (!sc) {
    ctx.drawImage(logoCanvas, 0, 0, width, height);
    return;
  }
  sc.clearRect(0, 0, width, height);
  sc.drawImage(logoCanvas, 0, 0, width, height);
  sc.globalCompositeOperation = 'destination-in';
  const r = fitRect(sourceImg.naturalWidth || width, sourceImg.naturalHeight || height, width, height, fitMode, logoScale);
  sc.drawImage(sourceImg, r.x, r.y, r.w, r.h);
  sc.globalCompositeOperation = 'source-over';
  ctx.drawImage(scratch, 0, 0);
};

const RangeField = ({ label, value, min, max, step, onChange, rangeStyle }) => (
  <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
    <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>{label}</span>
    <input
      style={rangeStyle}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(ev) => onChange(Number(ev.target.value))}
    />
  </label>
);

const SelectField = ({ label, value, options, onChange, fieldBaseStyle }) => (
  <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
    <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>{label}</span>
    <select style={fieldBaseStyle} value={value} onChange={(ev) => onChange(ev.target.value)}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </label>
);

const ColorField = ({ label, value, onChange, styles }) => (
  <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
    <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>{label}</span>
    <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: 10, alignItems: 'center' }}>
      <input style={styles.colorInputStyle} type="color" value={value} onChange={(ev) => onChange(ev.target.value)} />
      <input style={styles.fieldBaseStyle} value={value} onChange={(ev) => onChange(ev.target.value)} />
    </div>
  </label>
);

const ColorListField = ({ label, values, onChange, styles }) => (
  <div style={{ display: 'grid', gap: 10 }}>
    <div className="small-text" style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>{label}</div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {values.map((value, index) => (
        <label key={index} className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
          <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>{`Color ${index + 1}`}</span>
          <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: 10, alignItems: 'center' }}>
            <input style={styles.colorInputStyle} type="color" value={value} onChange={(ev) => onChange(index, ev.target.value)} />
            <input style={styles.fieldBaseStyle} value={value} onChange={(ev) => onChange(index, ev.target.value)} />
          </div>
        </label>
      ))}
    </div>
  </div>
);

const GRAIN_SHAPES = [
  { value: 'wave', label: 'Wave' },
  { value: 'dots', label: 'Dots' },
  { value: 'truchet', label: 'Truchet' },
  { value: 'corners', label: 'Corners' },
  { value: 'ripple', label: 'Ripple' },
  { value: 'blob', label: 'Blob' },
  { value: 'sphere', label: 'Sphere' },
];

// Shaders that take the source image as an input; everything else is a
// full-frame generative shader.
const IMAGE_SHADER_IDS = [
  'liquid-metal',
  'heatmap',
];

const isImageShaderId = (id) => IMAGE_SHADER_IDS.includes(id);

// Every shader parameter lives on a layer object so the Logo and Background
// layers each carry a complete, independent shader configuration.
const createLayerDefaults = () => ({
  effect: 'liquid-metal',
  animate: true,
  speed: 1,
  scale: 0.65,
  rotation: 0,
  offsetX: 0,
  offsetY: 0,

  lmRepetition: 2,
  lmSoftness: 0.1,
  lmShiftRed: 0.3,
  lmShiftBlue: 0.3,
  lmDistortion: 0.07,
  lmContour: 0.4,
  lmAngle: 70,

  hmContour: 0.5,
  hmNoise: 0,
  hmInnerGlow: 0.5,
  hmOuterGlow: 0.5,
  hmAngle: 0,
  hmColors: ['#112069', '#1f3ca3', '#3265e7', '#6bd8ff', '#ffe77a', '#ff9a1f', '#ff4d00'],

  ggColors: ['#7300ff', '#eba8ff', '#00bfff', '#2a00ff'],
  ggColorBack: '#000000',
  ggSoftness: 0.5,
  ggIntensity: 0.5,
  ggNoise: 0.25,
  ggShape: 'corners',

  mgColors: ['#e0eaff', '#241d9a', '#f75092', '#9f50d3'],
  mgDistortion: 0.8,
  mgSwirl: 0.1,
  mgGrainMixer: 0,
  mgGrainOverlay: 0,

  srColors: ['#ffffff', '#ffca0a', '#fc6203'],
  srColorBack: '#000000',
  srNoiseScale: 2,
  srNoiseIterations: 4,
  srRadius: 0.4,
  srThickness: 0.8,
  srInnerShape: 2,

  cpColors: ['#ff9d00', '#fd4f30', '#809bff', '#6d2eff', '#333aff', '#f15cff', '#ffd557'],
  cpColorBack: '#000000',
  cpLength: 1.1,
  cpDensity: 3,
  cpBlur: 0,
  cpFadeIn: 1,
  cpFadeOut: 0.3,
  cpGradient: 0,

  snColors: ['#4449cf', '#ffd1e0', '#f94446', '#ffd36b', '#ffffff'],
  snStepsPerColor: 2,
  snSoftness: 0,

  pnColorFront: '#fccff7',
  pnColorBack: '#632ad5',
  pnProportion: 0.35,
  pnSoftness: 0.1,
  pnOctaveCount: 1,
  pnPersistence: 1,
});

// Curated palettes for the generative shaders. `colors` are the main gradient
// stops and `back` is the backdrop colour (used as colorBack / gap colour).
const SHADER_PALETTES = [
  { id: 'creationbase', label: 'Creationbase', colors: ['#7300ff', '#eba8ff', '#00bfff', '#2a00ff'], back: '#000000' },
  { id: 'spectral', label: 'Spectral', colors: ['#a600ff', '#6200ff', '#33fff5', '#ffffff'], back: '#05000f' },
  { id: 'sunset', label: 'Sunset', colors: ['#ffd166', '#ff8a5c', '#ff4d6d', '#7a1e5a'], back: '#1b0620' },
  { id: 'ocean', label: 'Ocean', colors: ['#5ef1ff', '#00a6ff', '#0057b8', '#001a33'], back: '#00080f' },
  { id: 'acid', label: 'Acid', colors: ['#d0ff00', '#00ffa3', '#00b3ff', '#3b00ff'], back: '#04000f' },
  { id: 'clay', label: 'Clay', colors: ['#f5e6d3', '#d9a066', '#8c4a2f', '#3d1f14'], back: '#160a05' },
  { id: 'noir', label: 'Noir', colors: ['#ffffff', '#c9ccd1', '#5a6069', '#14171c'], back: '#000000' },
  { id: 'paper', label: 'Paper', colors: ['#ffffff', '#efe7db', '#cbbca6', '#8a7a63'], back: '#f7f4ee' },
  { id: 'ember', label: 'Ember', colors: ['#fff3b0', '#ffb703', '#fb8500', '#e63946'], back: '#1a0a00' },
  { id: 'forest', label: 'Forest', colors: ['#d9f99d', '#4ade80', '#15803d', '#052e16'], back: '#02120a' },
  { id: 'candy', label: 'Candy', colors: ['#ffd6e0', '#ff8fab', '#c77dff', '#7b2cbf'], back: '#1a0a1f' },
  { id: 'cyber', label: 'Cyber', colors: ['#00fff0', '#ff00e5', '#7a00ff', '#001eff'], back: '#050014' },
  { id: 'desert', label: 'Desert', colors: ['#ffe8c2', '#e9b872', '#c1663f', '#5c2a18'], back: '#1b0d06' },
  { id: 'mint', label: 'Mint', colors: ['#e6fff7', '#7dffd4', '#00d1a0', '#045c46'], back: '#001410' },
  { id: 'cobalt', label: 'Cobalt', colors: ['#dbeafe', '#60a5fa', '#1d4ed8', '#0b1f5c'], back: '#020617' },
  { id: 'grape', label: 'Grape', colors: ['#f5d0fe', '#e879f9', '#a21caf', '#4a044e'], back: '#160016' },
];

const normalizeHex = (value) => String(value || '').trim().toLowerCase();

const sameHexList = (a, b) => Array.isArray(a) && Array.isArray(b)
  && a.length === b.length
  && a.every((c, i) => normalizeHex(c) === normalizeHex(b[i]));

function Tools() {
  const withTimeout = useCallback((promise, ms, label) => {
    let t = 0;
    const timeoutPromise = new Promise((_, reject) => {
      t = globalThis.setTimeout(() => reject(new Error(`${label} timed out`)), ms);
    });
    return Promise.race([promise, timeoutPromise]).finally(() => {
      if (t) globalThis.clearTimeout(t);
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isMobileDevice = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent || '';
    const coarse = !!window.matchMedia?.('(pointer:coarse)')?.matches;
    return coarse || /iPhone|iPad|iPod|Android/i.test(ua);
  }, []);

  const isIOSDevice = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent || '';
    return /iPhone|iPad|iPod/i.test(ua);
  }, []);

  const lastUrlRef = useRef('');
  const mediaRecorderRef = useRef(null);
  const recordTimeoutRef = useRef(0);
  const recordIntervalRef = useRef(0);
  const recordChunksRef = useRef([]);
  const recordCanvasElRef = useRef(null);
  const ffmpegRef = useRef(null);
  const ffmpegLoadingRef = useRef(null);
  const saveFileHandleRef = useRef(null);
  const lastAutoDownloadUrlRef = useRef('');
  const previewBgMountRef = useRef(null);
  const previewLogoMountRef = useRef(null);
  const exportBgMountRef = useRef(null);
  const exportLogoMountRef = useRef(null);
  const exportScratchRef = useRef(null);
  const [paperExportActive, setPaperExportActive] = useState(false);
  const [paperImageUrl, setPaperImageUrl] = useState('/images/creationbase logo new png.png');

  const [framePresetId, setFramePresetId] = useState(FRAME_PRESETS[0].id);
  const preset = useMemo(() => FRAME_PRESETS.find((p) => p.id === framePresetId) || FRAME_PRESETS[0], [framePresetId]);
  const [customW, setCustomW] = useState(preset.width);
  const [customH, setCustomH] = useState(preset.height);
  const [useCustomFrame, setUseCustomFrame] = useState(false);

  const frameW = useCustomFrame ? clamp(customW || preset.width, 64, 4096) : preset.width;
  const frameH = useCustomFrame ? clamp(customH || preset.height, 64, 4096) : preset.height;

  const [fitMode, setFitMode] = useState('contain');
  const [bgHex, setBgHex] = useState('#ffffff');
  const [logoLayer, setLogoLayer] = useState(() => ({ ...createLayerDefaults(), effect: 'liquid-metal' }));
  const [bgLayer, setBgLayer] = useState(() => ({ ...createLayerDefaults(), effect: 'grain-gradient' }));
  const [layerTab, setLayerTab] = useState('logo');

  const L = layerTab === 'logo' ? logoLayer : bgLayer;
  const update = (patch) => {
    const setter = layerTab === 'logo' ? setLogoLayer : setBgLayer;
    setter((prev) => ({ ...prev, ...patch }));
  };

  const [sourceMode, setSourceMode] = useState('image');
  const [textValue, setTextValue] = useState('CREATIONBASE');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textBold, setTextBold] = useState(true);
  const [textTracking, setTextTracking] = useState(0);
  const [textFill, setTextFill] = useState(0.8);
  const [textFont, setTextFont] = useState(DEFAULT_TEXT_FONT);
  const [fontTick, setFontTick] = useState(0);
  const [logoScale, setLogoScale] = useState(1);
  const [sourceAspect, setSourceAspect] = useState(0);

  // The active layer drives both the flag set below and the control panels.
  // Flag names mirror the previous single-shader implementation so the panels
  // stay unchanged apart from how they read and write values.
  const effect = L.effect;
  const isPaperLiquidMetal = effect === 'liquid-metal';
  const isPaperHeatmap = effect === 'heatmap';
  const isGrainGradient = effect === 'grain-gradient';
  const isMeshGradient = effect === 'mesh-gradient';
  const isSmokeRing = effect === 'smoke-ring';
  const isColorPanels = effect === 'color-panels';
  const isSimplexNoise = effect === 'simplex-noise';
  const isPerlinNoise = effect === 'perlin-noise';
  const isGenerativeShader = effect !== 'none' && !isImageShaderId(effect);
  const setP = (key) => (value) => update({ [key]: value });
  const colorSetter = (key) => (index, value) => update({ [key]: L[key].map((c, i) => (i === index ? value : c)) });

  // Maps a curated palette onto whichever generative shader is active. Shaders
  // with a colour list take the full ramp; the single/dual-colour shaders are
  // mapped onto their own slots. Keeps the manual colour fields fully editable.
  const applyPalette = (id) => {
    const p = SHADER_PALETTES.find((x) => x.id === id);
    if (!p) return;
    const cols = p.colors;
    const back = p.back || cols[cols.length - 1];
    if (isGrainGradient) {
      update({ ggColors: cols, ggColorBack: back });
    } else if (isMeshGradient) {
      update({ mgColors: cols });
    } else if (isSmokeRing) {
      update({ srColors: cols, srColorBack: back });
    } else if (isColorPanels) {
      update({ cpColors: cols, cpColorBack: back });
    } else if (isSimplexNoise) {
      update({ snColors: cols });
    } else if (isPerlinNoise) {
      update({ pnColorFront: cols[0], pnColorBack: back });
    }
  };

  // Derived (not stored) so the dropdown stays truthful the moment any colour
  // field is edited by hand — it simply falls back to "Custom".
  const activePaletteId = useMemo(() => {
    let current = null;
    if (isGrainGradient) current = { colors: L.ggColors, back: L.ggColorBack };
    else if (isMeshGradient) current = { colors: L.mgColors, back: null };
    else if (isSmokeRing) current = { colors: L.srColors, back: L.srColorBack };
    else if (isColorPanels) current = { colors: L.cpColors, back: L.cpColorBack };
    else if (isSimplexNoise) current = { colors: L.snColors, back: null };
    else if (isPerlinNoise) current = { colors: [L.pnColorFront], back: L.pnColorBack };
    if (!current) return 'custom';
    const match = SHADER_PALETTES.find((p) => (
      sameHexList(current.colors, p.colors.slice(0, current.colors.length))
      && (!current.back || normalizeHex(p.back) === normalizeHex(current.back))
    ));
    return match ? match.id : 'custom';
  }, [isGrainGradient, isMeshGradient, isSmokeRing, isColorPanels, isSimplexNoise, isPerlinNoise, L]);

  const textMaskUrl = useMemo(() => {
    if (sourceMode !== 'text') return null;
    return buildTextMaskDataUrl({
      text: textValue,
      color: textColor,
      bold: textBold,
      tracking: textTracking,
      fill: textFill,
      font: textFont,
      width: clamp(frameW, 512, 2048),
      height: clamp(frameH, 512, 2048),
    });
    // fontTick forces a rebuild once the webfont has actually loaded
  }, [sourceMode, textValue, textColor, textBold, textTracking, textFill, textFont, frameW, frameH, fontTick]);

  const paperImage = sourceMode === 'text'
    ? (textMaskUrl || DEMO_MASK_URL)
    : (paperImageUrl || DEMO_MASK_URL);
  const [videoDuration, setVideoDuration] = useState(5);
  const [videoFps, setVideoFps] = useState(30);
  const [isRecording, setIsRecording] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [mp4Download, setMp4Download] = useState(null);
  const [stackLayout, setStackLayout] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 980px)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 980px)');
    const onChange = (ev) => setStackLayout(ev.matches);
    setStackLayout(mq.matches);
    if (mq.addEventListener) {
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  const loadImageFromFile = async (file) => {
    if (!file) return;
    if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
    const isSvg = file.type === 'image/svg+xml' || String(file.name || '').toLowerCase().endsWith('.svg');
    let blobForUrl = file;
    if (isSvg) {
      const raw = await file.text();
      const cleaned = sanitizeSvgMarkup(raw);
      blobForUrl = new Blob([cleaned], { type: 'image/svg+xml' });
    }
    lastUrlRef.current = URL.createObjectURL(blobForUrl);
    setPaperImageUrl(lastUrlRef.current);
  };

  useEffect(() => {
    if (typeof document === 'undefined' || !document.fonts?.ready) return undefined;
    let cancelled = false;
    document.fonts.ready.then(() => { if (!cancelled) setFontTick((t) => t + 1); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined' || !document.fonts?.load) return undefined;
    let cancelled = false;
    const weight = textBold ? 700 : 400;
    Promise.resolve(document.fonts.load(`${weight} 100px ${textFont}`))
      .catch(() => {})
      .then(() => { if (!cancelled) setFontTick((t) => t + 1); });
    return () => { cancelled = true; };
  }, [textFont, textBold]);

  useEffect(() => {
    let cancelled = false;
    loadImageElement(paperImage).then((img) => {
      if (cancelled || !img) return;
      const aw = img.naturalWidth || frameW;
      const ah = img.naturalHeight || frameH;
      setSourceAspect(ah ? aw / ah : 0);
    });
    return () => { cancelled = true; };
  }, [paperImage, frameW, frameH]);

  useEffect(() => {
    return () => {
      if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
      lastUrlRef.current = '';
      if (recordTimeoutRef.current) window.clearTimeout(recordTimeoutRef.current);
      if (recordCanvasElRef.current) {
        try { recordCanvasElRef.current.remove(); } catch (e) { void e; }
        recordCanvasElRef.current = null;
      }
    };
  }, []);

  const waitForCanvasIn = useCallback(async (getMountEl, timeoutMs = 2500) => {
    const start = performance.now();
    for (;;) {
      const mountEl = typeof getMountEl === 'function' ? getMountEl() : getMountEl;
      const canvas = mountEl ? mountEl.querySelector('canvas') : null;
      if (canvas) return canvas;
      if (performance.now() - start > timeoutMs) return null;
      await new Promise((r) => requestAnimationFrame(() => r()));
    }
  }, []);

  const pickVideoMime = useCallback(() => {
    if (typeof MediaRecorder === 'undefined') return { mimeType: '', ext: 'mp4' };
    const isSupported = (t) => t && MediaRecorder.isTypeSupported(t);

    const mp4Candidates = [
      'video/mp4;codecs="avc1.42E01E,mp4a.40.2"',
      'video/mp4;codecs="avc1.4D401E,mp4a.40.2"',
      'video/mp4;codecs="avc1"',
      'video/mp4',
    ];
    const webmCandidates = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
    ];

    const mp4 = mp4Candidates.find(isSupported);
    if (mp4) return { mimeType: mp4, needsTranscode: isIOSDevice };
    const webm = webmCandidates.find(isSupported) || '';
    return { mimeType: webm, needsTranscode: true };
  }, [isIOSDevice]);

  const getFfmpeg = useCallback(async () => {
    if (ffmpegRef.current) return ffmpegRef.current;
    if (ffmpegLoadingRef.current) return ffmpegLoadingRef.current;

    ffmpegLoadingRef.current = (async () => {
      const [{ FFmpeg }, { fetchFile, toBlobURL }] = await Promise.all([
        import('@ffmpeg/ffmpeg'),
        import('@ffmpeg/util'),
      ]);

      const ffmpeg = new FFmpeg();
      const bases = [
        'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd',
        'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm',
        'https://unpkg.com/@ffmpeg/core@0.12.6/dist',
      ];
      let loaded = false;
      let lastError = null;
      for (const base of bases) {
        try {
          const coreURL = await toBlobURL(`${base}/ffmpeg-core.js`, 'text/javascript');
          const wasmURL = await toBlobURL(`${base}/ffmpeg-core.wasm`, 'application/wasm');
          let workerURL = '';
          try {
            workerURL = await toBlobURL(`${base}/ffmpeg-core.worker.js`, 'text/javascript');
          } catch (e) {
            void e;
          }
          await ffmpeg.load(workerURL ? { coreURL, wasmURL, workerURL } : { coreURL, wasmURL });
          loaded = true;
          lastError = null;
          break;
        } catch (e) {
          lastError = e;
        }
      }
      if (!loaded) throw (lastError instanceof Error ? lastError : new Error('FFmpeg failed to load'));

      ffmpegRef.current = { ffmpeg, fetchFile };
      return ffmpegRef.current;
    })();

    return ffmpegLoadingRef.current;
  }, []);

  const requestSaveFileHandle = useCallback(async (filename) => {
    if (typeof window === 'undefined') return null;
    if (isMobileDevice) return null;
    const picker = window.showSaveFilePicker;
    if (typeof picker !== 'function') return null;
    try {
      return await picker({
        suggestedName: filename,
        types: [
          {
            description: 'MP4 Video',
            accept: { 'video/mp4': ['.mp4'] },
          },
        ],
      });
    } catch (e) {
      void e;
      return null;
    }
  }, [isMobileDevice]);

  const writeFileHandle = useCallback(async (handle, blob) => {
    if (!handle) return false;
    try {
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return true;
    } catch (e) {
      void e;
      return false;
    }
  }, []);

  const encodeMp4 = useCallback(async (inputBlob, inputExt) => {
    const { ffmpeg, fetchFile } = await withTimeout(getFfmpeg(), 60000, 'FFmpeg load');
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const inputName = `in-${id}.${inputExt}`;
    const outputName = `out-${id}.mp4`;
    await ffmpeg.writeFile(inputName, await fetchFile(inputBlob));
    try {
      try {
        await withTimeout(
          ffmpeg.exec(['-i', inputName, '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-profile:v', 'baseline', '-level', '4.0', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', outputName]),
          120000,
          'MP4 encode',
        );
      } catch {
        await withTimeout(
          ffmpeg.exec(['-i', inputName, '-an', '-c:v', 'mpeg4', '-q:v', '3', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', outputName]),
          120000,
          'MP4 encode',
        );
      }
      const data = await withTimeout(ffmpeg.readFile(outputName), 20000, 'MP4 read');
      return new Blob([data], { type: 'video/mp4' });
    } finally {
      try { await ffmpeg.deleteFile(inputName); } catch (e) { void e; }
      try { await ffmpeg.deleteFile(outputName); } catch (e) { void e; }
    }
  }, [getFfmpeg, withTimeout]);

  const setMp4DownloadFromBlob = useCallback((blob, filename) => {
    setMp4Download((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return { url: URL.createObjectURL(blob), filename, blob };
    });
  }, []);

  const clearMp4Download = useCallback(() => {
    setMp4Download((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });
  }, []);

  useEffect(() => () => {
    if (mp4Download?.url) URL.revokeObjectURL(mp4Download.url);
  }, [mp4Download]);

  const downloadFromUrl = useCallback((url, filename) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, []);

  const openUrl = useCallback((url) => {
    const w = window.open(url, '_blank', 'noopener,noreferrer');
    if (!w) window.location.assign(url);
  }, []);

  const shareMp4 = useCallback(async () => {
    if (!mp4Download?.blob) return;
    if (!navigator.share) {
      openUrl(mp4Download.url);
      return;
    }
    const fileType = mp4Download.blob.type || 'video/mp4';
    const file = new File([mp4Download.blob], mp4Download.filename, { type: fileType });
    if (navigator.canShare && !navigator.canShare({ files: [file] })) {
      openUrl(mp4Download.url);
      return;
    }
    try {
      await navigator.share({ files: [file], title: 'MATERIAL LAB' });
    } catch (e) {
      void e;
      openUrl(mp4Download.url);
    }
  }, [mp4Download, openUrl]);

  const saveMp4 = useCallback(async () => {
    if (!mp4Download?.url) return;
    if (isMobileDevice) {
      await shareMp4();
      return;
    }
    downloadFromUrl(mp4Download.url, mp4Download.filename);
  }, [downloadFromUrl, isMobileDevice, mp4Download, shareMp4]);

  useEffect(() => {
    if (!mp4Download?.url) return;
    if (isMobileDevice) return;
    if (lastAutoDownloadUrlRef.current === mp4Download.url) return;
    lastAutoDownloadUrlRef.current = mp4Download.url;
    downloadFromUrl(mp4Download.url, mp4Download.filename);
  }, [downloadFromUrl, isMobileDevice, mp4Download]);

  const downloadPng = useCallback(async () => {
    setStatusMessage('Preparing export…');
    setPaperExportActive(true);
    await new Promise((r) => requestAnimationFrame(() => r()));
    const logoPlain = logoLayer.effect === 'none';
    const clipLogo = !logoPlain && !isImageShaderId(logoLayer.effect);
    const bgCanvas = bgLayer.effect === 'none' ? null : await waitForCanvasIn(() => exportBgMountRef.current);
    const logoCanvas = logoPlain ? null : await waitForCanvasIn(() => exportLogoMountRef.current);
    const out = document.createElement('canvas');
    out.width = frameW;
    out.height = frameH;
    const ctx = out.getContext('2d');
    if (!ctx || (!logoCanvas && !logoPlain)) {
      setStatusMessage('Export failed (canvas not ready).');
      setPaperExportActive(false);
      return;
    }
    ctx.clearRect(0, 0, frameW, frameH);
    ctx.fillStyle = bgHex || '#FFFFFF';
    ctx.fillRect(0, 0, frameW, frameH);
    const sourceImg = await loadImageElement(paperImage);
    const scratch = exportScratchRef.current || (exportScratchRef.current = document.createElement('canvas'));
    composeLayersWithSource(ctx, { bgCanvas, logoCanvas, logoPlain, clipLogo, sourceImg, width: frameW, height: frameH, fitMode, logoScale, scratch });
    const url = out.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `creationbase-tools-${frameW}x${frameH}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setPaperExportActive(false);
    setStatusMessage('');
  }, [bgHex, fitMode, frameH, frameW, logoLayer.effect, logoScale, bgLayer.effect, paperImage, waitForCanvasIn]);

  const stopRecording = useCallback(() => {
    if (recordTimeoutRef.current) {
      window.clearTimeout(recordTimeoutRef.current);
      recordTimeoutRef.current = 0;
    }
    if (recordIntervalRef.current) {
      window.clearInterval(recordIntervalRef.current);
      recordIntervalRef.current = 0;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') return;
    setIsFinalizing(true);
    setStatusMessage('Finalizing…');
    const rec = mediaRecorderRef.current;
    if (rec && rec.state === 'recording' && typeof rec.requestData === 'function') {
      try {
        rec.requestData();
      } catch (e) {
        void e;
      }
    }
    if (rec && rec.state !== 'inactive') rec.stop();
  }, []);

  const startRecording = useCallback(async () => {
    if (isRecording || isFinalizing) return;
    if (typeof MediaRecorder === 'undefined' && !isIOSDevice) {
      setStatusMessage('Video export is not supported in this browser (MediaRecorder unavailable).');
      return;
    }
    clearMp4Download();
    saveFileHandleRef.current = null;
    setIsFinalizing(false);

    const { mimeType, needsTranscode } = pickVideoMime();
    if (!mimeType) {
      setStatusMessage('Video export is not supported in this browser.');
      return;
    }
    const ext = 'mp4';
    const outFilename = `creationbase-tools-${frameW}x${frameH}-${videoDuration}s.${ext}`;
    const extraStopMs = isIOSDevice ? 1100 : 0;

    if (!isMobileDevice) {
      const handle = await requestSaveFileHandle(outFilename);
      if (handle) saveFileHandleRef.current = handle;
    }

    setStatusMessage('Preparing recording…');
    const usePreviewCanvas = isIOSDevice;
    if (!usePreviewCanvas) {
      setPaperExportActive(true);
    }
    await new Promise((r) => requestAnimationFrame(() => r()));
    const pick = (previewRef, exportRef) => (usePreviewCanvas ? previewRef.current : exportRef.current);
    const logoPlain = logoLayer.effect === 'none';
    const clipLogo = !logoPlain && !isImageShaderId(logoLayer.effect);
    const bgShaderCanvas = bgLayer.effect === 'none' ? null : await waitForCanvasIn(() => pick(previewBgMountRef, exportBgMountRef));
    const logoShaderCanvas = logoPlain ? null : await waitForCanvasIn(() => pick(previewLogoMountRef, exportLogoMountRef));
    if (!logoShaderCanvas && !logoPlain) {
      setStatusMessage('Recording failed (canvas not ready).');
      setPaperExportActive(false);
      return;
    }

    const out = document.createElement('canvas');
    out.width = frameW;
    out.height = frameH;
    out.style.position = 'fixed';
    out.style.left = '-10000px';
    out.style.top = '0';
    out.style.width = `${frameW}px`;
    out.style.height = `${frameH}px`;
    out.style.opacity = '0';
    out.style.pointerEvents = 'none';
    out.setAttribute('aria-hidden', 'true');
    document.body.appendChild(out);
    recordCanvasElRef.current = out;
    const ctx = out.getContext('2d');
    if (!ctx) {
      setStatusMessage('Recording failed (2D context unavailable).');
      try { out.remove(); } catch (e) { void e; }
      if (recordCanvasElRef.current === out) recordCanvasElRef.current = null;
      setPaperExportActive(false);
      return;
    }

    const sourceImg = await loadImageElement(paperImage);
    const scratch = exportScratchRef.current || (exportScratchRef.current = document.createElement('canvas'));

    if (isIOSDevice) {
      const maxFrames = 180;
      const fps = Math.max(6, Math.min(videoFps, Math.floor(maxFrames / Math.max(1, videoDuration))));
      const totalFrames = Math.max(1, Math.round(videoDuration * fps));
      const pad = (n) => String(n).padStart(5, '0');
      const canvasToPng = () => new Promise((resolve) => {
        out.toBlob((b) => resolve(b), 'image/png');
      });

      // Reads a WebGL shader canvas back into a 2D canvas (flipping vertically)
      // so both layers can be composited through the shared 2D path.
      const grabShaderFrame = (glCanvas) => {
        const gl = glCanvas.getContext('webgl2') || glCanvas.getContext('webgl');
        const w = Math.max(1, gl?.drawingBufferWidth || glCanvas.width || frameW);
        const h = Math.max(1, gl?.drawingBufferHeight || glCanvas.height || frameH);
        const gc = document.createElement('canvas');
        gc.width = w;
        gc.height = h;
        const gctx = gc.getContext('2d');
        if (!gl || !gctx) return glCanvas;
        const px = new Uint8Array(w * h * 4);
        try {
          gl.finish();
          gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
        } catch (e) {
          void e;
          return glCanvas;
        }
        const data = gctx.createImageData(w, h);
        const rowBytes = w * 4;
        for (let y = 0; y < h; y += 1) {
          const srcStart = (h - 1 - y) * rowBytes;
          data.data.set(px.subarray(srcStart, srcStart + rowBytes), y * rowBytes);
        }
        gctx.putImageData(data, 0, 0);
        return gc;
      };

      setIsRecording(true);
      setIsFinalizing(true);
      try {
        setStatusMessage(`Preparing frames… (${fps}fps)`);
        const { ffmpeg, fetchFile } = await withTimeout(getFfmpeg(), 60000, 'FFmpeg load');

        for (let i = 0; i < totalFrames; i += 1) {
          if (i % 12 === 0) setStatusMessage(`Preparing frames… ${i}/${totalFrames}`);
          await new Promise((r) => requestAnimationFrame(() => r()));
          await new Promise((r) => requestAnimationFrame(() => r()));

          ctx.clearRect(0, 0, frameW, frameH);
          ctx.fillStyle = bgHex || '#FFFFFF';
          ctx.fillRect(0, 0, frameW, frameH);

          try {
            composeLayersWithSource(ctx, {
              bgCanvas: bgShaderCanvas ? grabShaderFrame(bgShaderCanvas) : null,
              logoCanvas: logoShaderCanvas ? grabShaderFrame(logoShaderCanvas) : null,
              logoPlain,
              clipLogo,
              sourceImg,
              width: frameW,
              height: frameH,
              fitMode,
              logoScale,
              scratch,
            });
          } catch (e) {
            void e;
          }

          const pngBlob = await canvasToPng();
          if (!pngBlob) throw new Error('Frame encode failed');
          await ffmpeg.writeFile(`frame-${pad(i)}.png`, await fetchFile(pngBlob));
        }

        setStatusMessage('Encoding MP4…');
        const outputName = `out-ios-paper-${Date.now()}.mp4`;
        await withTimeout(
          ffmpeg.exec([
            '-framerate', String(fps),
            '-start_number', '0',
            '-i', 'frame-%05d.png',
            '-an',
            '-c:v', 'libx264',
            '-preset', 'veryfast',
            '-crf', '23',
            '-profile:v', 'baseline',
            '-level', '4.0',
            '-pix_fmt', 'yuv420p',
            '-movflags', '+faststart',
            outputName,
          ]),
          180000,
          'MP4 encode',
        );
        const bytes = await withTimeout(ffmpeg.readFile(outputName), 20000, 'MP4 read');
        const mp4 = new Blob([bytes], { type: 'video/mp4' });
        for (let i = 0; i < totalFrames; i += 1) {
          try { await ffmpeg.deleteFile(`frame-${pad(i)}.png`); } catch (e) { void e; }
        }
        try { await ffmpeg.deleteFile(outputName); } catch (e) { void e; }
        setMp4DownloadFromBlob(mp4, outFilename);
        setStatusMessage('MP4 ready.');
      } catch {
        setStatusMessage('MP4 encoding failed.');
      } finally {
        if (recordCanvasElRef.current) {
          try { recordCanvasElRef.current.remove(); } catch (e) { void e; }
          recordCanvasElRef.current = null;
        }
        setIsRecording(false);
        setIsFinalizing(false);
        setPaperExportActive(false);
      }
      return;
    }

    const fps = Math.max(10, Math.min(60, videoFps));
    const baseFill = bgHex || '#FFFFFF';
    const draw = () => {
      ctx.fillStyle = baseFill;
      ctx.fillRect(0, 0, frameW, frameH);
      composeLayersWithSource(ctx, { bgCanvas: bgShaderCanvas, logoCanvas: logoShaderCanvas, logoPlain, clipLogo, sourceImg, width: frameW, height: frameH, fitMode, logoScale, scratch });
    };
    draw();
    recordIntervalRef.current = window.setInterval(draw, Math.round(1000 / fps));

    await new Promise((r) => requestAnimationFrame(() => r()));
    await new Promise((r) => requestAnimationFrame(() => r()));
    await new Promise((r) => globalThis.setTimeout(r, Math.round(1000 / fps)));
    draw();

    const stream = out.captureStream(fps);
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

    recordChunksRef.current = [];
    recorder.ondataavailable = (ev) => {
      if (ev.data && ev.data.size > 0) recordChunksRef.current.push(ev.data);
    };
    recorder.onstop = async () => {
      if (recordIntervalRef.current) {
        window.clearInterval(recordIntervalRef.current);
        recordIntervalRef.current = 0;
      }
      if (recordCanvasElRef.current) {
        try { recordCanvasElRef.current.remove(); } catch (e) { void e; }
        recordCanvasElRef.current = null;
      }
      const blobType = recorder.mimeType || mimeType || '';
      const inputExt = String(blobType).includes('mp4') ? 'mp4' : 'webm';
      const blob = new Blob(recordChunksRef.current, { type: blobType || 'video/webm' });
      try {
        if (needsTranscode || !String(blobType).startsWith('video/mp4')) {
          setStatusMessage('Encoding MP4…');
          const mp4 = await encodeMp4(blob, inputExt);
          const handle = saveFileHandleRef.current;
          saveFileHandleRef.current = null;
          if (handle && await writeFileHandle(handle, mp4)) {
            setStatusMessage('Saved.');
            clearMp4Download();
          } else {
            setMp4DownloadFromBlob(mp4, outFilename);
            setStatusMessage('MP4 ready.');
          }
        } else {
          const handle = saveFileHandleRef.current;
          saveFileHandleRef.current = null;
          if (handle && await writeFileHandle(handle, blob)) {
            setStatusMessage('Saved.');
            clearMp4Download();
          } else {
            setMp4DownloadFromBlob(blob, outFilename);
            setStatusMessage('MP4 ready.');
          }
        }
      } catch {
        const handle = saveFileHandleRef.current;
        saveFileHandleRef.current = null;
        if (handle && await writeFileHandle(handle, blob)) {
          setStatusMessage('Saved.');
          clearMp4Download();
        } else {
          setMp4DownloadFromBlob(blob, outFilename);
          setStatusMessage('MP4 ready.');
        }
      } finally {
        recordChunksRef.current = [];
        mediaRecorderRef.current = null;
        setIsRecording(false);
        setPaperExportActive(false);
        setIsFinalizing(false);
      }
    };

    mediaRecorderRef.current = recorder;
    setIsRecording(true);
    setIsFinalizing(false);
    setStatusMessage(`Recording ${videoDuration}s video…`);
    recorder.start(250);
    recordTimeoutRef.current = window.setTimeout(() => {
      stopRecording();
    }, Math.max(1, videoDuration) * 1000 + extraStopMs);
  }, [bgHex, bgLayer.effect, clearMp4Download, encodeMp4, fitMode, frameH, frameW, isFinalizing, isIOSDevice, isMobileDevice, isRecording, logoLayer.effect, logoScale, paperImage, pickVideoMime, requestSaveFileHandle, setMp4DownloadFromBlob, stopRecording, videoDuration, videoFps, waitForCanvasIn, writeFileHandle]);

  const pageBg = UI_DARK;
  const pageFg = UI_LIGHT;
  const panelBorder = '1px solid var(--color-border)';
  const panelBg = 'rgba(17, 17, 17, 0.82)';
  const fieldBaseStyle = useMemo(() => ({
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    padding: '10px 10px',
    borderRadius: 10,
    border: panelBorder,
    background: 'rgba(17, 17, 17, 0.92)',
    color: 'var(--color-text)',
    fontFamily: 'var(--font-mono)',
    fontWeight: 'var(--font-mono-weight)',
    fontSize: 'var(--fs-sm)',
    lineHeight: 1.1,
    letterSpacing: '0.02em',
  }), [panelBorder]);
  const panelStyle = useMemo(() => ({
    border: panelBorder,
    borderRadius: 14,
    background: panelBg,
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    padding: 14,
  }), [panelBg, panelBorder]);
  const colorInputStyle = useMemo(() => ({
    width: 44,
    height: 40,
    padding: 0,
    border: panelBorder,
    borderRadius: 10,
    background: 'rgba(17, 17, 17, 0.92)',
  }), [panelBorder]);
  const rangeStyle = useMemo(() => ({ width: '100%', minWidth: 0 }), []);
  const layoutColumns = stackLayout ? '1fr' : 'minmax(280px, 420px) minmax(0, 1fr)';
  const sidePanelMaxHeight = stackLayout ? 'none' : 'calc(var(--vh-stable, 100vh) - 160px)';

  const boxAspect = frameW / frameH;
  const srcAspect = sourceAspect || boxAspect;
  const fitW = fitMode === 'cover'
    ? (srcAspect >= boxAspect ? srcAspect / boxAspect : 1)
    : (srcAspect >= boxAspect ? 1 : srcAspect / boxAspect);
  const fitH = fitMode === 'cover'
    ? (srcAspect >= boxAspect ? 1 : boxAspect / srcAspect)
    : (srcAspect >= boxAspect ? boxAspect / srcAspect : 1);
  const sourceMaskSize = `${(fitW * logoScale * 100).toFixed(3)}% ${(fitH * logoScale * 100).toFixed(3)}%`;
  // Image shaders confine their own output to the source alpha, so they must
  // NOT be clipped again (that would cut the soft dispersion edges). Generative
  // shaders render a full-frame pattern and therefore need the silhouette mask.
  const logoClipToShape = logoLayer.effect !== 'none' && !isImageShaderId(logoLayer.effect);

  const renderLayerShader = (layer, mode, isLogoLayer = false) => {
    const e = layer.effect;
    if (e === 'none') return null;
    // The logo layer must be transparent outside the logo so the background
    // layer shows through. Image shaders already confine their own output to
    // the source's alpha (opacity = img.g) — masking them would clip the soft
    // dispersion/glow edges, so they only get a transparent backdrop here.
    // Generative shaders have no source, so they are clipped to the silhouette.
    const layerBack = isLogoLayer ? '#00000000' : bgHex;
    const common = {
      fit: fitMode,
      // Image shaders draw the logo/text themselves (no CSS mask), so the
      // Logo size control has to reach them through the shader's own scale.
      scale: isLogoLayer && isImageShaderId(e) ? layer.scale * logoScale : layer.scale,
      rotation: layer.rotation,
      offsetX: layer.offsetX,
      offsetY: layer.offsetY,
      speed: layer.animate ? layer.speed : 0,
    };
    const webGlContextAttributes = isIOSDevice ? { preserveDrawingBuffer: true, alpha: true, premultipliedAlpha: false } : undefined;
    const sizing = mode === 'export'
      ? { width: frameW, height: frameH, minPixelRatio: 1, maxPixelCount: Math.max(1, frameW * frameH * 4) }
      : { style: { width: '100%', height: '100%' } };

    if (e === 'heatmap') {
      return (
        <Heatmap
          {...sizing}
          {...common}
          webGlContextAttributes={webGlContextAttributes}
          image={paperImage}
          colors={layer.hmColors}
          colorBack={layerBack}
          contour={layer.hmContour}
          angle={layer.hmAngle}
          noise={layer.hmNoise}
          innerGlow={layer.hmInnerGlow}
          outerGlow={layer.hmOuterGlow}
        />
      );
    }

    if (e === 'grain-gradient') {
      return (
        <GrainGradient
          {...sizing}
          {...common}
          webGlContextAttributes={webGlContextAttributes}
          colors={layer.ggColors}
          colorBack={layer.ggColorBack}
          softness={layer.ggSoftness}
          intensity={layer.ggIntensity}
          noise={layer.ggNoise}
          shape={layer.ggShape}
        />
      );
    }

    if (e === 'mesh-gradient') {
      return (
        <MeshGradient
          {...sizing}
          {...common}
          webGlContextAttributes={webGlContextAttributes}
          colors={layer.mgColors}
          distortion={layer.mgDistortion}
          swirl={layer.mgSwirl}
          grainMixer={layer.mgGrainMixer}
          grainOverlay={layer.mgGrainOverlay}
        />
      );
    }

    if (e === 'smoke-ring') {
      return (
        <SmokeRing
          {...sizing}
          {...common}
          webGlContextAttributes={webGlContextAttributes}
          colors={layer.srColors}
          colorBack={layer.srColorBack}
          noiseScale={layer.srNoiseScale}
          noiseIterations={layer.srNoiseIterations}
          radius={layer.srRadius}
          thickness={layer.srThickness}
          innerShape={layer.srInnerShape}
        />
      );
    }

    if (e === 'color-panels') {
      return (
        <ColorPanels
          {...sizing}
          {...common}
          webGlContextAttributes={webGlContextAttributes}
          colors={layer.cpColors}
          colorBack={layer.cpColorBack}
          length={layer.cpLength}
          density={layer.cpDensity}
          blur={layer.cpBlur}
          fadeIn={layer.cpFadeIn}
          fadeOut={layer.cpFadeOut}
          gradient={layer.cpGradient}
        />
      );
    }

    if (e === 'simplex-noise') {
      return (
        <SimplexNoise
          {...sizing}
          {...common}
          webGlContextAttributes={webGlContextAttributes}
          colors={layer.snColors}
          stepsPerColor={layer.snStepsPerColor}
          softness={layer.snSoftness}
        />
      );
    }

    if (e === 'perlin-noise') {
      return (
        <PerlinNoise
          {...sizing}
          {...common}
          webGlContextAttributes={webGlContextAttributes}
          colorFront={layer.pnColorFront}
          colorBack={layer.pnColorBack}
          proportion={layer.pnProportion}
          softness={layer.pnSoftness}
          octaveCount={layer.pnOctaveCount}
          persistence={layer.pnPersistence}
        />
      );
    }

    return (
      <LiquidMetal
        {...sizing}
        {...common}
        webGlContextAttributes={webGlContextAttributes}
        image={paperImage}
        shape="none"
        colorBack={layerBack}
        colorTint="#ffffff"
        repetition={layer.lmRepetition}
        softness={layer.lmSoftness}
        shiftRed={layer.lmShiftRed}
        shiftBlue={layer.lmShiftBlue}
        distortion={layer.lmDistortion}
        contour={layer.lmContour}
        angle={layer.lmAngle}
      />
    );
  };

  return (
    <motion.section
      className="shader-tool"
      data-header-theme="dark"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{
        background: pageBg,
        color: pageFg,
        minHeight: '100vh',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div style={{ padding: 'var(--spacing-md) var(--spacing-md) var(--spacing-xxl)', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
          <h1 className="section-title" style={{ marginBottom: 0 }}>Material Lab</h1>
          <div className="small-text" style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Shader editor
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--color-border)', margin: 'var(--spacing-md) 0' }} />

        <div style={{ display: 'grid', gridTemplateColumns: layoutColumns, gap: 'var(--spacing-md)', alignItems: 'start' }}>
          <div style={{ ...panelStyle, maxHeight: sidePanelMaxHeight, overflowY: 'auto', overflowX: 'hidden' }}>
            <div className="small-text" style={{ fontWeight: 'var(--font-mono-weight-bold)', marginBottom: 10 }}>INPUT</div>
            <div style={{ display: 'grid', gap: 8 }}>
              <SelectField
                label="Source"
                value={sourceMode}
                options={[{ value: 'image', label: 'Image' }, { value: 'text', label: 'Text' }]}
                onChange={setSourceMode}
                fieldBaseStyle={fieldBaseStyle}
              />

              {sourceMode === 'image' ? (
                <label className="small-text" style={{ display: 'grid', gap: 8, minWidth: 0 }}>
                  <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>
                    Upload PNG or SVG
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/svg+xml"
                    style={{ width: '100%', minWidth: 0 }}
                    onChange={async (ev) => {
                      const file = ev.target.files && ev.target.files[0];
                      if (!file) return;
                      try {
                        await loadImageFromFile(file);
                      } catch (e) {
                        setStatusMessage(e instanceof Error ? e.message : 'Failed to load image');
                      }
                    }}
                  />
                </label>
              ) : (
                <>
                  <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                    <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Text</span>
                    <textarea
                      style={{ ...fieldBaseStyle, minHeight: 64, resize: 'vertical', lineHeight: 1.3 }}
                      value={textValue}
                      rows={2}
                      onChange={(ev) => setTextValue(ev.target.value)}
                    />
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <SelectField
                      label="Weight"
                      value={textBold ? 'bold' : 'regular'}
                      options={[{ value: 'bold', label: 'Bold' }, { value: 'regular', label: 'Regular' }]}
                      onChange={(v) => setTextBold(v === 'bold')}
                      fieldBaseStyle={fieldBaseStyle}
                    />
                    <ColorField label="Text color" value={textColor} onChange={setTextColor} styles={{ colorInputStyle, fieldBaseStyle }} />
                  </div>
                  <SelectField
                    label="Font"
                    value={textFont}
                    options={FONT_OPTIONS}
                    onChange={setTextFont}
                    fieldBaseStyle={fieldBaseStyle}
                  />
                  <RangeField label="Tracking" value={textTracking} min={-0.1} max={0.4} step={0.005} onChange={setTextTracking} rangeStyle={rangeStyle} />
                  <RangeField label="Fill" value={textFill} min={0.2} max={1} step={0.01} onChange={setTextFill} rangeStyle={rangeStyle} />
                </>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                  <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Frame</span>
                  <select style={fieldBaseStyle} value={framePresetId} onChange={(ev) => setFramePresetId(ev.target.value)}>
                    {FRAME_PRESETS.map((p) => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </label>
                <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                  <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Custom</span>
                  <select style={fieldBaseStyle} value={useCustomFrame ? 'custom' : 'preset'} onChange={(ev) => setUseCustomFrame(ev.target.value === 'custom')}>
                    <option value="preset">Preset</option>
                    <option value="custom">Custom</option>
                  </select>
                </label>
              </div>

              {useCustomFrame && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                    <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Width</span>
                    <input style={fieldBaseStyle} type="number" value={customW} min={64} max={4096} onChange={(ev) => setCustomW(Number(ev.target.value))} />
                  </label>
                  <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                    <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Height</span>
                    <input style={fieldBaseStyle} type="number" value={customH} min={64} max={4096} onChange={(ev) => setCustomH(Number(ev.target.value))} />
                  </label>
                </div>
              )}

              <div className="small-text" style={{ fontWeight: 'var(--font-mono-weight-bold)', marginTop: 12 }}>LAYOUT</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                  <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Fit</span>
                  <select style={fieldBaseStyle} value={fitMode} onChange={(ev) => setFitMode(ev.target.value)}>
                    <option value="contain">Contain</option>
                    <option value="cover">Cover</option>
                  </select>
                </label>
                <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                  <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Zoom</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 92px', gap: 10, alignItems: 'center' }}>
                    <input
                      style={rangeStyle}
                      type="range"
                      min={20}
                      max={200}
                      step={1}
                      value={Math.round(L.scale * 100)}
                      onChange={(ev) => {
                        const pct = clamp(Number(ev.target.value), 20, 200);
                        update({ scale: pct / 100 });
                      }}
                    />
                    <input
                      style={fieldBaseStyle}
                      type="number"
                      min={20}
                      max={200}
                      step={1}
                      value={Math.round(L.scale * 100)}
                      onChange={(ev) => {
                        const raw = Number(ev.target.value);
                        if (!Number.isFinite(raw)) return;
                        const pct = clamp(raw, 20, 200);
                        update({ scale: pct / 100 });
                      }}
                    />
                  </div>
                </label>
              </div>

              <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Logo size</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 92px', gap: 10, alignItems: 'center' }}>
                  <input
                    style={rangeStyle}
                    type="range"
                    min={10}
                    max={400}
                    step={1}
                    value={Math.round(logoScale * 100)}
                    onChange={(ev) => setLogoScale(clamp(Number(ev.target.value), 10, 400) / 100)}
                  />
                  <input
                    style={fieldBaseStyle}
                    type="number"
                    min={10}
                    max={400}
                    step={1}
                    value={Math.round(logoScale * 100)}
                    onChange={(ev) => {
                      const raw = Number(ev.target.value);
                      if (!Number.isFinite(raw)) return;
                      setLogoScale(clamp(raw, 10, 400) / 100);
                    }}
                  />
                </div>
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                  <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Pan X</span>
                  <input
                    style={rangeStyle}
                    type="range"
                    min={-1}
                    max={1}
                    step={0.001}
                    value={L.offsetX}
                    onChange={(ev) => update({ offsetX: Number(ev.target.value) })}
                  />
                </label>
                <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                  <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Pan Y</span>
                  <input
                    style={rangeStyle}
                    type="range"
                    min={-1}
                    max={1}
                    step={0.001}
                    value={L.offsetY}
                    onChange={(ev) => update({ offsetY: Number(ev.target.value) })}
                  />
                </label>
              </div>

              <div className="small-text" style={{ fontWeight: 'var(--font-mono-weight-bold)', marginTop: 12 }}>EFFECT</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[{ id: 'logo', label: 'Logo layer' }, { id: 'bg', label: 'Background' }].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setLayerTab(tab.id)}
                    style={{
                      padding: '9px 8px',
                      borderRadius: 10,
                      border: layerTab === tab.id ? '1px solid var(--color-text)' : panelBorder,
                      background: layerTab === tab.id ? 'rgba(255, 255, 255, 0.10)' : 'rgba(17, 17, 17, 0.92)',
                      color: 'var(--color-text)',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 'var(--font-mono-weight-bold)',
                      fontSize: 'var(--fs-sm)',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                  <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Shader</span>
                  <select style={fieldBaseStyle} value={L.effect} onChange={(ev) => update({ effect: ev.target.value })}>
                    {(layerTab === 'bg' ? BG_SHADER_OPTIONS : LOGO_SHADER_OPTIONS).map((opt) => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                </label>
                <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                  <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Animate</span>
                  <select style={fieldBaseStyle} value={L.animate ? 'on' : 'off'} onChange={(ev) => update({ animate: ev.target.value === 'on' })}>
                    <option value="on">On</option>
                    <option value="off">Off</option>
                  </select>
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                  <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Speed</span>
                  <input style={rangeStyle} type="range" min={0} max={2} step={0.01} value={L.speed} onChange={(ev) => update({ speed: Number(ev.target.value) })} />
                </label>
                <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                  <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Rotation</span>
                  <input style={rangeStyle} type="range" min={0} max={360} step={1} value={L.rotation} onChange={(ev) => update({ rotation: Number(ev.target.value) })} />
                </label>
              </div>

              {isGenerativeShader && (
                <SelectField
                  label="Palette"
                  value={activePaletteId}
                  options={[
                    ...SHADER_PALETTES.map((p) => ({ value: p.id, label: p.label })),
                    { value: 'custom', label: 'Custom' },
                  ]}
                  onChange={applyPalette}
                  fieldBaseStyle={fieldBaseStyle}
                />
              )}

              {isPaperLiquidMetal && (
                <>
                  <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                    <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Distortion</span>
                    <input style={rangeStyle} type="range" min={0} max={1} step={0.01} value={L.lmDistortion} onChange={(ev) => update({ lmDistortion: Number(ev.target.value) })} />
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                      <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Repetition</span>
                      <input style={rangeStyle} type="range" min={1} max={10} step={0.1} value={L.lmRepetition} onChange={(ev) => update({ lmRepetition: Number(ev.target.value) })} />
                    </label>
                    <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                      <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Softness</span>
                      <input style={rangeStyle} type="range" min={0} max={1} step={0.01} value={L.lmSoftness} onChange={(ev) => update({ lmSoftness: Number(ev.target.value) })} />
                    </label>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                      <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Shift Red</span>
                      <input style={rangeStyle} type="range" min={-1} max={1} step={0.01} value={L.lmShiftRed} onChange={(ev) => update({ lmShiftRed: Number(ev.target.value) })} />
                    </label>
                    <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                      <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Shift Blue</span>
                      <input style={rangeStyle} type="range" min={-1} max={1} step={0.01} value={L.lmShiftBlue} onChange={(ev) => update({ lmShiftBlue: Number(ev.target.value) })} />
                    </label>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                      <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Contour</span>
                      <input style={rangeStyle} type="range" min={0} max={1} step={0.01} value={L.lmContour} onChange={(ev) => update({ lmContour: Number(ev.target.value) })} />
                    </label>
                    <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                      <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Angle</span>
                      <input style={rangeStyle} type="range" min={0} max={360} step={1} value={L.lmAngle} onChange={(ev) => update({ lmAngle: Number(ev.target.value) })} />
                    </label>
                  </div>
                </>
              )}

              {isPaperHeatmap && (
                <>
                  <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                    <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Contour</span>
                    <input style={rangeStyle} type="range" min={0} max={1} step={0.01} value={L.hmContour} onChange={(ev) => update({ hmContour: Number(ev.target.value) })} />
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                      <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Inner glow</span>
                      <input style={rangeStyle} type="range" min={0} max={1} step={0.01} value={L.hmInnerGlow} onChange={(ev) => update({ hmInnerGlow: Number(ev.target.value) })} />
                    </label>
                    <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                      <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Outer glow</span>
                      <input style={rangeStyle} type="range" min={0} max={1} step={0.01} value={L.hmOuterGlow} onChange={(ev) => update({ hmOuterGlow: Number(ev.target.value) })} />
                    </label>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                      <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Noise</span>
                      <input style={rangeStyle} type="range" min={0} max={1} step={0.01} value={L.hmNoise} onChange={(ev) => update({ hmNoise: Number(ev.target.value) })} />
                    </label>
                    <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                      <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Angle</span>
                      <input style={rangeStyle} type="range" min={0} max={360} step={1} value={L.hmAngle} onChange={(ev) => update({ hmAngle: Number(ev.target.value) })} />
                    </label>
                  </div>

                  <ColorListField label="Colors" values={L.hmColors} onChange={colorSetter('hmColors')} styles={{ colorInputStyle, fieldBaseStyle }} />
                </>
              )}

              {isGrainGradient && (
                <>
                  <SelectField label="Shape" value={L.ggShape} options={GRAIN_SHAPES} onChange={setP('ggShape')} fieldBaseStyle={fieldBaseStyle} />
                  <ColorListField label="Colors" values={L.ggColors} onChange={colorSetter('ggColors')} styles={{ colorInputStyle, fieldBaseStyle }} />
                  <ColorField label="Back color" value={L.ggColorBack} onChange={setP('ggColorBack')} styles={{ colorInputStyle, fieldBaseStyle }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <RangeField label="Softness" value={L.ggSoftness} min={0} max={1} step={0.01} onChange={setP('ggSoftness')} rangeStyle={rangeStyle} />
                    <RangeField label="Intensity" value={L.ggIntensity} min={0} max={1} step={0.01} onChange={setP('ggIntensity')} rangeStyle={rangeStyle} />
                  </div>
                  <RangeField label="Noise" value={L.ggNoise} min={0} max={1} step={0.01} onChange={setP('ggNoise')} rangeStyle={rangeStyle} />
                </>
              )}

              {isMeshGradient && (
                <>
                  <ColorListField label="Colors" values={L.mgColors} onChange={colorSetter('mgColors')} styles={{ colorInputStyle, fieldBaseStyle }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <RangeField label="Distortion" value={L.mgDistortion} min={0} max={1} step={0.01} onChange={setP('mgDistortion')} rangeStyle={rangeStyle} />
                    <RangeField label="Swirl" value={L.mgSwirl} min={0} max={1} step={0.01} onChange={setP('mgSwirl')} rangeStyle={rangeStyle} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <RangeField label="Grain mixer" value={L.mgGrainMixer} min={0} max={1} step={0.01} onChange={setP('mgGrainMixer')} rangeStyle={rangeStyle} />
                    <RangeField label="Grain overlay" value={L.mgGrainOverlay} min={0} max={1} step={0.01} onChange={setP('mgGrainOverlay')} rangeStyle={rangeStyle} />
                  </div>
                </>
              )}

              <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Canvas fill</span>
                <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: 10, alignItems: 'center' }}>
                  <input style={colorInputStyle} type="color" value={bgHex} onChange={(ev) => setBgHex(ev.target.value)} />
                  <input style={fieldBaseStyle} value={bgHex} onChange={(ev) => setBgHex(ev.target.value)} />
                </div>
              </label>

              <button
                type="button"
                className="mobile-nav-link"
                style={{ minHeight: 54 }}
                onClick={downloadPng}
              >
                Download PNG
              </button>

              <div className="small-text" style={{ fontWeight: 'var(--font-mono-weight-bold)', marginTop: 10 }}>VIDEO EXPORT</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                  <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Duration</span>
                  <select style={fieldBaseStyle} value={String(videoDuration)} onChange={(ev) => setVideoDuration(Number(ev.target.value))} disabled={isRecording}>
                    <option value="5">5 seconds</option>
                    <option value="10">10 seconds</option>
                    <option value="20">20 seconds</option>
                  </select>
                </label>
                <label className="small-text" style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                  <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>FPS</span>
                  <select style={fieldBaseStyle} value={String(videoFps)} onChange={(ev) => setVideoFps(Number(ev.target.value))} disabled={isRecording}>
                    <option value="24">24</option>
                    <option value="30">30</option>
                    <option value="60">60</option>
                  </select>
                </label>
              </div>

              {!isRecording ? (
                <button
                  type="button"
                  className="mobile-nav-link"
                  style={{ minHeight: 54 }}
                  onClick={startRecording}
                  disabled={isFinalizing}
                >
                  Download Video (MP4)
                </button>
              ) : (
                <button
                  type="button"
                  className="mobile-nav-link"
                  style={{ minHeight: 54 }}
                  onClick={stopRecording}
                  disabled={isFinalizing}
                >
                  {isFinalizing ? 'Finalizing…' : 'Stop Recording'}
                </button>
              )}

              {mp4Download && !isRecording && (
                <div style={{ display: 'grid', gap: 10 }}>
                  <button
                    type="button"
                    className="mobile-nav-link"
                    style={{ minHeight: 54 }}
                    onClick={saveMp4}
                  >
                    {isMobileDevice ? 'Save to Photos' : 'Save MP4'}
                  </button>
                  <div style={{ border: panelBorder, borderRadius: 12, overflow: 'hidden', background: 'rgba(17, 17, 17, 0.92)' }}>
                    <video
                      src={mp4Download.url}
                      controls
                      playsInline
                      muted
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </div>
                  <button
                    type="button"
                    className="mobile-nav-link"
                    style={{ minHeight: 44, background: 'transparent' }}
                    onClick={clearMp4Download}
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>

          <div style={panelStyle}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div className="small-text" style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>PREVIEW</div>
              <div className="small-text" style={{ opacity: 0.85 }}>
                {`${frameW}×${frameH}`} • {fitMode} • BG {SHADER_OPTIONS.find((opt) => opt.id === bgLayer.effect)?.label || bgLayer.effect} • LOGO {SHADER_OPTIONS.find((opt) => opt.id === logoLayer.effect)?.label || logoLayer.effect}
              </div>
            </div>

            <div style={{ height: 1, background: 'var(--color-border)', margin: '12px 0' }} />

            <div style={{ display: 'grid', placeItems: 'center', width: '100%' }}>
              <div style={{ width: 'min(920px, 100%)' }}>
                <div style={{ position: 'relative', width: '100%', borderRadius: 12, overflow: 'hidden', background: bgHex }}>
                  <div style={{ width: '100%', aspectRatio: `${frameW} / ${frameH}` }}>
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                      <div
                        ref={previewBgMountRef}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                      >
                        {renderLayerShader(bgLayer, 'preview')}
                      </div>
                      {paperImage ? (
                        <div
                          ref={previewLogoMountRef}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            ...(logoClipToShape ? {
                              WebkitMaskImage: `url("${paperImage}")`,
                              WebkitMaskRepeat: 'no-repeat',
                              WebkitMaskPosition: 'center',
                              WebkitMaskSize: sourceMaskSize,
                              maskImage: `url("${paperImage}")`,
                              maskRepeat: 'no-repeat',
                              maskPosition: 'center',
                              maskSize: sourceMaskSize,
                            } : {}),
                          }}
                        >
                          {renderLayerShader(logoLayer, 'preview', true) || (
                            <img
                              src={paperImage}
                              alt=""
                              style={{ display: 'block', width: '100%', height: '100%', objectFit: fitMode, transform: `scale(${logoScale})`, transformOrigin: 'center' }}
                            />
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="small-text" style={{ marginTop: 10, opacity: 0.75, lineHeight: 1.2 }}>
                  {statusMessage || ''}
                </div>
              </div>
            </div>
          </div>
        </div>

        {paperExportActive && (
          <div
            aria-hidden="true"
            style={{
              position: 'fixed',
              left: -10000,
              top: 0,
              width: frameW,
              height: frameH,
              opacity: 0,
              pointerEvents: 'none',
            }}
          >
            <div
              ref={exportBgMountRef}
              style={{ position: 'absolute', inset: 0, width: frameW, height: frameH }}
            >
              {renderLayerShader(bgLayer, 'export')}
            </div>
            <div
              ref={exportLogoMountRef}
              style={{ position: 'absolute', inset: 0, width: frameW, height: frameH }}
            >
              {renderLayerShader(logoLayer, 'export', true)}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}

export default Tools;
