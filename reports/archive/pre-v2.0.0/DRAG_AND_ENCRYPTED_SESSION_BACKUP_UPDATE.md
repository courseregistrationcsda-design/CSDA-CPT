# Drag Reliability & Encrypted Session Backup Update

**Status:** Implemented and smoke-tested  
**Date:** 2026-10-06

## Physical card movement

The lifecycle board retains native desktop HTML drag-and-drop and now adds a Pointer Events fallback for mouse, pen, and touch. Once movement passes a small threshold, a visible card ghost follows the pointer and eligible columns highlight. Releasing over a column stores the timeline override. A click without dragging still opens details. The keyboard/touch-friendly Move selector remains available.

Timeline movement remains isolated from finance, academic, trainer, and final Admin gates.

## Password-encrypted app sessions

Admin → CSV & Backup now exports a complete encrypted session using the current Admin password. Export requires the password to be entered again. The backup uses PBKDF2-SHA-256 with 210,000 iterations, a random 16-byte salt, AES-256-GCM, and a random 12-byte initialization vector.

The `.csdabackup` session includes the complete local database, including catalogue changes, artwork, trainers, promotions, enrollment names, schedules, lifecycle overrides, payments and receipts, facility data, configuration, and audit history.

## Opening on another app version

Choose the encrypted file, enter the password used when it was exported, and select **Open & inspect**. The app decrypts and validates it in memory, then shows recognized counts and export time before offering:

- **Replace:** restore the complete session exactly, including its Admin configuration.
- **Merge:** match records by stable IDs/references, import new and updated content, and retain the receiving app's Admin password.

A wrong password, damaged file, or invalid data shape is rejected without changing local data. Existing migrations run after restoration for cross-version compatibility.

## Verification

Static smoke checks cover pointer drag fallback, encrypted export primitives, backup inspection, and Replace/Merge controls. Browser automation remains unavailable because the sandbox Chromium lacks a required system runtime library.
