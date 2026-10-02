# Phase 0 Implementation Report

**Status:** Implemented  
**Date:** 2 October 2026  
**Scope:** Safety baseline only; no application UI or business logic was changed.

## Completed tasks

### T-001 — Regression checklist

Created `docs/testing/REGRESSION_CHECKLIST.md` with coverage for:

- Application shell
- Search and catalogue
- Course outline and quotation
- Adult enrollment
- Minor enrollment and consent
- Scheduling
- Payments and verification
- Administration
- Facility rental
- Installation, offline operation, and backup
- Seven responsive viewport sizes
- Accessibility and user preferences
- Release exit criteria

The checklist is designed to be applied selectively to each future change while preserving full critical-flow coverage.

### T-002 — Automated smoke-test foundation

Created `tools/smoke-test.js` and package commands:

```bash
npm run smoke
npm run smoke:browser
npm test
```

The default smoke test is self-contained and does not depend on an already-running preview server. It starts a temporary local HTTP server and checks:

- Required application mount points and primary actions
- Responsive viewport metadata
- Reduced-motion support
- Service-worker registration
- Duplicate IDs in initial static markup
- Inline JavaScript syntax
- JSON configuration integrity
- All primary hosted assets
- HTTP status and MIME type correctness

**Latest result:** 37 passed, 0 failed.

`npm run smoke:browser` additionally defines browser interaction checks for:

- Catalogue render
- Course-card render
- Course detail open/close
- Backdrop activation
- Enrollment modal opening
- Browser console/page errors

The sandbox has a downloaded Chromium binary but lacks the system `libnspr4` runtime library, and system package installation is not permitted. Therefore browser interaction execution is available in the script but remains an environment-dependent check. This is reported explicitly rather than silently treated as passing.

### T-003 — Performance baseline

Created `tools/performance-baseline.js` and:

```bash
npm run baseline
```

Generated:

- `reports/performance-baseline.json`
- `reports/performance-baseline.md`

Current baseline:

| Metric | Result |
|---|---:|
| Raw HTML | 828,050 bytes |
| Gzip level 9 | 437,405 bytes |
| Brotli quality 11 | 412,052 bytes |
| Inline CSS | 75,561 bytes |
| Inline JavaScript | 395,288 bytes |
| Embedded images | 7 |
| Embedded decoded image bytes | Recorded per asset in JSON/Markdown report |

The JSON report also records relevant file sizes and SHA-256 hashes so later compression work can be compared objectively.

## Package changes

`package.json` now includes project metadata and scripts while retaining the existing Puppeteer dependency. `package-lock.json` was synchronized using `npm install --package-lock-only`.

No framework, runtime dependency, or application architecture was changed.

## Application integrity

- `index.html` was not edited during Phase 0.
- `sw.js` was not edited during Phase 0.
- Inline application JavaScript passes `node --check`.
- Both new tool scripts pass `node --check`.
- Manifest and deployment JSON files parse successfully.
- Required icons, favicon, manifest, service worker, and main HTML all return HTTP 200 with expected MIME types.

Current integrity hashes:

```text
f47fc80b4e6457de666a8f2a5bd23cab0afeafb1cad919270f4d30476081a6b5  index.html
395040144ef2f5094866b1f5a6b1f6a49acce24d7aa575b319673b759e113e7c  sw.js
```

## Dependency audit note

`npm` currently reports eight high-severity findings in the Puppeteer dependency tree. Puppeteer is development/test tooling and is not loaded by the static browser application. No automatic `npm audit fix --force` was applied because it could introduce breaking dependency changes. Dependency remediation should be handled as a separate, reviewed maintenance task.

## Phase 0 exit decision

**Pass with one documented environment limitation.**

The safety baseline, repeatable performance measurement, and default automated smoke checks are in place. The application itself was not changed, and the default test suite passes.

## Recommended next task

Begin Phase 1 with **T-101 — associate labels with form controls**, limited first to the Enrollment **Student** tab. Run `npm run smoke` before and after, then manually verify that clicking each label focuses its existing control and that no JavaScript ID lookup is broken.
