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
  const htmlDocument = fs.readFileSync(htmlPath, 'utf8');
  const moduleDir = path.join(ROOT, 'modules');
  const moduleSource = fs.existsSync(moduleDir) ? fs.readdirSync(moduleDir).filter(f => f.endsWith('.js')).map(f => fs.readFileSync(path.join(moduleDir, f), 'utf8')).join('\n') : '';
  const html = htmlDocument + '\n' + moduleSource;

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
  check(html.indexOf('Delivery Team: trainer assignment') > html.indexOf("if (eTab === 'schedule')") && html.indexOf('Delivery Team: trainer assignment') < html.indexOf('long-form course: a date range'), 'Delivery Team controls are located under Schedule');
  check(/sections complete/.test(html) && /Ready for review/.test(html) && /Missing:/.test(html), 'Persistent enrollment completion summary present');
  check(/Schedule completion requires an assigned trainer/.test('Schedule completion requires an assigned trainer') && /!E\.trainer/.test(html), 'Schedule completion requires an assigned trainer');
  check(/isShortCourseOrWorkshop/.test(html) && /shortPromoAllowed/.test(html), 'Short-course discount restrictions present');
  check(/animation-iteration-count:1!important/.test(html), 'Repeated decorative glints disabled');
  check(/closeWithDataCheck/.test(html) && /discard unfinished changes/.test(html), 'Guarded close confirmation present');
  check(/Discount options/.test(html) && !/Equivalent price under each promo/.test(html), 'Promo prices combined with discount controls');
  check(/backupStatus/.test(html) && /backup-out/.test(html), 'Backup status and export controls present');
  check(/credentialVerifier/.test(html) && /PBKDF2/.test(html) && /Credential upgrade required/.test(html), 'Verifier-based Administrator credential upgrade present');
  check(/newRecoveryKey/.test(html) && /Recover Administrator access/.test(html) && /shown once/.test(html), 'Offline one-time recovery key flow present');
  check(/delete DB\.cfg\.pwd/.test(html) && /legacy default can no longer be used/.test(html), 'Reusable legacy password removed after migration');
  check(/USAGE_EVENTS/.test(html) && /csda_usage_counts/.test(html), 'Privacy-safe local workflow counters present');
  check(!/trackEvent\([^)]*(query|student|guardian|payment|receipt)/.test(html), 'Usage counters avoid sensitive values');
  check(/catalogVersion:\s*'course-list-2026-10'/.test(html), '2026 uploaded course catalogue present');
  check(/\"code\": \"FND101\"/.test(html) && /\"code\": \"SWTA12\"/.test(html), 'Course-list boundary codes present');
  check(/uploaded 2026 course sheet is authoritative/.test(html), 'Saved-data catalogue migration present');
  check(/courseArtEditorHTML/.test(html) && /id=\\?"artCanvas/.test(html), 'Course artwork editor present');
  check(/data-art=\\?"rotate-left/.test(html) && /data-art=\\?"apply/.test(html), 'Artwork transform controls present');
  check(/class=\\?"pcart/.test(html) && /pbbackart/.test(html), 'Responsive course artwork states present');
  check(/artTone/.test(html) && /contrast selection/.test(html), 'Artwork-driven contrast calculation present');
  check(/pcback\.art-dark/.test(html) && /pcback\.art-light/.test(html), 'Full-bleed contrast themes present');
  check(/artFull/.test(html) && /pbbackart\{object-fit:contain/.test(html), 'Complete focused artwork preservation present');
  check(/pbbackfill/.test(html) && /height:min\(78dvh,720px\)/.test(html), 'Full-size adaptive artwork card present');
  check(/data-act="launch-monitor"/.test(html) && /Class Status &amp; Verification Hub/.test(html), 'Class lifecycle monitor overlay present');
  check(/TIMELINE_SCHEDULED/.test(html) && /TIMELINE_ALMOST_DONE/.test(html) && /lifecycleOf/.test(html), 'Lifecycle state engine present');
  check(/remaining>0 && remaining<=2/.test(html), 'Final two-session threshold present');
  check(/Certification Clearance Pending/.test(html), 'Done-state certification warning present');
  check(/singleDay/.test(html) && /entire calendar date/.test(html), 'One-day workshop lifecycle boundary present');
  check(/draggable="true"/.test(html) && /data-lifephase/.test(html) && /addEventListener\('drop'/.test(html), 'Native lifecycle card drag and drop present');
  check(/lifeMoveSelect/.test(html) && /accessible control/.test(html), 'Accessible timeline move control present');
  check(/lifecycleDetails/.test(html) && /data-lifestatus="active"/.test(html) && /data-lifestatus="dropped"/.test(html) && /data-lifestatus="cancelled"/.test(html), 'Class detail and enrollment status controls present');
  check(/certification gates unchanged/.test(html) && /Timeline moves affect schedule status only/.test(html), 'Timeline overrides isolated from certification gates');
  check(/timelineOverride\.scheduleKey===lifecycleScheduleKey\(rec\)/.test(html), 'Schedule edits invalidate manual timeline overrides');
  check(/addEventListener\('pointermove'/.test(html) && /lifedragghost/.test(html), 'Mouse and touch pointer drag fallback present');
  check(/touch-action:none/.test(html) && /min-height:72px/.test(html) && /pointer:coarse/.test(html), 'Full-card thumb-sized drag target present');
  check(/status-active\{background:#e7f7ee/.test(html) && /status-dropped\{background:#fde8e7/.test(html) && /status-cancelled\{background:#e7e9ed/.test(html), 'Active dropped and cancelled card colors present');
  check(/adminWho/.test(html) && /Administrator access opened/.test(html) && /Administrator access closed/.test(html), 'Named Admin access logging present');
  check(/state===TIMELINE_DONE\)\{lifecycleDetailRef=rc\.ref/.test(html) && /Completion Audit/.test(html), 'Done transition opens completion audit');
  check(/lifecycleAuditSeen/.test(html) && /certification&&r\.certification\.finalized/.test(html), 'Automatic Done audit queue present');
  check(/approvedPaymentsTotal/.test(html) && /data-auditpay/.test(html), 'Completion audit payment approval present');
  check(/auditPortfolio/.test(html) && /auditTrainerReport/.test(html) && /data-auditclear/.test(html), 'Academic trainer and Admin clearance gates present');
  check(/Automatically taken from the student name/.test(html) && /Automatically taken from the assigned trainer/.test(html), 'Academic and trainer sign-offs come automatically from enrollment');
  check(/Confirm portfolio verified/.test(html) && /Confirm trainer report verified/.test(html) && !/auditPortfolioOK/.test(html) && !/auditTrainerOK/.test(html), 'Audit verification uses explicit confirmation buttons instead of checkboxes');
  check(/Refund required/.test(html) && /auditRefundReceipt/.test(html) && /refundConfirmed/.test(html), 'Financial clearance reconciles refunds with receipt and confirmation');
  check(/still require action/.test(html) && /Payment receipts:/.test(html), 'Pending clearance provides a detailed actionable checklist');
  check(/<option value="COMPETENT"/.test(html) && /<option value="NOT YET COMPETENT"/.test(html), 'Competency result dropdown present');
  check(/trainer\.grades==='COMPETENT'\|\|trainer\.grades==='NOT YET COMPETENT'/.test(html) && /result itself does not determine financial or administrative clearance/.test(html), 'Either recorded competency result may proceed to clearance');
  check(/General Administrative Guidelines/.test(html) && /adminGeneralGuidelines/.test(html) && /csda-general-administrative-guidelines\.html/.test(html), 'In-app General Guidelines and printable guidebook are linked');
  check(/guideSearchHTML/.test(html) && /ask in everyday English/.test(html) && /Common problems and solutions/.test(html), 'General Guidelines include searchable plain-language troubleshooting');
  check(/guideNorm/.test(html) && /reciept/.test(html) && /clearnce/.test(html) && /guideDistance/.test(html), 'Guide Search recognizes casual wording and common misspellings');
  check(/question is never sent/.test(html) && /Reviewed external resources/.test(html) && /navigator\.onLine/.test(html), 'Guide Search keeps queries local and conditionally offers reviewed online resources');
  check(/tesda\.gov\.ph/.test(html) && /privacy\.gov\.ph/.test(html) && /bsp\.gov\.ph/.test(html), 'Guide uses curated official Philippine reference links');
  check(/adminWorkQueue/.test(html) && /Today \/ Work Queue/.test(html) && /Refund actions/.test(html), 'Admin daily work queue summarizes actionable records');
  check(/Local record search and filters/.test(html) && /workFilters/.test(html) && /workClearance/.test(html) && /workRefund/.test(html), 'Local operational search and multi-field filters present');
  check(/Reminder thresholds/.test(html) && /paymentDays/.test(html) && /Completion Audit overdue/.test(html), 'Configurable non-automatic reminders present');
  check(/No automatic deletion/.test(html) && /data-workarchive/.test(html) && /retentionHeld/.test(html), 'Guarded manual archive respects retention holds');
  check(/record_archived/.test(html) && /record_restored/.test(html) && /archiveReason/.test(html), 'Archive and restore actions record named operational history');
  check(/adminshell/.test(html) && /Daily Work/.test(html) && /Catalogue/.test(html) && /Governance/.test(html), 'Admin uses grouped responsive sidebar navigation');
  check(/nextAdminTab==='monitor'/.test(html) && /launchLifecycleMonitor\(\)/.test(html), 'Class Monitor sidebar entry launches the monitor instead of a blank Admin panel');
  check(/adminCompletionAudits[\s\S]{0,300}localeCompare/.test(html), 'Completion Audit queue is sorted oldest first');
  check(/CORDILLERA SCHOOL OF DIGITAL ARTS, INC\. 2026/.test(html) && !/Nino Jose B\. Seriosa/.test(html), 'General footer uses the school name and year without creator attribution');
  check(/Workflow map/.test(html) && /Completion Audit gate model/.test(html) && /Open full illustrated guidebook/.test(html), 'Detailed illustrated guidelines are accessible in Admin');
  check(/auditAttendance/.test(html) && /trainer\.attendance\|\|'Complete'/.test(html) && !/id="auditUtilization"/.test(html), 'Attendance defaults complete and seat utilization is removed');
  check(/\['audits','Completion Audit'\]/.test(html) && /adminCompletionAudits/.test(html) && /data-auditopen/.test(html), 'Dedicated Completion Audit Admin tab present');
  check(/data-auditedit/.test(html) && /Completion audit edit/.test(html), 'Audit full enrollment editing present');
  check(/Certificate of Completion/.test(html) && /Certificate Clearance Record/.test(html) && /data-certprint/.test(html), 'Two printable clearance documents present');
  check(/PBKDF2/.test(html) && /AES-GCM/.test(html) && /backup-out-secure/.test(html), 'Password-encrypted full session backup present');
  check(/backup-restore-replace/.test(html) && /backup-restore-merge/.test(html) && /backupSummary/.test(html), 'Backup inspection and restore choices present');
  check(/id="catFilter"/.test(html) && /Filter course categories/.test(html), 'Landing category dropdown present');
  check(/migrateIndividualTrainers/.test(html) && /split\(\/\\s\*\\\/\\s\*\//.test(html), 'Combined trainers migrate to individual entries');
  check(/trainerAssignments/.test(html) && /credited hours/.test(html) && /trainerTimeSummary/.test(html), 'Multi-trainer time ledger present');
  check(/trainerPhotoFile/.test(html) && /Portfolio links/.test(html) && /Trainer profile/.test(html), 'Expanded centered trainer profile present');
  check(/data-courseinspect/.test(html) && /courseEditorTitle/.test(html) && /data-courseeditor/.test(html) && /data-act="cancel-course"/.test(html), 'Direct guarded Admin course editor popup present');
  check(/guardedVeilIn/.test(html) && /guardedPanelIn/.test(html), 'Calm guarded-popup animation present');
  check(/courseEditorFadeIn/.test(html) && !/courseEditorZoomIn/.test(html) && !/--ce-x:/.test(html), 'Admin course editor uses opacity-only animation without zoom');
  check(/border-radius:18px;box-shadow:var\(--shlg\)/.test(html), 'Guarded popup boxes use consistent curved edges');
  check(/modal\.on:has\(\[data-courseeditor\]\)\{transform:translate\(-50%,-50%\) scale\(1\)!important/.test(html), 'Admin parent remains structurally stable during course editing');
  check(/migrateIndividualTrainers/.test(html) && /Use one person per trainer entry/.test(html) && /remove the \/ and create separate profiles/.test(html), 'Trainer entries enforce one slash-free person name');
  check(/course-dynamic\{display:grid;grid-template-rows:1fr/.test(html) && /data-collapsed="true"/.test(html), 'Course editor dynamic grid transition boundary present');
  check(/data-courseeditor[^}]*will-change:transform,opacity/.test(html) && /courseeditorback\{animation:none/.test(html), 'Course editor render stabilization present');
  check(/coursevalidation\{position:relative;min-height:20px/.test(html) && /courseEditorStatus/.test(html), 'Course validation space reserved against CLS');
  check(/height:min\(820px,calc\(100dvh - 36px\)\)/.test(html) && /scrollbar-gutter:stable/.test(html) && /courseEditorScroll/.test(html), 'Course modal geometry and scroll remain stable');
  check(/courseeditorfooter/.test(html) && /min-height:64px/.test(html), 'Course actions anchored in fixed modal footer');
  check(/Primary Guardian &amp; Guarantor Information/.test(html) && /minor-path/.test(html), 'Minor guardian and guarantor path is distinct');
  check(/Emergency Contact <span class="sc">Optional/.test(html) && /Adult applicant .* sole billing guarantor/.test(html), 'Adult path hides mandatory guardian requirements');
  check(/if\(isMinor\(\)\)return consentComplete\(\)\?'':'todo'/.test(html), 'Guardian validation branches by applicant age');
  check(/clientCache/.test(html) && /invalidateClientCache/.test(html) && !/fetch\(/.test(html), 'Central client cache supplies dynamic catalogue data');
  check(/--space-1:4px/.test(html) && /\.ui-grid\{/.test(html) && /\.enrollment-path\{/.test(html), 'Shared spacing and layout utilities present');
  check(/pm_notes/.test(html) && /Complete date, amount, method, reference, and payment notes/.test(html), 'Mandatory payment transaction fields present');
  check(/\.enav\{[^}]*position:sticky;top:0/.test(html) && /h = enrollTabNav\(\) \+ h/.test(html), 'Enrollment actions pinned to top without covering fields');
  check(/\.modal\.on:has\(\.lifedetailback\)\{transform:none!important\}/.test(html) && /height:100dvh/.test(html) && /max-height:calc\(100dvh - 36px\)/.test(html), 'Popup dialogs escape parent clipping and scroll internally');
  check(/backup-out-csvzip/.test(html) && /manifest\.csv/.test(html) && /database\.csv/.test(html) && /zipCSVFiles/.test(html), 'Password-protected CSV ZIP backup present');
  check(/normalizedBackupFiles/.test(html) && /students\.csv/.test(html) && /enrollment_courses\.csv/.test(html) && /completion_audits\.csv/.test(html) && /catalogue_courses\.csv/.test(html) && /trainers\.csv/.test(html) && /facility_records\.csv/.test(html), 'Normalized related CSV backup tables present');
  check(/media\/payment-receipts/.test(html) && /media_index\.csv/.test(html) && /course-artwork/.test(html), 'Backup references encrypted receipt artwork and trainer media');
  check(/validateNormalizedZIP/.test(html) && /failed integrity verification/.test(html) && /broken enrollment reference/.test(html), 'Normalized backup integrity and relationship validation present');
  check(/mergeNewestRecords/.test(html) && /recordModifiedAt/.test(html) && /combined/.test(html), 'Merge keeps newest matching record and combines operational history');
  check(/certificateReadyPopup/.test(html) && /Review generated documents/.test(html) && /CSDA Clearance Form/.test(html) && /Generated Certificate/.test(html), 'Separate document preview popup present');
  check(/completionAuditChanges/.test(html) && /Official enrollment change entries/.test(html) && /Completion Audit enrollment edit/.test(html), 'Enrollment changes create official audit entries');
  check(/Previous unresolved/.test(html) && /Next unresolved/.test(html) && /data-auditreturn/.test(html), 'Unified audit workspace provides queue navigation and explicit return');
  check(/Record history/.test(html) && /operationalHistory/.test(html) && /auditOrigin/.test(html), 'Audit workspace preserves entry context and chronological record history');
  check(/Reason for status or timeline change/.test(html) && /Policy exception/.test(html) && /reason:/.test(html), 'Structured operational reason capture present');
  check(/c3\.revision=.*revision/.test(html) && /Revision.*Approved/.test(html), 'Clearance documents carry incrementing revision identity');
  check(/Decision reason/.test(html) && /Unreadable receipt/.test(html) && /payment_decision/.test(html), 'Payment decisions use structured reasons and required hold notes');
  check(/auditRefundReason/.test(html) && /Other documented correction/.test(html), 'Refund corrections capture a structured reason');
  check(/Policy exception registry/.test(html) && /policy exception/i.test(html), 'Governance includes a policy exception registry');
  check(/documentRevisions/.test(html) && /Document revision archive/.test(html) && /data-certrev/.test(html), 'Prior generated document revisions are archived and printable');
  check(/previous final clearance invalidated/.test(html) && /beforeNet/.test(html) && /afterNet/.test(html), 'Material enrollment edits invalidate clearance and preserve computations');

  /* Only inspect the initial DOM markup. Generated HTML strings inside JavaScript
     legitimately reuse field IDs because only one tab/panel exists at a time. */
  const staticMarkup = htmlDocument
    .replace(/<script(?:\s[^>]*)?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style(?:\s[^>]*)?>[\s\S]*?<\/style>/gi, '');
  const ids = [...staticMarkup.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  const duplicateIds = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  check(duplicateIds.length === 0, 'No duplicate static IDs', duplicateIds.join(', '));

  const temp = path.join(ROOT, '.smoke-inline.js');
  fs.writeFileSync(temp, extractScripts(html));
  const syntax = spawnSync(process.execPath, ['--check', temp], { encoding: 'utf8' });
  fs.rmSync(temp, { force: true });
  check(syntax.status === 0, 'Combined inline JavaScript parses', (syntax.stderr || '').trim());
  const inlineBlocks = [...htmlDocument.matchAll(/<script(?![^>]*\bsrc=)(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  const invalidInlineBlocks = [];
  inlineBlocks.forEach((source, index) => {
    const blockTemp = path.join(ROOT, `.smoke-inline-${index}.js`);
    fs.writeFileSync(blockTemp, source);
    const result = spawnSync(process.execPath, ['--check', blockTemp], { encoding: 'utf8' });
    fs.rmSync(blockTemp, { force: true });
    if (result.status !== 0) invalidInlineBlocks.push(`block ${index}: ${(result.stderr || '').trim()}`);
  });
  check(invalidInlineBlocks.length === 0, 'Each inline script parses independently', invalidInlineBlocks.join('\n'));
  for (const name of fs.readdirSync(moduleDir).filter(f => f.endsWith('.js')).sort()) {
    const result = spawnSync(process.execPath, ['--check', path.join(moduleDir, name)], { encoding:'utf8' });
    check(result.status === 0, `Module ${name} parses`, (result.stderr || '').trim());
  }
  check(/monitorClose'\)\.onclick\s*=\s*function\(\)\{\s*closeLifecycleMonitor\(\)/.test(htmlDocument) && !/monitorClose'\)\.onclick\s*=\s*closeLifecycleMonitor/.test(htmlDocument), 'Late lifecycle handler resolves only after its module loads');
  check(/modules\/data-store\.js/.test(htmlDocument) && /modules\/enrollment\.js/.test(htmlDocument) && /modules\/lifecycle-audit\.js/.test(htmlDocument) && /modules\/backup-engine\.js/.test(htmlDocument) && /modules\/admin-interface\.js/.test(htmlDocument) && /modules\/accessibility\.js/.test(htmlDocument) && /modules\/domain-rules\.js/.test(htmlDocument), 'Major application concerns load as separate modules');
  const swSource = fs.readFileSync(path.join(ROOT,'sw.js'),'utf8');
  check(fs.readdirSync(moduleDir).filter(f => f.endsWith('.js')).every(f => swSource.includes('/modules/' + f)), 'Application modules are included in offline precache');
  check(/sourceDocument\.replace/.test(fs.readFileSync(path.join(ROOT,'tools','build-hosted.js'),'utf8')), 'Hosted build re-bundles modules into a standalone deployment document');

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
    ['/icons/maskable-512.png', 'image/png'], ['/icons/apple-touch-icon.png', 'image/png'],
    ...fs.readdirSync(moduleDir).filter(f => f.endsWith('.js')).sort().map(f => ['/modules/' + f, 'text/javascript'])
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
