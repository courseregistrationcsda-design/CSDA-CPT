# Phase 8 — Search, Reminders, and Retention Controls

**Date:** 7 October 2026  
**Status:** Implemented and statically verified; real-device simulation deferred

## Local search and filters

Today / Work Queue now provides local filtering by:

- Learner name
- Enrollment reference
- Course
- Trainer
- Date range
- Enrollment status
- Payment status
- Clearance status
- Refund status
- Archived-record visibility

Results display active status and retention holds. Search terms remain in local in-memory UI state and are not sent externally. Apply, Clear all, and Include/Hide archived controls are provided.

## Configurable reminders

Admin can configure local thresholds for:

- Pending payment verification
- Done record without completed audit
- Missing refund evidence
- Backup age

The reminder list also identifies clearance invalidated after a material edit. Reminders are advisory only and never approve, move, confirm, clear, issue, archive, or delete anything.

## Retention and manual archive

The approved policy-only model is implemented:

- No automatic deletion
- Guarded manual archive
- Administrator password confirmation
- Required archive reason
- Named Administrator attribution
- Timestamped operational-history event
- Restore-from-archive action
- Financial and TESDA retention holds block archiving
- Archive does not delete records or referenced evidence
- Archived records are omitted from normal work counts but remain available through Include archived

## Verification

- 150 smoke checks passed
- 0 failed
- One known browser-runtime warning
- Inline JavaScript parses
- Focused checks cover filters, reminder thresholds, non-automatic behavior, retention holds, archive reasons, and restore history

## Deferred simulation

- Filter combinations and result counts
- Date-range boundaries
- Reminder threshold dates
- Archive password rejection/acceptance
- Financial/TESDA hold blocking
- Archive/restore persistence after reload
- Mobile filter and result layout
