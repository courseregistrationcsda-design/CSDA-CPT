#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const htmlFile = path.join(ROOT, 'index.html');
const raw = fs.readFileSync(htmlFile);
const html = raw.toString('utf8');

function matches(re) { return [...html.matchAll(re)].length; }
function bytesBetween(re) { return [...html.matchAll(re)].reduce((n, m) => n + Buffer.byteLength(m[1] || ''), 0); }

const embedded = [...html.matchAll(/data:image\/([a-zA-Z0-9.+-]+);base64,([a-zA-Z0-9+/=]+)/g)].map((m, i) => ({
  index: i + 1,
  type: m[1],
  base64Characters: m[2].length,
  decodedBytes: Buffer.from(m[2], 'base64').length
}));

const files = [
  'index.html', 'sw.js', 'manifest.webmanifest', 'vercel.json', 'favicon.ico',
  ...fs.readdirSync(path.join(ROOT, 'modules')).filter(name => name.endsWith('.js')).sort().map(name => 'modules/' + name),
  'icons/icon-192.png', 'icons/icon-192.webp', 'icons/icon-512.png',
  'icons/icon-512.webp', 'icons/maskable-512.png', 'icons/apple-touch-icon.png'
].map(name => {
  const data = fs.readFileSync(path.join(ROOT, name));
  return { file: name, bytes: data.length, sha256: crypto.createHash('sha256').update(data).digest('hex') };
});

const report = {
  generatedAt: new Date().toISOString(),
  cacheVersion: (fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8').match(/var CACHE = '([^']+)'/) || [])[1] || null,
  mainDocument: {
    bytes: raw.length,
    gzipBytes: zlib.gzipSync(raw, { level: 9 }).length,
    brotliBytes: zlib.brotliCompressSync(raw, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } }).length,
    inlineCssBytes: bytesBetween(/<style[^>]*>([\s\S]*?)<\/style>/gi),
    inlineJavaScriptBytes: bytesBetween(/<script[^>]*>([\s\S]*?)<\/script>/gi),
    embeddedImageCount: embedded.length,
    embeddedImageDecodedBytes: embedded.reduce((n, x) => n + x.decodedBytes, 0),
    mediaQueryCount: matches(/@media\b/g),
    keyframeCount: matches(/@keyframes\b/g),
    externalScriptCount: matches(/<script[^>]+src=/gi),
    externalStylesheetCount: matches(/<link[^>]+rel=["']stylesheet/gi)
  },
  embeddedImages: embedded,
  files
};

const outDir = path.join(ROOT, 'reports');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'performance-baseline.json'), JSON.stringify(report, null, 2) + '\n');

const md = `# Performance Baseline\n\n` +
`Generated: ${report.generatedAt}  \nService-worker cache: \`${report.cacheVersion}\`\n\n` +
`## Main document\n\n| Metric | Value |\n|---|---:|\n` +
`| Raw HTML | ${report.mainDocument.bytes.toLocaleString()} bytes |\n` +
`| Gzip level 9 | ${report.mainDocument.gzipBytes.toLocaleString()} bytes |\n` +
`| Brotli quality 11 | ${report.mainDocument.brotliBytes.toLocaleString()} bytes |\n` +
`| Inline CSS | ${report.mainDocument.inlineCssBytes.toLocaleString()} bytes |\n` +
`| Inline JavaScript | ${report.mainDocument.inlineJavaScriptBytes.toLocaleString()} bytes |\n` +
`| Embedded images | ${report.mainDocument.embeddedImageCount} |\n` +
`| Embedded image decoded bytes | ${report.mainDocument.embeddedImageDecodedBytes.toLocaleString()} bytes |\n` +
`| Media queries | ${report.mainDocument.mediaQueryCount} |\n` +
`| Keyframe declarations | ${report.mainDocument.keyframeCount} |\n` +
`| External scripts/stylesheets | ${report.mainDocument.externalScriptCount}/${report.mainDocument.externalStylesheetCount} |\n\n` +
`## Embedded images\n\n| # | Type | Decoded bytes | Base64 characters |\n|---:|---|---:|---:|\n` +
embedded.map(x => `| ${x.index} | ${x.type} | ${x.decodedBytes.toLocaleString()} | ${x.base64Characters.toLocaleString()} |`).join('\n') +
`\n\n## Build files\n\n| File | Bytes |\n|---|---:|\n` +
files.map(x => `| \`${x.file}\` | ${x.bytes.toLocaleString()} |`).join('\n') +
`\n\n## Interpretation\n\nThis is a measurement baseline, not a performance target. Re-run \`npm run baseline\` after intentional payload or asset work and compare the JSON output. Do not update the baseline for unrelated functional changes.\n`;
fs.writeFileSync(path.join(outDir, 'performance-baseline.md'), md);

console.log(`Wrote reports/performance-baseline.json and reports/performance-baseline.md`);
console.log(`HTML ${raw.length} bytes; gzip ${report.mainDocument.gzipBytes}; brotli ${report.mainDocument.brotliBytes}`);
