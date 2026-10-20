# CSDA Pricing Toolkit — MVP Checkpoint

**Checkpoint date:** 2026-10-05  
**Status:** Minimum viable product approved  
**Baseline cache:** `csda-toolkit-d781fa4d92b0`

## Product baseline

This checkpoint records the approved minimum viable product before further improvements and feature development.

The baseline includes:

- Installable offline-capable PWA and responsive catalogue
- Authoritative 2026 catalogue with 75 course/program listings and 2 facility services
- Course search, detail, enrollment, pricing, discounts, quote/payment, PDF, and save workflows
- Shared Service Facility split-session workspace
- Admin course management and local JSON backup workflow
- Course artwork upload/editor with move, zoom, rotation, reset, replace, apply, and remove
- Optimized complete artwork for tall focused details and a separate 16:9 crop for compact cards
- Automatic focused-artwork text contrast
- Inactive artwork label/dimming and full-color hover/focus behavior
- Approved calm focus/open/close animation behavior
- Accessibility, reduced-motion, responsive, deployment, and repository-readiness work through Phase 7

## Verification baseline

- Smoke checks: **65 passed, 0 failed**
- Inline JavaScript: parses successfully
- Duplicate static IDs: none
- Hosted build: successful
- Source HTML: 606,854 bytes
- Hosted HTML: 349,406 bytes
- Gzip: 235,069 bytes
- Brotli: 207,102 bytes

Browser interaction automation was skipped in the sandbox because its Chromium runtime lacks a required system library. Manual post-deployment checks remain part of the deployment checklist.

## Compatibility note

Existing course records remain readable. Artwork saved before complete-image preservation was added can only use its stored 16:9 crop; re-uploading and applying the original once generates the optimized complete artwork.

## Change-control rule

All subsequent improvements begin from this checkpoint and should be implemented incrementally. The MVP baseline should remain recoverable, and existing workflows must not regress without an explicit product decision.
