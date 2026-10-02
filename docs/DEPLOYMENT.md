# Deployment and Release Guide

## Pre-deployment

1. Confirm Node.js 20+.
2. Ensure no real enrollment data, exported backup, receipt, recording, `.env`, or local Vercel state is inside the repository.
3. Install from the lockfile:

   ```bash
   npm ci --ignore-scripts
   ```

4. Validate and build:

   ```bash
   npm run smoke
   npm run build
   ```

5. Confirm `release/hosted/build-report.json` was generated locally. Do not commit `release/`; Vercel rebuilds it.
6. If Chrome runtime libraries are available, also run `npm run smoke:browser`.

## GitHub

Protect `main` where possible:

- Require the `validate` GitHub Actions job.
- Require pull-request review for application, pricing, privacy, and build changes.
- Prevent force pushes.
- Do not store production records or exported backups in issues, pull requests, or Actions artifacts.

## Vercel

The committed `vercel.json` is authoritative:

- Build command: `npm run build`
- Output: `release/hosted`
- Hosted images: immutable cache headers
- `index.html`, `standalone.html`, and `sw.js`: revalidation/update-safe behavior

No secret environment variables are required by the current application.

## First production deployment

1. Import the GitHub repository into Vercel.
2. Select **Other** framework.
3. Deploy with the repository configuration.
4. Open the assigned HTTPS URL.
5. Verify:
   - Catalogue appears.
   - Course detail opens and closes.
   - Quote totals update.
   - Adult and minor enrollment forms open.
   - Facility split view appears.
   - Admin warning and backup status appear.
   - Manifest and service worker register.
   - Download app file returns a self-contained HTML file.
6. Update canonical/Open Graph/Twitter URLs in source `index.html` to the final production domain, then redeploy.

## Post-deployment validation

Use synthetic data only:

- Run one adult enrollment through review without saving production data.
- Confirm minor wording changes to Parent / Legal Guardian.
- Confirm short-course/workshop promo restrictions.
- Confirm the six-step progress bar.
- Confirm Discount Options include resulting price and savings.
- Confirm facility workstations remain on the left and contextual session panel remains on the right.
- Test at 320×568 and 1440×900.
- Test offline repeat load after one connected load.

## Rollback

Use Vercel’s previous deployment promotion/rollback feature. After rollback:

1. Reload once while connected.
2. Confirm the service worker activates the older deployment cache.
3. Do not restore browser data from an incompatible backup without checking its shape.
4. Record the failed deployment and observed symptom without including personal data.

## Data migration and backups

Application deployment does not migrate browser-local records. Before replacing a staff device or browser profile, download a full backup from the old environment and verify its secure storage. Restore only into an authorized profile.

## Known build note

`npm audit` currently reports high-severity findings in Puppeteer’s development-only dependency tree. Do not apply `npm audit fix --force` without testing because it can introduce breaking major-version changes. Puppeteer is not shipped as browser runtime code.
