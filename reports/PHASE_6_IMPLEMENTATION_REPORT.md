# Phase 6 Implementation Report — Data Safety and Privacy

**Status:** Implemented and smoke-tested  
**Service-worker cache:** `csda-toolkit-e91f55a27fb7`  
**Date:** 2026-10-03

## Quote & Payment update

The redundant “Equivalent price under each promo” table was removed from the Quote & Payment panel.

The remaining Discount Options controls now include, in one place:

- Promo name
- Discount percentage
- Eligibility or unavailable reason
- Resulting client price
- Amount saved
- Applied/selected state

Bundle controls also show the resulting price when unlocked, or how many more courses are required. Short-course/workshop restrictions remain enforced and visibly explained.

This removes duplicated information while preserving all pricing calculations.

## T-601 — Local-data retention documentation

Created `docs/privacy/DATA_RETENTION_PRIVACY.md`, covering:

- What the browser stores
- Where records live
- Who may be able to access them
- The effect of clearing browser/site data
- Device-loss and browser-profile risks
- Backup and restoration procedures
- Interim retention guidance pending formal CSDA approval
- Incident escalation expectations

The Admin data screen also states that records exist only in the current browser profile and do not automatically transfer to another browser or device.

## T-602 — Backup status and reminders

Added a full local-data backup workflow under **Admin → CSV & Backup**.

The UI now shows:

- Whether a backup has ever been recorded on the device
- Date/time of the latest recorded backup
- Number of saved changes since that backup
- A non-blocking warning when:
  - No backup exists
  - At least ten saved changes have occurred
  - The backup is at least seven days old

**Download full backup** exports a versioned JSON package containing the current local database. A successful export resets the local change counter and records the export timestamp.

Restore accepts both the new wrapped full-backup format and the older direct-data format.

The UI explicitly reminds staff that the recorded timestamp does not prove the file was moved to an approved secure location.

## T-603 — Sensitive-data review

Created `docs/privacy/SENSITIVE_DATA_REGISTER.md`.

It documents purpose, minimum access, and retention expectations for:

- Student identity
- Date of birth
- Educational attainment
- Provider/school
- Emergency contact
- Parent/legal guardian data
- Address
- Consent and signature timestamps
- Trainer assignment
- Payment references and amounts
- Receipt images
- Facility-session information
- Local activity trail
- Exported backups

It also prohibits entering unnecessary government identifiers, medical information, banking credentials, unrelated personal notes, or passwords into free-text fields.

Exact legal retention durations remain a CSDA governance decision and are identified as such rather than invented in the application.

## T-604 — Administrative access expectations

The administrator sign-in screen now warns:

> Workflow gate only: this local password does not encrypt records or replace the device account lock.

The README now requires:

- Approved staff device
- Individual operating-system account
- Automatic screen locking
- Non-shared browser profile
- Current security updates
- Approved access-controlled backup location

The existing activity trail continues to state that it is not tamper-proof legal audit evidence.

## Verification

```text
53 checks passed
0 failed
1 documented browser-runtime warning
```

New checks confirm:

- Promo prices are combined with discount controls
- The redundant equivalent-price section is absent
- Backup status and export controls exist
- Administrative security expectations are visible
- JavaScript parses
- No duplicate static IDs exist

## Performance snapshot

- Standalone HTML: 562,718 bytes
- Gzip: 228,864 bytes
- Brotli: 202,102 bytes
- Hosted HTML: 323,099 bytes

## Next phase

Phase 7 — Evidence from Real Users.

This phase cannot be completed truthfully through code alone. It requires five moderated sessions with two enrollment staff, one administrator, one trainer, and one mobile-first user. Testing must use synthetic—not real—student data.

Before instrumentation is added, CSDA must also approve whether privacy-safe, local-only funnel events should be collected. No analytics or user tracking has been introduced automatically.
