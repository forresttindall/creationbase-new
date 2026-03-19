import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicImagesDir = path.join(projectRoot, 'public', 'images');

const sources = [
  path.join(projectRoot, 'src', 'components', 'Portraits.jsx'),
  path.join(projectRoot, 'src', 'components', 'StreetPhotography.jsx'),
];

function extractImagePaths(fileContent) {
  const matches = fileContent.matchAll(/['"]\/images\/([^'"]+)['"]/g);
  return Array.from(matches, (m) => m[1]);
}

function toWebpName(fileName) {
  return fileName.replace(/\.[^.]+$/, '.webp');
}

function runCwebp(inputPath, outputPath) {
  const result = spawnSync(
    'cwebp',
    ['-q', '80', '-m', '6', '-metadata', 'none', inputPath, '-o', outputPath],
    { stdio: 'pipe' },
  );
  if (result.status !== 0) {
    const stderr = result.stderr?.toString?.() ?? '';
    const stdout = result.stdout?.toString?.() ?? '';
    throw new Error(`cwebp failed for ${path.basename(inputPath)}\n${stdout}\n${stderr}`.trim());
  }
}

const allFileNames = new Set();
for (const src of sources) {
  const content = await readFile(src, 'utf8');
  for (const fileName of extractImagePaths(content)) {
    allFileNames.add(fileName);
  }
}

const fileNames = Array.from(allFileNames);
fileNames.sort((a, b) => a.localeCompare(b));

const missing = [];
for (const fileName of fileNames) {
  const inputPath = path.join(publicImagesDir, fileName);
  if (!existsSync(inputPath)) missing.push(fileName);
}

if (missing.length) {
  process.stderr.write(`Missing source images:\n${missing.map((m) => `- ${m}`).join('\n')}\n`);
  process.exit(1);
}

let converted = 0;
for (const fileName of fileNames) {
  const inputPath = path.join(publicImagesDir, fileName);
  const outName = toWebpName(fileName);
  const outputPath = path.join(publicImagesDir, outName);
  if (existsSync(outputPath)) continue;
  runCwebp(inputPath, outputPath);
  converted += 1;
  process.stdout.write(`WROTE ${outName}\n`);
}

process.stdout.write(`DONE ${converted} new webp files\n`);
