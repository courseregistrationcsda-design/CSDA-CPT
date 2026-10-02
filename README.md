# CSDA Pricing Toolkit

Offline-capable course pricing, quotations, payment schedules, enrollment, administration, and Shared Service Facility operations for **Cordillera School of Digital Arts, Inc.**

The readable application source remains a self-contained `index.html`. The production build generates a smaller hosted version with cacheable image assets while preserving an on-demand standalone HTML download.

## Requirements

- Node.js 20 or later
- npm 10 or later
- A modern Chromium, Firefox, or Safari browser

## Local setup

```bash
npm ci --ignore-scripts
npm run smoke
npm run build
```

Open `index.html` directly for the standalone source, or serve `release/hosted` after building to inspect the production artifact.

## Commands

| Command | Purpose |
|---|---|
| `npm run smoke` | Static, syntax, HTTP, asset, and accessibility checks |
| `npm run smoke:browser` | Optional Puppeteer interaction and responsive checks |
| `npm run baseline` | Measure source HTML, gzip, Brotli, CSS, JavaScript, and embedded images |
| `npm run inventory` | Generate embedded-asset inventory reports |
| `npm run version-cache` | Derive the service-worker cache name from content hashes |
| `npm run build:hosted` | Generate the hosted and standalone release artifacts |
| `npm run build` | Version cache, inventory assets, and build the hosted release |
| `npm test` | Run the standard smoke suite |

`smoke:browser` needs Chrome/Chromium runtime libraries. Standard CI does not download or launch Chromium.

## GitHub upload

```bash
git init
git add .
git commit -m "Prepare CSDA Pricing Toolkit for deployment"
git branch -M main
git remote add origin https://github.com/<account>/<repository>.git
git push -u origin main
```

Do not commit `release/`, `node_modules/`, `.vercel/`, local environment files, exported backups, real enrollment data, or test recordings. Generated release files are created by CI/Vercel.

GitHub Actions runs smoke checks and a production build for pushes and pull requests to `main`.

## Vercel deployment

1. Import the GitHub repository in Vercel.
2. Choose **Other** as the framework preset.
3. Keep the repository’s `vercel.json` settings. It already defines:
   - Build command: `npm run build`
   - Output directory: `release/hosted`
   - Security and cache headers
4. Deploy.

The production build contains:

- `index.html` — minified hosted application
- `assets/` — content-hashed images
- `standalone.html` — self-contained offline download
- `sw.js`, manifest, favicon, and PWA icons

After assigning the final domain, update the canonical and social-preview URLs in source `index.html`, rebuild, run smoke checks, and redeploy. See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the release checklist and rollback procedure.

## Repository layout

| Path | Purpose |
|---|---|
| `index.html` | Single source of truth for the application |
| `sw.js` | Offline service worker; cache name is generated automatically |
| `manifest.webmanifest` | PWA metadata and shortcuts |
| `icons/`, `favicon.ico` | PWA and browser icons |
| `tools/` | Build, smoke, performance, inventory, and cache-version scripts |
| `docs/planning/` | UI/UX audit and phased improvement backlog |
| `docs/testing/` | Regression documentation |
| `docs/privacy/` | Local retention and sensitive-data guidance |
| `reports/` | Implementation, performance, and asset reports |
| `usability/` | Synthetic-data usability-testing package |
| `.github/workflows/` | GitHub Actions validation |
| `vercel.json` | Vercel build/output and response-header configuration |

## Important pricing rules

- Short courses and workshops do not receive Full Payment or Bundle discounts.
- Their eligible discounts are Group of 3+ students and Early Bird.
- Discount options show the resulting client price and amount saved directly in each selection control.
- Discounts do not combine unless an authorized administrator explicitly enables stacking.

## Data, privacy, and backups

Operational data is stored in the current browser profile. There is no application database or server-side record recovery. Clearing browser data, changing profiles, or losing the device can remove access to records.

Use **Admin → CSV & Backup → Download full backup** and store exports only in an approved, access-controlled location. Review:

- [`docs/privacy/DATA_RETENTION_PRIVACY.md`](docs/privacy/DATA_RETENTION_PRIVACY.md)
- [`docs/privacy/SENSITIVE_DATA_REGISTER.md`](docs/privacy/SENSITIVE_DATA_REGISTER.md)

The administrator password is a workflow gate, not encryption. Production use requires an approved staff device, individual OS account, automatic screen locking, a private browser profile, current security updates, and controlled physical access.

The app keeps a limited set of aggregate workflow counters in the local browser for deployment evaluation. No values are transmitted. Counters contain allowlisted event names, counts, and the most recent calendar day only; they exclude names, typed text, record IDs, contact details, payment data, receipts, and password attempts. See [`usability/PRIVACY_SAFE_EVENT_SCHEMA.md`](usability/PRIVACY_SAFE_EVENT_SCHEMA.md).

## Standalone/offline copy

The hosted app’s **Get app → Download app file** action downloads `standalone.html`. It contains all required visual assets and works from local storage or a USB drive without a service worker. The hosted PWA uses the service worker for repeat-load offline support.

## Current verification

The latest automated smoke result is recorded in the phase reports. Browser-driven checks are optional because their operating-system library requirements are not available in every CI/sandbox environment.
