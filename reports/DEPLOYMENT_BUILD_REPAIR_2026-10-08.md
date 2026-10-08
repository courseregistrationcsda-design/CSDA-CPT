# Deployment Build Repair — 2026-10-08

## Resolved

The Phase 9 extraction left one immediately invoked function expression (IIFE) spanning multiple `<script>` elements. JavaScript syntax cannot span script boundaries in a browser:

- the first inline script opened the wrapper but did not close it;
- the final inline script contained the unmatched closing wrapper.

This caused both reported symptoms:

1. Terser stopped `npm run build` with `Unexpected token: punc (})`.
2. A browser opening the source `index.html` could not execute the first script, so startup remained on the splash screen.

The obsolete cross-script wrapper was removed. The app's existing strict mode and global classic-script module behavior remain unchanged.

## Regression protection

The smoke suite now parses every inline script independently, in addition to its existing combined-source and external-module checks. This specifically prevents another wrapper or brace from crossing a script boundary unnoticed.

## Verification

- `npm test`: **182 passed, 0 failed**, with the existing browser-runtime warning.
- `npm run build`: **completed successfully**.
- Hosted output: `release/index.html` — **484,668 bytes**.
- Source modules continue to pass individual syntax checks and HTTP/MIME checks.
- `git diff --check`: passed.

Browser automation remains unavailable in this workspace because Chromium's required runtime library is absent. The syntax defect responsible for the splash lock is directly identified and corrected; designated-staff browser/device confirmation is still recommended before production use.

## What to use

- **Vercel:** deploy the repository root. Its existing build command creates the `release` output directory.
- **Local source-folder use:** open `index.html` with all sibling folders retained. The syntax issue that stopped startup has been removed. Serving the folder through a local web server is preferred for full PWA/service-worker behavior.
- **Single-file offline use:** open `release/index.html` after running `npm run build`. It has the application modules bundled into the document.
