# CSDA Pricing Toolkit — Post-Rerun Implementation Audit

**Date:** 7 October 2026  
**Audit scope:** Current application after Phase 1 credential hardening and Phases 2–3 Admin flow changes  
**Method:** Clean-tree inspection, complete static smoke suite, inline JavaScript parse, local HTTP rerun, performance baseline, source-flow review, and phased-checklist reconciliation.

## Executive result

The current implemented application is structurally runnable and passes the complete static suite. The audit found one concrete Admin navigation defect and several checklist overstatements. The navigation defect was corrected during this audit, and the checklist was changed to distinguish implemented code from unperformed real-device acceptance.

The app is **not yet complete through all planned phases**. Phases 4–10 remain outstanding. The current build should therefore be described as a stable incremental checkpoint, not the final deployment-ready release.

## Verification after corrections

- Static smoke checks: **131 passed, 0 failed**
- Inline JavaScript: parses successfully
- Local HTTP launch: successful
- PWA/static assets: returned expected HTTP and MIME results in the smoke suite
- Browser gesture automation: still unavailable because the sandbox Chromium runtime lacks a required system library

## Finding A-01 — Class Monitor sidebar opened an empty Admin panel

**Severity:** High for the new Admin navigation  
**Status:** Corrected

### Cause

The sidebar represented Class Monitor as a normal `data-tab="monitor"` destination, but the Admin renderer had no `aTab === 'monitor'` content branch. Selecting it changed the tab state and rendered a blank content panel instead of launching the existing monitor overlay.

### Correction

The Admin navigation handler now recognizes `monitor` as a launch action and calls the existing `launchLifecycleMonitor()` workflow rather than treating it as a content tab.

### Regression coverage

A focused smoke assertion now confirms that the sidebar monitor entry launches Class Monitor and cannot silently become a blank Admin panel.

## Finding A-02 — Completion Audit ordering was not explicitly oldest-first

**Severity:** Medium  
**Status:** Corrected

### Cause

The Completion Audit tab used saved record order. The standing requirement is to process accumulated Done audits oldest unresolved first.

### Correction

Done records are now sorted by saved schedule end date, falling back to start date, before rendering the audit queue.

### Regression coverage

A focused static assertion now verifies deterministic date sorting in the Completion Audit queue.

## Finding A-03 — Phase 2 checklist overstated implementation

**Severity:** Documentation/control issue  
**Status:** Corrected in checklist

The previous bulk checklist update marked several Phase 2 items complete even though the current dashboard does not yet implement them fully:

- Incomplete-enrollment queue
- General overdue-task queue
- Record-level deep links for every work item
- Real-device empty/mixed/refund/invalidated/mobile scenarios
- Verified return-to-queue behavior

Those items are now unchecked. The dashboard currently provides category-level work cards that open the relevant workspace. It is useful, but it is not yet the final record-level work queue specified in the plan.

## Finding A-04 — Phase 3 acceptance had not been manually demonstrated

**Severity:** Documentation/control issue  
**Status:** Corrected in checklist

Static implementation confirms grouped sidebar sections and current-location styling, but the following remain unverified on real devices:

- Reduced navigation effort in staff use
- Touch and reduced-motion behavior
- Popup clipping under the new shell

These are no longer represented as completed acceptance checks.

## Credential-flow review

### Present in code

- Legacy/default credential upgrade gate
- New password policy
- PBKDF2-SHA256 verifier derivation
- Independent salts
- Removal of reusable configured password after migration
- One-time offline recovery key
- Recovery-key rotation after use
- Named credential events
- Verifier checks for login, deletion, final clearance, and backup export
- Merge and Replace preserving the receiving installation credential

### Still requires real-device verification

- First-run setup persistence
- Existing custom legacy-password migration
- Copy and Print recovery-key actions
- Recovery after full app restart
- Old recovery-key rejection after rotation
- Password change across reload
- Final clearance with new/old credentials
- Existing backup decryption using the original backup password
- Credential preservation after Merge and Replace

No static evidence was found that the clear recovery key is intentionally stored after the one-time screen closes. Nevertheless, runtime storage inspection remains part of required acceptance.

## Current functional state

### Implemented and statically verified

- Course discovery and focused details
- Six-section enrollment
- Age-dependent guardian/emergency-contact path
- Multi-course pricing and schedule computation
- Individual and additional trainer assignments
- Payment evidence and verification
- Four-stage lifecycle monitor
- Completion Audit and refund evidence
- Neutral competency-result clearance rule
- Official enrollment-change entries
- Stale-clearance invalidation
- Clearance Form and Certificate previews
- Verifier-based Admin credentials and offline recovery key
- Admin work-category dashboard
- Grouped responsive sidebar
- Protected complete-session backup/import
- In-app and printable Administrative Guidelines

### Planned but not implemented

- Unified learner record workspace
- Previous/next unresolved audit navigation
- Delivery Team relocation under Schedule
- Persistent enrollment completion summary
- Structured reason codes
- Consolidated chronological record timeline
- Document revision/superseded identity
- Normalized related CSV tables and referenced media
- Conflict-by-conflict normalized import preview
- Search and advanced operational filters
- Reminder thresholds
- Retention-status/manual archive controls
- Incremental module extraction
- Final deployment-readiness sign-off

## Risk assessment

### Highest current risks

1. **Runtime credential migration has not been tested on real installations.** Static parsing cannot prove local-storage migration and reload behavior.
2. **Backup architecture remains a single encrypted payload in `database.csv`.** It does not yet meet the normalized related-table requirement.
3. **Browser interaction testing remains unavailable in the sandbox.** Touch drag, nested modal focus, file uploads, printing, service-worker updates, and recovery-key print behavior need real-device execution.
4. **Admin dashboard is category-level, not record-level.** Staff must still select the specific record after opening a workspace.
5. **The monolithic HTML architecture increases regression risk.** Phase 9 remains necessary but must be incremental.

## Recommendations before continuing Phase 4

- Execute the Phase 0 and Phase 1 real-device protocol on at least one desktop and one touch device.
- Specifically test credential setup, reload, recovery, backup export, and final clearance.
- Confirm the corrected Class Monitor sidebar action.
- Confirm Completion Audit order using at least three Done records with distinct completion dates.
- Retain the current checkpoint before the unified learner-record changes.

## Conclusion

The rerun found and corrected a real navigation defect and a queue-ordering omission. It also corrected the implementation checklist so it no longer claims unperformed work or acceptance tests. The current code is in order as an **incremental Phases 1–3 checkpoint**, subject to the documented real-device verification. It is not yet accurate to call the complete multi-phase roadmap finished.
