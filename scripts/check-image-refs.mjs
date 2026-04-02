import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const srcDir = path.join(root, 'src');
const publicImagesDir = path.join(root, 'public', 'images');

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (ent.isFile()) out.push(p);
  }
  return out;
}

const srcFiles = walk(srcDir).filter((p) => /\.(js|jsx|ts|tsx|css)$/.test(p));
const refRegex = /['"]\/(images\/[^'"\n]+)['"]/g;

const refs = new Map();
for (const f of srcFiles) {
  const content = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = refRegex.exec(content))) {
    const rel = m[1];
    if (!refs.has(rel)) refs.set(rel, new Set());
    refs.get(rel).add(path.relative(root, f));
  }
}

const diskFiles = fs.existsSync(publicImagesDir) ? fs.readdirSync(publicImagesDir) : [];
const diskSet = new Set(diskFiles);
const diskLower = new Map(diskFiles.map((n) => [n.toLowerCase(), n]));

const missing = [];
for (const rel of refs.keys()) {
  if (!rel.startsWith('images/')) continue;
  const name = rel.slice('images/'.length);
  if (diskSet.has(name)) continue;
  const ci = diskLower.get(name.toLowerCase());
  missing.push({ rel, name, ci, files: [...refs.get(rel)] });
}

missing.sort((a, b) => a.name.localeCompare(b.name));

console.log(`Total /images refs: ${refs.size}`);
console.log(`Missing (exact match): ${missing.length}`);
for (const item of missing) {
  console.log(`\n/images/${item.name}`);
  if (item.ci) console.log(`  case-insensitive match on disk: ${item.ci}`);
  console.log('  referenced in:');
  for (const f of item.files) console.log(`    - ${f}`);
}

