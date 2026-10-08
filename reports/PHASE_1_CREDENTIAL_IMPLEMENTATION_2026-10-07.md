# Phase 1 — Administrator Credential Hardening Implementation

**Date:** 7 October 2026  
**Status:** Implemented and statically verified; real-device credential checks remain assigned to designated CSDA staff

## Implemented

- Added mandatory credential setup when no verifier exists.
- The legacy default password cannot be reused as the new credential.
- Existing custom legacy credentials require the current legacy password before migration.
- New passwords require at least 12 characters, one letter, and one number.
- Added PBKDF2-SHA256 verifier derivation using 210,000 iterations and independent random salts.
- Removed the reusable plaintext password from `DB.cfg` after successful migration.
- Added constant-time derived-byte comparison.
- Added a cryptographically random, grouped, one-time offline recovery key.
- Recovery key is shown once with Copy and Print actions.
- Administrator must confirm offline storage before continuing.
- Added recovery-key verification and password reset without deleting records.
- Successful recovery rotates the recovery key and invalidates the old key.
- Added named audit events for legacy upgrade, password change, and recovery/key rotation without recording secrets.
- Replaced direct password comparisons for:
  - Admin login
  - Final clearance
  - Permanent record deletion
  - CSV ZIP backup export authorization
  - Legacy secure backup export authorization
- Added guarded password-change controls; the current password is required.
- Updated Merge and Replace so the receiving installation keeps its current credential verifier.
- Preserved old-backup decryption with the password originally used to encrypt that backup.
- Updated in-app and printable General Administrative Guidelines.

## Security properties

Stored credential configuration contains algorithm metadata, iterations, salts, and derived verifiers. It does not retain the reusable configured Administrator password or the clear recovery key after setup/recovery completes.

The legacy default remains only as migration compatibility data in the original default configuration. It does not permit Admin entry after verifier-based setup.

## Verification

- 127 static smoke checks passed.
- 0 failed.
- Inline JavaScript parses.
- Focused checks cover verifier setup, one-time recovery flow, and removal of the reusable legacy password after migration.
- Full browser automation remains unavailable in the sandbox because Chromium lacks a required runtime system library.

## Required real-device checks

The designated CSDA tester must still verify:

- First-run setup and one-time key display
- Copy and Print recovery actions
- Legacy-default upgrade
- Existing custom legacy-password migration
- Normal Admin sign-in
- Wrong-password rejection
- Password change
- Final clearance with new versus old password
- Permanent deletion authorization
- Backup export authorization
- Recovery without data loss
- Old-key rejection after recovery rotation
- Existing backup opening with its original backup password
- Merge and Replace preserving the receiving installation’s credential

Any Critical or High defect must stop later phases until corrected.
