# CSDA Pricing Toolkit — Phased Implementation Checklist

**Prepared:** 7 October 2026  
**Baseline before this plan:** `cb4eed1`  
**Approach:** Improve the existing app incrementally. Do not rewrite the application or combine unrelated phases into one large change.

## Working rules for every phase

- [ ] Start from a clean Git working tree.
- [ ] Preserve the last approved checkpoint before editing.
- [ ] Implement only the active phase and its necessary supporting changes.
- [ ] Preserve existing enrollment, payment, trainer, lifecycle, audit, document, and backup records.
- [ ] Add focused smoke checks for every changed rule.
- [ ] Run the complete static smoke suite.
- [ ] Run `git diff --check`.
- [ ] Update the cache version after user-facing changes.
- [ ] Regenerate the performance baseline after substantial HTML/JavaScript changes.
- [ ] Perform the phase-specific manual checks listed below.
- [ ] Commit the phase as one reviewable checkpoint.
- [ ] Create a new checkpoint ZIP and SHA-256 file.
- [ ] Report the commit, cache version, test results, known warnings, and checksum.

---

# Phase 0 — Baseline protection and test protocol

**Objective:** Establish a repeatable safety process before changing navigation, authentication, or stored data.

## Tasks

- [x] Record the current application commit, cache version, smoke-test count, and checkpoint checksum.
- [x] Create a formal real-device acceptance-test document.
- [x] Define required test environments:
  - [x] Desktop Chrome or Edge
  - [x] Android Chrome
  - [x] iPhone Safari
  - [x] Tablet portrait
  - [x] Tablet landscape
  - [x] Keyboard-only desktop
  - [x] Reduced-motion mode
  - [x] Offline/reload mode
- [x] Define critical test scenarios:
  - [x] New adult enrollment
  - [x] New minor enrollment
  - [x] Multi-course enrollment
  - [x] Payment entry and receipt upload
  - [x] Payment approval after portal reconciliation
  - [x] Timeline drag and accessible Move control
  - [x] Automatic and manual Done transition
  - [x] Completion Audit with no refund
  - [x] Completion Audit with refund
  - [x] `NOT YET COMPETENT` clearance
  - [x] Post-clearance material enrollment edit
  - [x] Clearance Form and Certificate print/save
  - [x] Backup export, preview, Merge, and Replace
- [x] Define a defect log with build/cache version, device, browser, reproduction steps, expected result, and actual result.

**Phase 0 protocol:** `reports/PHASE_0_REAL_DEVICE_ACCEPTANCE_PROTOCOL_2026-10-07.md`

## Acceptance criteria

- [ ] A staff member can follow the test protocol without developer assistance.
- [ ] Every critical workflow has an expected result.
- [ ] Failed checks can be traced to a specific build and device.
- [ ] No application behavior changes in this phase.

## Decision gate

- [x] A designated CSDA staff member will perform and sign off real-device testing.

**Proceeding condition:** The user authorized work to proceed while real-device execution remains an external acceptance activity. Any Critical or High baseline defect discovered by staff must stop the affected later phase until resolved.

---

# Phase 1 — Administrator credential hardening

**Objective:** Remove operational reliance on the known default password while preserving controlled local access and encrypted backups.

## Tasks

- [x] Add first-run Administrator password setup.
- [x] Require change when the app still uses the legacy default.
- [x] Define minimum password/passphrase requirements in plain language.
- [x] Store an authentication verifier instead of the reusable plain password where technically feasible in the local architecture.
- [x] Keep PBKDF2/AES-256-GCM backup encryption with a random salt and authenticated encryption.
- [x] Preserve named-person entry for every Admin session.
- [x] Record password setup/change events without recording the password.
- [x] Add guarded password-change controls under Admin governance/settings.
- [x] Add confirmation and clear recovery guidance.
- [x] Document what happens when the password is forgotten.
- [x] Update General Administrative Guidelines.
- [x] Add migration handling for existing saved sessions.

**Phase 1 implementation:** `reports/PHASE_1_CREDENTIAL_IMPLEMENTATION_2026-10-07.md`

## Acceptance criteria

- [ ] A new installation cannot continue using a publicly known default credential.
- [ ] Existing installations are prompted to replace the legacy default safely.
- [ ] Password values never appear in logs, exports, guidelines, or generated documents.
- [ ] Final Admin approval still requires the current credential.
- [ ] Existing encrypted backups remain importable through a documented compatibility path.
- [ ] Incorrect credentials do not corrupt or clear local data.

## Manual checks

- [ ] First launch and setup
- [ ] Existing-default migration
- [ ] Changed-password Admin login
- [ ] Final clearance approval
- [ ] Backup export and import with correct/incorrect passwords
- [ ] Forgotten-password guidance

## Decision gate

- [x] Approved recovery policy: generate a one-time recovery key during setup, store only its verifier in the app, and require CSDA to store the clear key securely offline.

**Phase 1 architecture:** `reports/PHASE_1_CREDENTIAL_ARCHITECTURE_2026-10-07.md`

---

# Phase 2 — Admin Today / Work Queue dashboard

**Objective:** Give staff one starting place that identifies the next operational tasks.

## Tasks

- [x] Make **Today / Work Queue** the first Admin view after access and policy acknowledgement.
- [x] Display privacy-safe actionable counts for:
  - [x] Payments awaiting verification
  - [x] Done enrollments awaiting Completion Audit
  - [x] Refunds awaiting proof or confirmation
  - [x] Clearances invalidated after enrollment edits
  - [ ] Incomplete enrollments
  - [x] Classes starting soon
  - [ ] Overdue unresolved tasks
  - [x] Backup age/status
- [x] Show the oldest unresolved items first.
- [ ] Add direct record-level actions rather than links to a generic tab only.
- [x] Add empty states that explain that no action is required.
- [x] Keep aggregate usage metrics free of learner names or receipt content.
- [x] Add visible refresh behavior.
- [x] Preserve existing Admin tabs as fallback navigation.

## Acceptance criteria

- [ ] An Administrator can identify the highest-priority task within one screen.
- [ ] Each queue item opens the exact record and correct workflow.
- [ ] Closing a task returns to the queue with updated counts.
- [x] No queue action silently changes payment, timeline, academic, trainer, or clearance state.
- [x] Queue ordering is deterministic and oldest-unresolved-first where applicable.

## Manual checks

- [ ] Empty queue
- [ ] Mixed pending payments and audits
- [ ] Refund-required record
- [ ] Invalidated clearance
- [ ] Deep-link return behavior
- [ ] Mobile/tablet queue layout

---

# Phase 3 — Grouped Admin navigation

**Objective:** Reduce the cognitive load of the current flat Admin tab row.

## Proposed groups

### Daily Work

- [x] Today / Work Queue
- [x] Verify Payments
- [x] Completion Audit
- [x] Enrollments
- [x] Class Monitor

### Catalogue

- [x] Courses
- [x] Categories
- [x] Trainers
- [x] Promotions
- [x] Payment Plans

### Operations

- [x] Facility
- [x] Holidays

### Governance

- [x] General Guidelines
- [x] Policies
- [x] Backup & Restore
- [x] Credential controls, if approved in Phase 1

## Tasks

- [x] Select a lightweight group-navigation pattern suitable for desktop and mobile.
- [x] Keep current tab content and permissions intact.
- [x] Preserve keyboard tab/menu navigation.
- [x] Preserve direct links opened from the Work Queue.
- [x] Clearly show current group and current section.
- [x] Avoid obscuring content with floating menus.
- [x] Update Admin help text and guide illustrations.

## Acceptance criteria

- [x] All existing Admin sections remain reachable.
- [ ] Daily operational tasks require fewer navigation scans.
- [ ] Group menus work with keyboard, touch, and reduced motion.
- [x] The current location is always visible.
- [ ] No nested popup is clipped by the new navigation shell.

## Decision gate

- [x] Approve the grouped navigation pattern before implementation.

---

# Phase 4 — Unified learner record and Completion Audit workspace

**Objective:** Preserve both audit entry points while making them open one consistent workspace.

## Tasks

- [x] Create one learner-record workspace with sections for:
  - [x] Overview
  - [x] Enrollment
  - [x] Payments and refunds
  - [x] Schedule and lifecycle
  - [x] Completion Audit
  - [x] Documents
  - [x] History
- [x] Keep entry from both Completion Audit queue and Class Monitor.
- [x] Add breadcrumbs showing the entry context.
- [x] Add explicit navigation:
  - [x] Previous unresolved audit
  - [x] Next unresolved audit
  - [x] Return to audit queue
  - [x] Return to Class Monitor
- [x] Preserve the oldest-unresolved-first queue.
- [x] Keep full-enrollment editing as a controlled action.
- [x] Continue invalidating stale clearance after material edits.
- [x] Keep academic and trainer names synchronized from enrollment.
- [x] Keep explicit portfolio, trainer-report, and refund confirmation actions.
- [x] Preserve `COMPETENT` and `NOT YET COMPETENT` as recorded, non-pass/fail administrative results.
- [x] Add a persistent record-specific blocker summary.

## Acceptance criteria

- [ ] The same learner and audit state appears regardless of entry point.
- [ ] Staff always know how to return to their original queue or monitor.
- [ ] No duplicate or divergent audit state is created.
- [ ] Edits create official timestamped history and recompute affected values.
- [ ] Final approval remains impossible while a listed gate is unresolved.
- [ ] A `NOT YET COMPETENT` result does not by itself block clearance.

## Manual checks

- [ ] Open from Audit queue
- [ ] Open from Class Monitor
- [ ] Move previous/next unresolved
- [ ] Edit enrollment and return
- [ ] Invalidate and reapprove prior clearance
- [ ] Refund and no-refund paths

---

# Phase 5 — Enrollment flow refinement

**Objective:** Reduce form density and make missing requirements visible earlier.

## Tasks

- [x] Move primary trainer and additional trainer assignments out of Student Details.
- [x] Create a **Delivery Team** subsection under Schedule or between Courses and Schedule.
- [x] Preserve automatic course-trainer suggestions and manual override behavior.
- [x] Preserve individual trainer entries and credited-hour assignments.
- [x] Add a persistent enrollment summary near the sticky actions:
  - [x] Number of completed sections
  - [x] Missing sections
  - [x] Warning count
  - [x] Clickable jump targets
- [x] Add inline explanations before fields become blocking requirements.
- [x] Keep six-step progress behavior unless a separate Delivery Team step is explicitly approved.
- [x] Keep final actions labeled:
  - [x] Finalize and create PDF
  - [x] Save
  - [x] Back to form
- [ ] Confirm mobile layout does not crowd the sticky action area.

## Acceptance criteria

- [ ] Student Details focuses on learner identity and contact information.
- [ ] Trainer allocation remains saved and synchronized with Completion Audit.
- [ ] Users can identify missing sections without reaching final review.
- [ ] Progress increases and decreases accurately.
- [ ] Existing saved enrollments remain editable.

## Decision gate

- [x] Delivery Team approved and implemented as a Schedule subsection; six-step flow preserved.

---

# Phase 6 — Structured reasons, record history, and document revisions

**Objective:** Make important operational decisions and issued-document versions easier to understand and audit.

## Tasks

- [x] Add structured reason categories for:
  - [x] Payment rejection/hold
  - [x] Timeline correction
  - [x] Enrollment status change
  - [x] Clearance invalidation
  - [x] Policy exception
  - [x] Refund correction
- [x] Require a note when the selected reason needs explanation.
- [x] Record acting Administrator, timestamp, previous state, and new state.
- [x] Build one chronological read-only record timeline.
- [x] Include major events:
  - [x] Enrollment created/finalized
  - [x] Enrollment edited
  - [x] Payment added/approved/rejected
  - [x] Receipt attached/removed
  - [x] Schedule changed
  - [x] Timeline moved/returned to automatic
  - [x] Portfolio confirmed
  - [x] Trainer report confirmed
  - [x] Refund confirmed
  - [x] Clearance approved/invalidated
  - [x] Documents generated
- [x] Add document revision/version identity.
- [x] Mark prior issued versions as superseded after material changes.
- [x] Display reference, approval timestamp, and revision on generated documents.

## Acceptance criteria

- [x] Staff can reconstruct the important record history from one view.
- [x] Every sensitive override or exception has a named actor and reason.
- [x] Current and superseded documents are distinguishable.
- [x] Existing operational history remains readable.
- [x] Timeline events are read-only and cannot alter source data.

---

# Phase 7 — Normalized CSV backup with referenced media

**Objective:** Replace the single encrypted database payload as the primary architecture with related CSV tables and referenced media while retaining secure full-session portability.

## Proposed package

- [x] `manifest.csv`
- [x] `enrollments.csv`
- [x] `students.csv`
- [x] `contacts.csv`
- [x] `enrollment_courses.csv`
- [x] `schedules.csv`
- [x] `payments.csv`
- [x] `refunds.csv`
- [x] `trainer_assignments.csv`
- [x] `completion_audits.csv`
- [x] `audit_events.csv`
- [x] `catalogue_courses.csv`
- [x] `trainers.csv`
- [x] `promotions.csv`
- [x] `payment_plans.csv`
- [x] `facility_records.csv`
- [x] `media/payment-receipts/`
- [x] `media/refund-receipts/`
- [x] `media/course-artwork/`
- [x] `media/trainer-photos/`

## Tasks

- [x] Define stable primary and foreign keys.
- [x] Define schema versions and required columns.
- [x] Add per-file hashes and package metadata to the manifest.
- [x] Encrypt/protect the complete package with a user-supplied password.
- [x] Do not use the Admin password directly as an AES key.
- [x] Preview recognized tables, row counts, media counts, schema version, and integrity status before import.
- [x] Preserve Replace and Merge.
- [x] Define deterministic merge conflict rules.
- [x] Detect duplicate records and media.
- [x] Validate references before modifying the local database.
- [x] Import atomically or roll back safely after failure.
- [x] Preserve compatibility with existing encrypted CSV ZIP and legacy backup formats.
- [x] Provide export/import reports without exposing sensitive content unnecessarily.

## Acceptance criteria

- [x] Every stored enrollment-related entity is represented in a documented table or referenced media file.
- [x] A complete round trip preserves all application records and evidence.
- [x] Broken references, hash mismatches, or unsupported schema versions are blocked before import.
- [x] Replace and Merge produce previewable, deterministic outcomes.
- [x] Incorrect passwords do not reveal backup contents.
- [x] Existing backups remain restorable through a documented compatibility path.

## Decision gate

- [x] Approve the normalized schema and merge policy before implementation.

---

# Phase 8 — Search, filters, reminders, and retention controls

**Objective:** Keep the app usable and govern data appropriately as record volume grows.

## Tasks

### Search and filters

- [x] Add search/filtering by learner, reference, course, trainer, date range, enrollment status, payment state, clearance state, and refund state.
- [x] Preserve privacy by keeping searches local.
- [x] Add clear/reset controls and visible active-filter summaries.

### Reminders

- [x] Define configurable reminder thresholds for:
  - [x] Long-pending payment verification
  - [x] Done record without started audit
  - [x] Missing refund evidence
  - [x] Clearance invalidated after edit
  - [x] Old backup
- [x] Ensure reminders never approve or alter a gate automatically.

### Retention

- [x] Document retention periods for receipts, refund proofs, dropped/cancelled enrollments, access logs, exports, and backups.
- [x] Add guarded deletion/archive controls only after policy approval.
- [x] Record retention actions in operational history.
- [x] Prevent accidental deletion of referenced evidence.

## Acceptance criteria

- [ ] Large record sets can be narrowed quickly.
- [ ] Reminders identify neglected tasks without changing status.
- [ ] Retention actions are authorized, logged, and reversible where policy requires.
- [ ] Privacy-safe local analytics do not store typed content or record identities.

## Decision gate

- [x] Approved policy-only retention: guarded manual archive, no automatic deletion; current Admin role authorizes archive with password and reason.

---

# Phase 9 — Incremental code modularization

**Objective:** Reduce regression risk without redesigning or rewriting the approved app.

## Extraction sequence

- [x] Domain calculations and validation rules
- [x] Data migrations and persistence
- [x] Enrollment rendering and events
- [x] Admin catalogue functions
- [x] Class lifecycle monitor
- [x] Completion Audit and documents
- [x] Backup and import
- [x] Shared modal/focus/accessibility utilities

## Tasks

- [x] Freeze current behavior with focused tests before each extraction.
- [x] Extract only one stable concern per checkpoint.
- [x] Keep public function contracts explicit.
- [x] Avoid circular dependencies.
- [x] Keep offline/PWA behavior intact.
- [x] Preserve a build that can run without external network resources.
- [x] Add module-level tests for calculations, migrations, and merge rules.
- [x] Retain the static single-page deployment output.

## Acceptance criteria

- [x] User-facing behavior remains unchanged unless explicitly approved.
- [x] Each extraction passes the complete smoke suite and relevant manual checks.
- [x] No phase requires a full rewrite.
- [x] Another developer can identify where each major workflow is implemented.
- [x] Generated deployment remains offline-capable.

---

# Phase 10 — Final deployment readiness review

**Objective:** Confirm that all approved phases operate together as a stable release.

## Tasks

- [ ] Run the complete real-device acceptance matrix.
- [ ] Perform backup export/import round-trip testing using normalized and legacy formats.
- [ ] Test offline install, launch, update, and cache replacement.
- [ ] Test print/save output on supported desktop and mobile browsers.
- [ ] Review accessibility:
  - [ ] Keyboard-only
  - [ ] Screen-reader labels/status
  - [ ] Focus return
  - [ ] Reduced motion
  - [ ] Color-independent status meaning
  - [ ] Touch target sizing
- [ ] Review security and privacy controls.
- [ ] Review General Administrative Guidelines against the final workflow.
- [ ] Review performance baseline and app/package size.
- [ ] Confirm no unresolved high-severity workflow defects.
- [ ] Create release notes, final checkpoint, and checksum.

## Release acceptance criteria

- [ ] Every critical test scenario passes on the approved device/browser matrix.
- [ ] No known defect can corrupt records, bypass clearance gates, expose protected data, or issue stale documents.
- [ ] Backup recovery is demonstrated successfully.
- [ ] Guidelines match the released interface.
- [ ] The release has a named approver and dated sign-off.

---

# Recommended implementation order

1. [ ] Phase 0 — Baseline protection and test protocol
2. [ ] Phase 1 — Administrator credential hardening
3. [ ] Phase 2 — Today / Work Queue
4. [ ] Phase 3 — Grouped Admin navigation
5. [ ] Phase 4 — Unified learner record and Completion Audit
6. [ ] Phase 5 — Enrollment flow refinement
7. [ ] Phase 6 — Structured reasons, history, and document revisions
8. [ ] Phase 7 — Normalized backup and referenced media
9. [ ] Phase 8 — Search, reminders, and retention
10. [ ] Phase 9 — Incremental modularization
11. [ ] Phase 10 — Deployment readiness review

## Recommended immediate next step

Begin with **Phase 0** and pause at its decision gate to identify the people and devices that will perform acceptance testing. Then complete the password-recovery policy decision before starting Phase 1.
