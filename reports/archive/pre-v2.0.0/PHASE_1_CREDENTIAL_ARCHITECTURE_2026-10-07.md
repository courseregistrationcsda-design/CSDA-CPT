# Phase 1 — Administrator Credential Architecture

**Decision date:** 7 October 2026  
**Status:** Approved design; implementation specification  
**Acceptance-test owner:** Designated CSDA staff member  
**Approved recovery method:** Offline one-time recovery key

## 1. Objective

Replace operational reliance on the known legacy default Administrator password with first-run credential setup, verifier-based authentication, named access events, and a separately stored offline recovery key.

## 2. Required behavior

### Existing installation using the legacy default

1. Opening Admin shows **Credential upgrade required** instead of the normal login form.
2. The user must enter their full name, a new password, and confirmation.
3. The new password must meet the approved minimum requirements.
4. The app creates a random one-time recovery key.
5. The recovery key is shown once with Print and Copy controls.
6. The user confirms that CSDA stored it securely offline.
7. The app stores only password and recovery verifiers, not the reusable secrets.
8. The access and credential-upgrade events are logged without secrets.

### Existing installation using a non-default legacy password

1. The user enters their name and current legacy password.
2. Successful authentication immediately starts the credential-upgrade flow.
3. The user may retain the same password only if it meets the new requirements, but changing it is recommended.
4. On successful upgrade, the legacy plaintext configuration value is removed.

### New installation

A new installation follows the same first-run credential setup and recovery-key confirmation flow before Admin can be used.

## 3. Password requirements

Recommended initial policy:

- Minimum 12 characters
- At least one letter
- At least one number
- Spaces and symbols permitted
- Reject the legacy default
- Reject exact organization/app names when practical
- Show requirements before submission
- Do not impose silent truncation

This local app should favor a memorable passphrase over complex short passwords.

## 4. Verifier format

Store under `DB.cfg.auth`:

```text
version
algorithm          PBKDF2-SHA256
iterations         210000 or greater
passwordSalt       random 16-byte salt
passwordVerifier   derived bits encoded as Base64
recoverySalt       independent random 16-byte salt
recoveryVerifier   derived bits encoded as Base64
createdAt
changedAt
legacyMigratedAt
```

Do not store:

- Administrator password
- Recovery key
- Password in logs
- Recovery key in logs
- Password/recovery key in normal backup summaries or guidelines

Use constant-time byte comparison where possible after derivation.

## 5. Recovery key

### Format

Generate at least 128 bits of cryptographic randomness and encode it in grouped, printable form, for example:

```text
CSDA-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX
```

### Display and storage

- Show once after setup or deliberate recovery-key rotation.
- Offer Print and Copy.
- Warn that anyone holding the key can reset the local Admin password.
- Require confirmation that CSDA stored it offline.
- Do not retain the clear key after the setup screen closes.
- Never include it in the General Administrative Guidelines.

### Reset process

1. Select **Forgot password / Use recovery key**.
2. Enter the accessing person’s full name.
3. Enter the complete recovery key.
4. Verify against the stored recovery verifier.
5. Enter and confirm a new password.
6. Generate a replacement recovery key; invalidate the old verifier.
7. Record named password-recovery and recovery-key-rotation events.

## 6. Authentication helper contract

The implementation should centralize asynchronous helpers:

```text
credentialConfigured()
passwordPolicy(password)
deriveCredentialVerifier(secret, salt, iterations)
verifyAdministratorPassword(password)
configureAdministratorCredential(password)
verifyRecoveryKey(key)
resetAdministratorCredential(recoveryKey, newPassword)
rotateRecoveryKey(currentPassword)
```

All sensitive actions must call the same verifier helper:

- Admin unlock
- Final clearance approval
- Permanent deletion
- Backup export authorization
- Legacy secure backup export authorization
- Password change
- Recovery-key rotation

Backup decryption continues to use the password that encrypted that backup; it must not depend on the current Admin verifier.

## 7. Backup behavior

- The entered current Admin password may authorize a new export after verifier validation.
- That entered password may then be used as input to the existing PBKDF2/AES-256-GCM backup encryption.
- It is never loaded back from stored configuration.
- Old backups remain decryptable using the password used when they were created.
- Merge keeps the receiving installation’s current credential configuration.
- Replace must not unexpectedly lock out the current installation; imported credential handling must be previewed and explicitly defined.

Recommended Replace rule for Phase 1:

> Restore application data but preserve the receiving installation’s current Administrator credential and recovery verifier unless the user explicitly chooses a future credential-restore option.

## 8. Password change

The Governance/settings control requires:

- Current password
- New password
- Confirm new password
- Policy feedback
- Named Administrator attribution

A successful change:

- Replaces salt/verifier
- Leaves the recovery key valid unless the user explicitly rotates it
- Records a credential-change event
- Clears all password fields immediately

## 9. Audit language

Allowed event descriptions:

- Administrator credential configured
- Legacy Administrator credential upgraded
- Administrator password changed
- Administrator password recovered using offline key
- Recovery key rotated
- Failed credential attempt recorded locally, if rate-limited and privacy-approved

Never record entered secrets or partial secret values.

## 10. Failure handling

- Wrong password/recovery key changes no data.
- Interrupted setup leaves the legacy/new setup gate intact and recoverable.
- Crypto API unavailable: block setup/reset with a clear browser-security message.
- Failed save: do not remove legacy access until verifier persistence is confirmed.
- Do not clear application records during credential recovery.
- Destructive reset is not the approved primary recovery method.

## 11. Acceptance checks

- New install cannot use `csda2026` to enter Admin.
- Existing legacy-default installation must configure a new credential.
- Existing custom legacy credential can authenticate once and migrate.
- Stored application data contains verifier material but no reusable Admin password.
- Named login events remain.
- Final clearance accepts the new password and rejects the old password.
- Permanent deletion accepts the new password and rejects the old password.
- Backup export accepts the new password and rejects the old password.
- An old backup can still be opened using its original backup password.
- Recovery key resets the password without erasing records.
- Recovery invalidates the old recovery key and produces a new one.
- Recovery and password changes are logged without secrets.
- Merge preserves current local credentials.
- Wrong secrets do not modify application data.

## 12. Implementation sequence

1. Add credential derivation and verification helpers.
2. Add migration detection.
3. Add first-run/legacy-upgrade UI.
4. Replace Admin login comparison.
5. Replace final clearance comparison.
6. Replace deletion comparison.
7. Replace backup-export comparisons.
8. Replace visible password field with guarded password-change controls.
9. Add recovery and key-rotation UI.
10. Update Merge/Replace credential handling.
11. Update General Administrative Guidelines.
12. Add focused static and state-simulation tests.
13. Run the full smoke suite and manual credential scenarios.
