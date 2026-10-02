# Phase 5 Implementation Report — Compression and Hosted-Build Performance

**Status:** Local implementation complete; deployed HTTPS measurement remains environment-dependent  
**Service-worker cache:** `csda-toolkit-3fb0397ada8e`  
**Date:** 2026-10-03

## Executive result

The standalone source was reduced from the previous 844,264 bytes to 561,306 bytes while retaining its self-contained offline behavior.

The generated hosted first-load HTML is 322,032 bytes, with image assets externalized and cacheable.

| Measure | Before Phase 5 | Standalone after | Hosted build |
|---|---:|---:|---:|
| HTML | 844,264 B | 561,306 B | 322,032 B |
| Gzip | 441,966 B | 228,348 B | Generated deployment artifact |
| Brotli | 415,454 B | 201,723 B | Generated deployment artifact |

Standalone reduction:

- Raw HTML: approximately 33.5%
- Gzip: approximately 48.3%
- Brotli: approximately 51.4%

Hosted HTML is approximately 61.9% smaller than the pre-Phase-5 source HTML.

## T-501 — Embedded asset inventory

Added:

- `tools/asset-inventory.js`
- `npm run inventory`
- `reports/asset-inventory.json`
- `reports/asset-inventory.md`

Current inventory:

- Six embedded images
- 108,825 decoded image bytes after optimization
- Each asset has its format, decoded size, Base64 size, and SHA-256 digest recorded

## T-502 — Redundant hosted icon/image payload

The standalone file retains the inline formats it needs for printing, launcher generation, offline manifests, and direct-file use.

The hosted build externalizes the six repeated/embedded image payloads into content-hashed files under `assets/`. Browsers can fetch them only when needed and cache them independently. This avoids forcing the hosted HTML document to carry every runtime image as Base64 while preserving the standalone source.

## T-503 — Transparent CPT artwork

The embedded splash CPT PNG was resized from 512×512 to 184×184, which is exactly 2× the maximum 92 CSS-pixel display height.

- Before: 254,876 bytes
- After: 40,193 bytes
- Reduction: approximately 84.2%
- Alpha transparency retained
- PNG format retained
- No container or artificial background added
- Existing display size and aspect ratio retained

The image remains sufficiently sampled for a 2× device-pixel-ratio display at its maximum rendered size.

## T-504 — Hosted and standalone asset modes

Added `tools/build-hosted.js` and `npm run build:hosted`.

The build produces:

- `release/hosted/index.html` — minified hosted application with external content-hashed images
- `release/hosted/assets/` — extracted image assets
- `release/hosted/standalone.html` — untouched self-contained offline application
- PWA icons, manifest, favicon, and service worker
- `release/hosted/build-report.json`

The hosted Install/Download action fetches `standalone.html` only when the user requests the offline copy. Therefore the initial hosted document stays small without breaking the downloadable self-contained app.

There is still one source of truth: `index.html`. Both hosted and standalone deployment artifacts are generated from it.

Vercel is configured to run `npm run build` and publish `release/hosted`.

## T-505 — Production minification

Added development dependencies:

- `clean-css`
- `terser`

During the hosted build:

- Inline CSS is minified with CleanCSS level 1.
- Inline JavaScript is minified with Terser using conservative compression and no name mangling.
- Comments are removed from the hosted artifact.
- Readable source remains unchanged.

Generated hosted JavaScript passes `node --check`.

## T-506 — Automatic service-worker cache versioning

Added:

- `tools/version-cache.js`
- `npm run version-cache`

The cache name is now derived from a SHA-256 digest of `index.html` and `manifest.webmanifest` rather than manually incrementing `v20`, `v21`, and similar names.

Current cache:

```text
csda-toolkit-3fb0397ada8e
```

The full build command runs cache versioning before producing deployment files.

## T-507 — Production performance measurement

Local payload and compression measurements are complete. Lighthouse/PageSpeed, LCP, INP, and deployed CLS still require the generated build to be published over HTTPS and opened by a browser runtime.

The current sandbox cannot launch Chromium because `libnspr4.so` is unavailable and OS package installation is prohibited. The existing browser smoke suite remains available for a capable deployment environment.

This is the only Phase 5 item that cannot be truthfully completed before deployment.

## Commands

```bash
npm run inventory
npm run version-cache
npm run build:hosted
npm run build
npm run baseline
npm run smoke
npm run smoke:browser
```

## Verification

```text
50 checks passed
0 failed
1 documented browser-runtime warning
Hosted inline JavaScript syntax: passed
Vercel configuration: valid JSON
```

## Dependency note

`npm audit` continues to report eight high-severity findings in the Puppeteer development dependency tree. No forced audit fix was applied because it may introduce breaking dependency changes. Neither Puppeteer nor the minification dependencies are shipped as browser runtime code.

## Next phase

Phase 6 — Data Safety and Privacy.

Priority work includes documenting local-data retention, adding backup freshness/status reminders, reviewing sensitive fields, improving destructive reset controls, and adding a clear privacy/data-location explanation for staff.
