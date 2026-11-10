import * as THREE from 'three';

// Traces the alpha silhouette of a canvas into THREE.Shape objects (outer
// outlines with their holes) so it can be extruded into real, closed 3D
// geometry. Uses marching squares with sub-pixel interpolation, joins the
// segments into loops, simplifies them, and nests holes by containment.
//
// Output coordinates: the canvas maps to a box `aspect` wide and 1 tall,
// centred on the origin, +y up.

const MAX_GRID_SIDE = 1100;
const MIN_GRID_SHORT_SIDE = 140;

const gridFrom = (src) => {
  const short = Math.min(src.width, src.height);
  const long = Math.max(src.width, src.height);
  // Keep thin shapes (wide text) resolvable while bounding the work.
  let k = Math.max(MIN_GRID_SHORT_SIDE / short, Math.min(1, 640 / long));
  k = Math.min(k, MAX_GRID_SIDE / long);
  const w = Math.max(2, Math.round(src.width * k));
  const h = Math.max(2, Math.round(src.height * k));
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(src, 0, 0, w, h);
  const px = ctx.getImageData(0, 0, w, h).data;
  // One-pixel empty border so every contour closes.
  const W = w + 2;
  const H = h + 2;
  const a = new Float32Array(W * H);
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      a[(y + 1) * W + (x + 1)] = px[(y * w + x) * 4 + 3] / 255;
    }
  }
  return { a, W, H, w, h };
};

// Edge ids for a cell (x, y): T top, R right, B bottom, L left.
const CASES = {
  1: [['L', 'B']],
  2: [['B', 'R']],
  3: [['L', 'R']],
  4: [['T', 'R']],
  5: [['T', 'R'], ['L', 'B']],
  6: [['T', 'B']],
  7: [['L', 'T']],
  8: [['L', 'T']],
  9: [['T', 'B']],
  10: [['L', 'T'], ['B', 'R']],
  11: [['T', 'R']],
  12: [['L', 'R']],
  13: [['B', 'R']],
  14: [['L', 'B']],
};

const marchingSquares = ({ a, W, H }) => {
  const iso = 0.5;
  const at = (x, y) => a[y * W + x];
  const points = new Map();
  const adj = new Map();
  const lerp = (v0, v1) => {
    const d = v1 - v0;
    return Math.abs(d) < 1e-6 ? 0.5 : Math.min(1, Math.max(0, (iso - v0) / d));
  };
  const edgePoint = (x, y, e) => {
    let key;
    let p;
    if (e === 'T') { key = `h${x},${y}`; p = [x + lerp(at(x, y), at(x + 1, y)), y]; }
    else if (e === 'B') { key = `h${x},${y + 1}`; p = [x + lerp(at(x, y + 1), at(x + 1, y + 1)), y + 1]; }
    else if (e === 'L') { key = `v${x},${y}`; p = [x, y + lerp(at(x, y), at(x, y + 1))]; }
    else { key = `v${x + 1},${y}`; p = [x + 1, y + lerp(at(x + 1, y), at(x + 1, y + 1))]; }
    if (!points.has(key)) points.set(key, p);
    return key;
  };
  const link = (k1, k2) => {
    if (!adj.has(k1)) adj.set(k1, []);
    if (!adj.has(k2)) adj.set(k2, []);
    adj.get(k1).push(k2);
    adj.get(k2).push(k1);
  };
  for (let y = 0; y < H - 1; y += 1) {
    for (let x = 0; x < W - 1; x += 1) {
      const idx = (at(x, y) > iso ? 8 : 0) | (at(x + 1, y) > iso ? 4 : 0)
        | (at(x + 1, y + 1) > iso ? 2 : 0) | (at(x, y + 1) > iso ? 1 : 0);
      const segs = CASES[idx];
      if (!segs) continue;
      for (const [e1, e2] of segs) link(edgePoint(x, y, e1), edgePoint(x, y, e2));
    }
  }
  // Walk the degree-2 graph into closed loops.
  const visited = new Set();
  const loops = [];
  for (const start of adj.keys()) {
    if (visited.has(start)) continue;
    const loop = [];
    let prev = null;
    let cur = start;
    while (cur && !visited.has(cur)) {
      visited.add(cur);
      loop.push(points.get(cur));
      const nb = adj.get(cur) || [];
      const next = nb[0] !== prev && !visited.has(nb[0]) ? nb[0] : (nb[1] !== prev && !visited.has(nb[1]) ? nb[1] : null);
      prev = cur;
      cur = next;
    }
    if (loop.length >= 3) loops.push(loop);
  }
  return loops;
};

// Douglas–Peucker on a closed loop.
const simplify = (pts, tol) => {
  if (pts.length < 8) return pts;
  const sq = tol * tol;
  const segDist = (p, a, b) => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const l = dx * dx + dy * dy;
    let t = l ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l : 0;
    t = Math.max(0, Math.min(1, t));
    const x = a[0] + t * dx - p[0];
    const y = a[1] + t * dy - p[1];
    return x * x + y * y;
  };
  const dp = (arr) => {
    const keep = new Uint8Array(arr.length);
    keep[0] = 1;
    keep[arr.length - 1] = 1;
    const stack = [[0, arr.length - 1]];
    while (stack.length) {
      const [s, e] = stack.pop();
      let max = 0;
      let idx = -1;
      for (let i = s + 1; i < e; i += 1) {
        const d = segDist(arr[i], arr[s], arr[e]);
        if (d > max) { max = d; idx = i; }
      }
      if (max > sq && idx > 0) {
        keep[idx] = 1;
        stack.push([s, idx], [idx, e]);
      }
    }
    return arr.filter((_, i) => keep[i]);
  };
  // Split the loop at its farthest point so both halves are open polylines.
  let far = 0;
  let farD = -1;
  for (let i = 1; i < pts.length; i += 1) {
    const d = (pts[i][0] - pts[0][0]) ** 2 + (pts[i][1] - pts[0][1]) ** 2;
    if (d > farD) { farD = d; far = i; }
  }
  const a = dp(pts.slice(0, far + 1));
  const b = dp([...pts.slice(far), pts[0]]);
  return [...a.slice(0, -1), ...b.slice(0, -1)];
};

const area = (pts) => {
  let s = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i, i += 1) {
    s += (pts[j][0] - pts[i][0]) * (pts[j][1] + pts[i][1]);
  }
  return s / 2;
};

const contains = (poly, p) => {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};

export const traceShapes = (src) => {
  const grid = gridFrom(src);
  const minArea = (grid.w * grid.h) * 0.00004 + 2;
  const loops = marchingSquares(grid)
    .map((l) => simplify(l, 0.45))
    .filter((l) => l.length >= 3 && Math.abs(area(l)) > minArea);

  const aspect = src.width / src.height;
  const toShape = ([x, y]) => new THREE.Vector2(((x - 1) / grid.w - 0.5) * aspect, 0.5 - (y - 1) / grid.h);

  // Nesting depth decides outline (even) vs hole (odd).
  const info = loops.map((pts, i) => ({
    pts,
    absArea: Math.abs(area(pts)),
    depth: loops.reduce((n, other, j) => (j !== i && contains(other, pts[0]) ? n + 1 : n), 0),
  }));
  const outers = info.filter((l) => l.depth % 2 === 0);
  const shapes = outers.map((o) => ({ o, shape: new THREE.Shape(o.pts.map(toShape)) }));
  info.filter((l) => l.depth % 2 === 1).forEach((hole) => {
    // Attach to the smallest outline that contains it.
    let best = null;
    shapes.forEach((s) => {
      if (s.o.depth === hole.depth - 1 && contains(s.o.pts, hole.pts[0]) && (!best || s.o.absArea < best.o.absArea)) best = s;
    });
    if (best) best.shape.holes.push(new THREE.Path(hole.pts.map(toShape)));
  });
  return { shapes: shapes.map((s) => s.shape), aspect };
};

export default traceShapes;
