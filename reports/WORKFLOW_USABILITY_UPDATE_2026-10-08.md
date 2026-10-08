# Workflow and Usability Update — 2026-10-08

## Trainer scheduling

- Multiple assigned trainers now receive equal instructional-time shares: 50/50 for two, thirds for three, and so on.
- Generated calendar sessions receive sequential suggested trainer blocks.
- Admin can change the assigned trainer directly on each generated session.
- The calendar marks the generated session where each selected course ends, helping Admin place succeeding trainers.
- Additional-trainer start/end dates and equal credited hours are calculated from the session allocation but remain editable.

## Receipt camera access

Receipt and refund-receipt image controls now request the rear camera on supported mobile devices while retaining normal file selection. The hosted Permissions Policy allows same-origin camera use. Browsers still control the permission prompt.

## Guarded removal

The install panel now includes a guarded removal workflow:

1. Verify the Administrator password.
2. Generate and start downloading a complete encrypted normalized CSV ZIP with referenced media.
3. Require explicit confirmation that the backup and password will be retained securely.
4. Clear local storage and application caches only after those safeguards succeed.
5. Show browser/device instructions because a web app cannot directly uninstall its own PWA shell.

A blocked or failed backup leaves local data untouched.

## General Administrative Guidelines

- Added a packaged PDF edition.
- Admin → Governance → General Guidelines embeds the PDF inside the app window by default.
- The PDF and printable HTML guide are copied into hosted builds and included in offline precache.
- Updated the guide for trainer allocation, camera-assisted receipt capture, and guarded app removal.

## Verification

- Static, syntax, module, HTTP, MIME, and focused workflow checks pass.
- Production hosted build succeeds and contains the packaged PDF.
- Browser automation remains unavailable in this workspace due missing Chromium runtime libraries; designated-device validation is recommended for camera permissions and browser-specific PDF rendering.
