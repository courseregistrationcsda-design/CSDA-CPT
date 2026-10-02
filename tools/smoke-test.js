#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const RUN_BROWSER = process.argv.includes('--browser');
const failures = [];
const warnings = [];
let passed = 0;

function check(condition, label, detail = '') {
  if (condition) {
    passed++;
    console.log(`PASS  ${label}`);
  } else {
    failures.push(detail ? `${label}: ${detail}` : label);
    console.error(`FAIL  ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

function contentType(file) {
  const ext = path.extname(file).toLowerCase();
  return ({
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.webmanifest': 'application/manifest+json; charset=utf-8',
    '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon',
    '.md': 'text/markdown; charset=utf-8'
  })[ext] || 'application/octet-stream';
}

function makeServer() {
  return http.createServer((req, res) => {
    const raw = decodeURIComponent((req.url || '/').split('?')[0]);
    const rel = raw === '/' ? 'index.html' : raw.replace(/^\/+/, '');
    const file = path.resolve(ROOT, rel);
    if (!file.startsWith(ROOT + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404); res.end('Not found'); return;
    }
    res.writeHead(200, { 'Content-Type': contentType(file) });
    fs.createReadStream(file).pipe(res);
  });
}

function request(port, route) {
  return new Promise((resolve, reject) => {
    const req = http.get({ hostname: '127.0.0.1', port, path: route }, res => {
      let size = 0;
      res.on('data', b => { size += b.length; });
      res.on('end', () => resolve({ status: res.statusCode, type: res.headers['content-type'] || '', size }));
    });
    req.on('error', reject);
    req.setTimeout(5000, () => req.destroy(new Error('timeout')));
  });
}

function extractScripts(html) {
  return [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m => m[1]).join('\n');
}

async function staticAndHttpChecks(port) {
  const htmlPath = path.join(ROOT, 'index.html');
  check(fs.existsSync(htmlPath), 'index.html exists');
  if (!fs.existsSync(htmlPath)) return;
  const html = fs.readFileSync(htmlPath, 'utf8');

  check(/<!doctype html>/i.test(html), 'HTML doctype present');
  check(/<meta\s+name="viewport"/i.test(html), 'Responsive viewport configured');
  check(/id="feed"/.test(html), 'Catalogue feed mount exists');
  check(/id="q"/.test(html), 'Search control exists');
  check(/id="enrollBtn"/.test(html), 'Enrollment entry point exists');
  check(/id="adminBtn"/.test(html), 'Admin entry point exists');
  check(/id="rentBtn"/.test(html), 'Facility-rental entry point exists');
  check(/id="printarea"/.test(html), 'Print area exists');
  check(/prefers-reduced-motion/.test(html), 'Reduced-motion support exists');
  check(/navigator\.serviceWorker\.register\('\/sw\.js'\)/.test(html), 'Service-worker registration exists');
  check(/role=\\?"tablist\\?"/.test(html) && /role=\\?"tabpanel\\?"/.test(html), 'Accessible tab semantics present');
  check(/aria-invalid/.test(html) && /aria-describedby/.test(html), 'Persistent validation semantics present');
  check(/aria-live="polite"/.test(html) && /role="status"/.test(html), 'Live status region present');
  check(/trapModalFocus/.test(html) && /modalReturnFocus/.test(html), 'Overlay focus management present');
  check(/\[role="checkbox"\],\[role="radio"\]/.test(html), 'Custom-control keyboard support present');
  check(/rentstage\.choosing/.test(html) && /rentFormRight/.test(html), 'Facility split-panel motion present');
  check(/table-scroll-cue/.test(html) && /Swipe to see more/.test(html), 'Mobile table scroll cue present');
  check(/class=\\?"enprogress/.test(html) && /ENROLL_TABS\.length/.test(html), 'Explicit enrollment progress present');
  check(/Finalize and create PDF/.test(html) && /data-eact=\\?"saverec/.test(html), 'Final enrollment actions clarified');
  check(/role=\\?"progressbar/.test(html) && /aria-valuemax=\\?"6/.test(html), 'Six-step enrollment progress bar present');
  check(/isShortCourseOrWorkshop/.test(html) && /shortPromoAllowed/.test(html), 'Short-course discount restrictions present');
  check(/animation-iteration-count:1!important/.test(html), 'Repeated decorative glints disabled');
  check(/closeWithDataCheck/.test(html) && /discard unfinished changes/.test(html), 'Guarded close confirmation present');
  check(/Discount options/.test(html) && !/Equivalent price under each promo/.test(html), 'Promo prices combined with discount controls');
  check(/backupStatus/.test(html) && /backup-out/.test(html), 'Backup status and export controls present');
  check(/Workflow gate only/.test(html), 'Administrative security expectation present');
  check(/USAGE_EVENTS/.test(html) && /csda_usage_counts/.test(html), 'Privacy-safe local workflow counters present');
  check(!/trackEvent\([^)]*(query|student|guardian|payment|receipt)/.test(html), 'Usage counters avoid sensitive values');

  /* Only inspect the initial DOM markup. Generated HTML strings inside JavaScript
     legitimately reuse field IDs because only one tab/panel exists at a time. */
  const staticMarkup = html
    .replace(/<script(?:\s[^>]*)?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style(?:\s[^>]*)?>[\s\S]*?<\/style>/gi, '');
  const ids = [...staticMarkup.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  const duplicateIds = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  check(duplicateIds.length === 0, 'No duplicate static IDs', duplicateIds.join(', '));

  const temp = path.join(ROOT, '.smoke-inline.js');
  fs.writeFileSync(temp, extractScripts(html));
  const syntax = spawnSync(process.execPath, ['--check', temp], { encoding: 'utf8' });
  fs.rmSync(temp, { force: true });
  check(syntax.status === 0, 'Inline JavaScript parses', (syntax.stderr || '').trim());

  const jsonFiles = ['package.json', 'package-lock.json', 'vercel.json', 'manifest.webmanifest'];
  for (const name of jsonFiles) {
    try { JSON.parse(fs.readFileSync(path.join(ROOT, name), 'utf8')); check(true, `${name} parses`); }
    catch (e) { check(false, `${name} parses`, e.message); }
  }

  const assets = [
    ['/', 'text/html'], ['/manifest.webmanifest', 'application/manifest+json'],
    ['/sw.js', 'text/javascript'], ['/favicon.ico', 'image/'],
    ['/icons/icon-192.png', 'image/png'], ['/icons/icon-512.png', 'image/png'],
    ['/icons/icon-192.webp', 'image/webp'], ['/icons/icon-512.webp', 'image/webp'],
    ['/icons/maskable-512.png', 'image/png'], ['/icons/apple-touch-icon.png', 'image/png']
  ];
  for (const [route, expectedType] of assets) {
    try {
      const r = await request(port, route);
      check(r.status === 200 && r.size > 0, `HTTP ${route}`, `status ${r.status}, ${r.size} bytes`);
      check(r.type.startsWith(expectedType), `MIME ${route}`, `${r.type}; expected ${expectedType}`);
    } catch (e) { check(false, `HTTP ${route}`, e.message); }
  }
}

async function browserChecks(port) {
  let puppeteer;
  try { puppeteer = require('puppeteer'); }
  catch (e) { check(false, 'Puppeteer available', e.message); return; }

  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  } catch (e) {
    check(false, 'Headless browser launches', e.message.split('\n')[0]);
    return;
  }

  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 3300));

    check(await page.$('#feed') !== null, 'Browser: catalogue mount rendered');
    check(await page.$('.pc:not(.ghost)') !== null, 'Browser: course card rendered');
    check(await page.$('#enrollBtn') !== null, 'Browser: enrollment action rendered');

    const viewports = [[320,568],[390,844],[768,1024],[1280,720],[1440,900],[1920,1080],[2560,1440]];
    for (const [width, height] of viewports) {
      await page.setViewport({ width, height });
      await new Promise(r => setTimeout(r, 100));
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        headerVisible: !!document.querySelector('#enrollBtn')?.getClientRects().length,
        feedVisible: !!document.querySelector('#feed')?.getClientRects().length
      }));
      check(state.overflow <= 1, `Responsive ${width}x${height}: no page overflow`, `${state.overflow}px overflow`);
      check(state.headerVisible && state.feedVisible, `Responsive ${width}x${height}: primary UI visible`);
    }
    await page.setViewport({ width: 1440, height: 900 });

    await page.click('.pc:not(.ghost)');
    await new Promise(r => setTimeout(r, 800));
    check(await page.$('.pc.flipped .pcback') !== null, 'Browser: course detail opens');
    check(await page.$('.cardveil.on') !== null, 'Browser: course backdrop opens');

    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 700));
    check(await page.$('.pc.flipped') === null, 'Browser: course detail closes');

    await page.click('#enrollBtn');
    await new Promise(r => setTimeout(r, 450));
    check(await page.$('#enroll.on') !== null, 'Browser: enrollment modal opens');
    check(errors.length === 0, 'Browser: no console/page errors', errors.join(' | '));
  } finally {
    await browser.close();
  }
}

(async () => {
  const server = makeServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const port = server.address().port;

  try {
    await staticAndHttpChecks(port);
    if (RUN_BROWSER) await browserChecks(port);
    else warnings.push('Browser interaction checks skipped. Run `npm run smoke:browser` in an environment with Chrome runtime libraries.');
  } finally {
    await new Promise(resolve => server.close(resolve));
  }

  console.log(`\n${passed} checks passed; ${failures.length} failed; ${warnings.length} warning(s).`);
  warnings.forEach(w => console.warn(`WARN  ${w}`));
  if (failures.length) {
    console.error('\nFailures:'); failures.forEach(f => console.error(`- ${f}`));
    process.exitCode = 1;
  }
})().catch(e => { console.error(e); process.exitCode = 1; });
