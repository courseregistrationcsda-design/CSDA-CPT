# Phase 7 — Normalized CSV Backup with Referenced Media

**Date:** 7 October 2026  
**Status:** Implemented and statically verified; round-trip simulation deferred to designated testing

## Package structure

The protected ZIP now contains:

- `manifest.csv`
- `students.csv`
- `contacts.csv`
- `enrollments.csv`
- `enrollment_courses.csv`
- `schedules.csv`
- `payments.csv`
- `refunds.csv`
- `trainer_assignments.csv`
- `completion_audits.csv`
- `audit_events.csv`
- `catalogue.csv` compatibility catalogue envelope
- `catalogue_courses.csv`
- `trainers.csv`
- `promotions.csv`
- `payment_plans.csv`
- `facility_records.csv`
- `media_index.csv`
- encrypted files under:
  - `media/payment-receipts/`
  - `media/refund-receipts/`
  - `media/course-artwork/`
  - `media/trainer-photos/`
- `database.csv` as an encrypted full-session compatibility/recovery payload

## Protection model

- Sensitive row payloads use PBKDF2-SHA256 and AES-256-GCM with independent random salts and IVs.
- Referenced media files are AES-GCM encrypted.
- The clear Administrator password is not stored in the package.
- `manifest.csv` contains file type, encryption status, SHA-256 hash, export timestamp, and schema version.

## Integrity and relationship validation

Before password opening or restore, the app:

1. Requires `manifest.csv`.
2. Requires integrity hashes.
3. Verifies every listed file is present.
4. Recomputes and compares every SHA-256 hash.
5. Validates enrollment foreign-key references across related tables.
6. Blocks the package before import if a file is missing, changed, or relationally broken.
7. Then authenticates/decrypts the complete recovery payload using AES-GCM.

## Preview and restore

The import preview shows integrity-verification status and recognized counts before Replace or Merge.

- Replace restores the imported session data while preserving the receiving installation’s credential verifier.
- Merge resolves matching enrollment references by newest recorded modification time and combines deduplicated operational history.
- Existing encrypted CSV ZIP and legacy `.csdabackup` opening remain supported through the compatibility payload.

## Verification

- 146 smoke checks passed
- 0 failed
- One known browser-runtime warning
- Inline JavaScript parses
- Focused checks cover normalized tables, referenced media, integrity validation, relationship validation, and newest-record Merge behavior

## Required simulation

- Export a package containing course artwork, trainer photo, payment receipt, and refund receipt.
- Inspect all expected entries.
- Change one byte and confirm hash rejection.
- Remove a related file and confirm rejection.
- Test wrong/correct passwords.
- Test Replace and Merge.
- Confirm every media asset and audit event survives round trip.
