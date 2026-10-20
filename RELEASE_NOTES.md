# CSDA Pricing Toolkit 2.0.0

**Release date:** 2026-10-08  
**Status:** Stabilized baseline for the next input cycle

## Release scope

Version 2.0.0 consolidates the completed pricing, enrollment, trainer allocation, payment verification, Shared Service Facility, lifecycle monitoring, Completion Audit, document, backup/restore, embedded guidance, camera, offline/PWA, and semantic theme work into one supported baseline.

## Current operational highlights

- Six-step enrollment with age-aware contact terminology and private student-record photos.
- Immediate trainer assignment per selected course, equal multi-trainer allocation, and editable generated sessions.
- Payment and refund evidence capture through upload or the embedded camera.
- Shared Service Facility workstation rental at ₱80 per hour, pro-rated by actual minutes.
- Completion Audit with independent financial, academic, trainer, status, and final Admin gates.
- Password-protected complete-session ZIP backup and previewed Replace/Merge restore.
- Embedded General Administrative Guidelines PDF with an optional secondary searchable guide.
- Responsive semantic light/dark themes using versioned design tokens.
- Hosted PWA and self-contained offline artifact generated from the same source.

## Post-2.0 catalogue enhancement

- Course cards now use tall, rounded, full-bleed artwork covers with an artwork-independent dark gradient for reliable text contrast in both themes.
- Course code, title, hours/sessions, price, and an explicit **Learn More** control form the landing-card hierarchy; details open only through that control.
- Course artwork accepts JPG, PNG, or WebP without app-level file-size or quality ceilings. The original-quality source, lossless portrait framing, and editor positioning data are retained for offline use and protected backup.

## Compatibility and migration

- Existing browser records are migrated in place when the app opens.
- Existing facility sessions retain the rate stored when they began; new sessions use ₱80/hour.
- Receiving-installation Administrator credentials are preserved during session ZIP restore.
- Before upgrading a production device, download and verify a complete session ZIP.

## Verification baseline

The release must pass `npm test`, `npm run build`, and `git diff --check`. Browser/device acceptance remains required for camera permissions, printing, PDF embedding, installation, and touch interaction.

## Archived history

Pre-2.0 implementation and phase reports are preserved under:

`reports/archive/pre-v2.0.0/`
