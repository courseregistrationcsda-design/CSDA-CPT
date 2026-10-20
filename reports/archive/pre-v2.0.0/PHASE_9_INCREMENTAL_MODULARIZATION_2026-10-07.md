# Phase 9 — Incremental Code Modularization

**Date:** 7 October 2026  
**Status:** Implemented and statically verified; user-facing behavior intentionally unchanged

## Extracted modules

| Module | Responsibility |
|---|---|
| `modules/data-store.js` | Defaults, catalogue data, saved-data migration, local persistence, cache, and record lookup |
| `modules/domain-rules.js` | Pricing, promotion restrictions, calendar rules, schedule calculations, and domain helpers |
| `modules/enrollment.js` | Enrollment state, six-step rendering, validation, review, generated enrollment form, and enrollment events |
| `modules/admin-interface.js` | Admin credential screens, sidebar, Work Queue, catalogue/configuration views, policies, and guidelines |
| `modules/lifecycle-audit.js` | Lifecycle calculations, Class Monitor rendering, Completion Audit, generated clearance documents, and revision archive |
| `modules/backup-engine.js` | ZIP creation, encryption, normalized CSVs, media references, integrity validation, conflict merge, and restore |
| `modules/accessibility.js` | Active-dialog focus trap and global modal keyboard handling |

The remaining inline code is primarily application composition, landing catalogue interactions, shared browser wiring, and startup initialization.

## Offline and deployment behavior

- Every module is included in the service-worker precache.
- Smoke tests request every module over HTTP and verify JavaScript MIME type.
- Every module receives an independent `node --check` syntax test.
- Cache versioning now hashes all module source in addition to `index.html` and the manifest.
- Performance reporting includes module files.
- The hosted build tool re-bundles local modules into the generated standalone document, preserving a single-file deployment/download artifact.
- No external CDN, font, image, or script dependency was introduced.

## Test-harness correction

The smoke suite now distinguishes:

- `htmlDocument` for static-markup duplicate-ID checks
- Combined HTML and module source for implementation assertions
- Per-module parsing for syntax safety

This prevents generated HTML strings in module source from being mistaken for duplicate IDs in the initial DOM.

## Debug sequence

The full smoke suite ran after each extraction:

1. Backup engine extraction
2. Smoke harness module-source correction
3. Offline precache update
4. Lifecycle/Audit extraction
5. Admin interface extraction
6. Duplicate-ID test correction
7. Enrollment extraction
8. Data-store extraction
9. Cache/baseline/build-tool updates
10. Accessibility extraction
11. Domain-rules extraction
12. HTTP/MIME and per-module syntax verification

No failing extraction was allowed to proceed without correction.

## Verification

- 174 smoke checks passed
- 0 failed
- One known browser-runtime warning
- All seven modules parse
- All module HTTP/MIME checks pass
- Build/cache/baseline tools parse
- `git diff --check` passes

## Deferred simulation

The designated simulation should confirm that script loading works in normal browser, installed PWA, offline reload, and hosted/standalone outputs. Browser automation remains unavailable in the sandbox because the Chromium runtime lacks a required system library.
