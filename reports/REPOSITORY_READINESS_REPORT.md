# Repository and Deployment Readiness Report

**Date:** 2026-10-03  
**Status:** Ready for GitHub upload and Vercel import

## Workspace cleanup

- Moved audit and roadmap documents to `docs/planning/`.
- Moved regression documentation to `docs/testing/`.
- Moved retention and sensitive-data guidance to `docs/privacy/`.
- Kept generated measurements and phase history in `reports/`.
- Kept facilitator materials in `usability/`.
- Removed the generated `release/` directory; it is rebuilt by CI/Vercel.
- Confirmed no `.env`, exported backup JSON, PDF, or unexpected CSV data files are present.
- Expanded `.gitignore` for generated releases, local test files, Vercel state, dependencies, logs, environment files, and editor/OS clutter.

## GitHub readiness

Added:

- `.github/workflows/ci.yml`
- `.github/SECURITY.md`
- `CONTRIBUTING.md`
- `.nvmrc`

The GitHub Actions workflow:

1. Checks out the repository.
2. Uses Node.js 20.
3. Installs the lockfile without downloading Chromium.
4. Runs all standard smoke checks.
5. Builds the production release.
6. Confirms hosted, standalone, service-worker, and build-report outputs.
7. Confirms the hosted service worker precaches the standalone copy.

## Vercel readiness

`vercel.json` defines:

- `npm run build`
- Output directory `release/hosted`
- Security headers
- Correct manifest MIME type
- Revalidation for update-sensitive files
- Immutable caching for content-hashed assets and icons

The hosted build now injects every generated content-hashed image and `standalone.html` into the hosted service worker’s precache list.

## Documentation update

Rewrote `README.md` to match the current application and build process. Added `docs/DEPLOYMENT.md` with:

- Pre-deployment checks
- GitHub branch-protection recommendations
- Vercel import instructions
- Post-deployment synthetic-data verification
- Offline checks
- Rollback procedure
- Browser-local data migration warning

## Package cleanup

- Declared Node.js 20+.
- Moved Puppeteer to `devDependencies` because it is test-only.
- Retained CleanCSS and Terser as build-only development dependencies.
- Synchronized `package-lock.json`.

## Verification

```text
55 smoke checks passed
0 failed
Production build succeeded
Hosted HTML generated
Standalone HTML generated
Hosted service-worker asset precache verified
Build scripts passed JavaScript syntax checks
```

The documented warning remains: browser-driven Puppeteer checks require Chrome runtime libraries and are optional in the standard CI workflow.

## Upload commands

```bash
git init
git add .
git commit -m "Prepare CSDA Pricing Toolkit for deployment"
git branch -M main
git remote add origin https://github.com/<account>/<repository>.git
git push -u origin main
```

After pushing, import the repository into Vercel and keep the committed `vercel.json` configuration.
