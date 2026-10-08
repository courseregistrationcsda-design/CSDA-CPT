# CSDA Pricing Toolkit — App Flow Assessment

**Assessment date:** 7 October 2026  
**Scope:** Landing catalogue, quote and enrollment, payment verification, class lifecycle, Completion Audit, document issuance, Admin information architecture, backup/recovery, accessibility, and operational guidance.

## Executive summary

The app now has a coherent end-to-end operating model:

> Discover course → quote → six-part enrollment → payment verification → class monitoring → Completion Audit → final approval → clearance form and certificate → protected backup

The strongest aspect is **record continuity**. Enrollment data, payment evidence, schedule state, completion gates, official change history, and generated documents are connected rather than treated as isolated features. The app also does a good job of preventing timeline changes from silently approving unrelated financial or academic gates.

The main weakness is **administrative complexity concentrated inside one large Admin window**. Twelve top-level Admin tabs, a separate Class Monitor, multiple nested guarded dialogs, and two places from which Completion Audit can be entered increase cognitive load. The underlying controls are strong, but the operator has to understand the system before the system starts feeling simple.

### Overall assessment

| Area | Rating | Summary |
|---|---:|---|
| Public course discovery | 8/10 | Search, category filtering, responsive artwork, and direct course focus are clear. |
| Quote and enrollment | 8/10 | Six-step form, visible progress, age-aware contact path, sticky controls, and review stage are strong. |
| Payment verification | 7/10 | Evidence and independent verification are well modeled; work-queue visibility can improve. |
| Class lifecycle | 8/10 | Clear four-stage pipeline, accessible movement, large drag targets, and schedule-only overrides. |
| Completion Audit | 8/10 | Detailed gate explanations, refunds, evidence confirmation, and stale-clearance invalidation are robust. |
| Document release | 8/10 | Separate previews and print/save actions reduce accidental issuance. |
| Admin navigation | 6/10 | Functionally complete but crowded; related tasks are distributed across tabs and monitor overlays. |
| Backup and recovery | 6/10 | Protected full-session backup and import preview exist, but the package is not yet normalized relational CSV plus media. |
| Accessibility | 8/10 | Keyboard tabs, focus management, reduced motion, labels, status text, and non-drag alternatives are present. |
| Operational security | 6/10 | Named access logs and password gates help, but the default/local password model needs hardening. |

## 1. Current flow map

```text
Landing catalogue
  ├─ Search and category filter
  ├─ Focus course details
  ├─ Build quote
  └─ Start enrollment
         ↓
Enrollment: 1 Student → 2 Guardian/Emergency Contact → 3 Courses
            → 4 Schedule → 5 Payment → 6 Agreements
         ↓
Review and generate enrollment form
         ↓
Save/finalize record and supporting PDF
         ↓
Admin payment verification
         ↓
Class Monitor: Scheduled → Ongoing → Almost Done → Done
         ↓
Completion Audit
  ├─ Active status
  ├─ Approved payments + receipts
  ├─ Refund evidence, when overpaid
  ├─ Portfolio evidence + confirmation
  ├─ Trainer report + recorded competency + attendance
  └─ Final Admin password approval
         ↓
Clearance Form preview + Certificate preview
         ↓
Print / Save each document
         ↓
Protected session backup
```

### Important loop

A material enrollment edit after final clearance invalidates the old clearance and returns the record to audit. This is correct and should remain central to the design.

## 2. What works well

### A. Landing and course discovery

- The category dropdown keeps the landing page visually light.
- Search and category count provide useful orientation.
- Course cards use compact 16:9 artwork while focused details preserve the fuller image.
- Inactive courses are visually distinct without becoming inaccessible.
- The focused-course presentation avoids duplicate cards and uses restrained motion.

**Flow impact:** Users can move from browsing to a decision without entering Admin or navigating several pages.

### B. Enrollment structure

- The enrollment form is divided into six understandable sections.
- Progress increases and decreases with the active step.
- Tabs support both direct navigation and sequential Back/Next use.
- Incomplete sections receive visible state markers.
- The contact path changes appropriately for minors and adults.
- Course, schedule, payment, legal consent, and trainer information remain attached to one enrollment draft.
- Review/generate and final actions are kept in a predictable control area.

**Flow impact:** The form supports both a novice who moves linearly and an experienced staff member who jumps between sections.

### C. Payment evidence

- Transaction date, amount, method, reference, notes, and receipt are treated as required operational data.
- The app distinguishes an uploaded receipt from independent payment verification.
- Payment approval is attributed to a named Administrator.
- Completion clearance now requires a receipt for every approved payment.

**Flow impact:** Financial clearance is evidence-based rather than a single unexplained checkbox.

### D. Class lifecycle

- Scheduled, Ongoing, Almost Done, and Done create a simple mental model.
- Almost Done has a precise definition: one or two sessions remain.
- Cards contain only learner names, allowing greater board density.
- Dragging works across the entire card with a large target.
- Keyboard users have a non-drag movement control.
- Timeline movement is isolated from finance, trainer, academic, and final Admin status.

**Flow impact:** Staff can correct schedule state without accidentally changing clearance state.

### E. Completion Audit

- The audit explains exactly what remains incomplete instead of returning only a generic error.
- Payment balances, missing approvals, missing receipts, and refunds are included.
- Academic and trainer names come from enrollment, reducing retyping and identity mismatch.
- Confirm actions are more deliberate than checkboxes.
- Either competency result may be recorded without making the subjective assessment an administrative pass/fail gate.
- Official enrollment edits are timestamped and attributed.
- Material edits revoke stale approval.

**Flow impact:** The audit behaves like a controlled reconciliation process instead of an isolated certificate button.

### F. Document review

- Approval opens a separate review window.
- The Clearance Form and Certificate are shown separately.
- Each document has its own Print / Save action.
- Trainer and approving Administrator attribution are carried into output.

**Flow impact:** Staff get a final visual inspection point before distribution.

### G. Guidance and accessibility

- General Guidelines are directly available in Admin.
- Complex ideas are illustrated in the printable guide.
- Tabs use accessible roles and keyboard behavior.
- Modal focus is managed.
- Reduced-motion behavior exists.
- Warnings are expressed in text, not color alone.

## 3. Flow friction and risks

### 3.1 Admin information architecture is crowded

The Admin window currently exposes Courses, Categories, Trainers, Holidays, Facility, Verify, Completion Audit, General Guidelines, Policies, Promos, Payment Plans, Enrollments, and CSV & Backup. This breadth is useful but creates a long, flat navigation model.

**Likely effect:** New staff must scan many tabs to find the correct operational stage. On smaller screens, this can feel like a configuration console rather than a daily workflow.

### 3.2 Completion Audit has two entry contexts

An audit can be reached through the dedicated Completion Audit tab or through Done records in Class Monitor.

**Likely effect:** The duplication is useful, but staff may not know which view is authoritative or why closing one returns to a different context.

### 3.3 Daily work lacks a consolidated queue

Pending payment verification, unresolved Done audits, refund work, changed-after-clearance records, and incomplete enrollments live in separate areas.

**Likely effect:** Staff can complete individual workflows but may miss work that is waiting elsewhere.

### 3.4 The first enrollment section is dense

Student details also include assigned trainer and additional trainer-time controls. Trainer allocation is operationally closer to course/schedule planning than learner identity.

**Likely effect:** The first step becomes visually heavy and makes the enrollment sequence feel longer than six simple sections.

### 3.5 Validation is accurate but could be more anticipatory

Section dots and final outstanding-section messages exist. Some detailed requirements become clearest at review/finalization or Completion Audit.

**Likely effect:** Users may proceed through several sections before learning that a particular field or evidence item will later block completion.

### 3.6 Password and local security model need hardening

The app uses a configurable local Admin password and named access events, but the default password is present in source and saved configuration is local. The password also protects final approval and backup access.

**Risk:** Anyone with source access knows the default. A reused or unchanged password weakens both Admin access and approval confidence.

### 3.7 Backup architecture is operationally complete but not yet relational

The protected ZIP currently carries the complete encrypted session payload inside `database.csv`, plus a manifest. It does not yet provide normalized related CSV tables with referenced media.

**Risk:** Full restore works, but independent auditing, selective recovery, long-term portability, and external inspection remain harder than necessary.

### 3.8 Browser interaction testing is incomplete

Static smoke coverage is strong, but automated browser gesture testing is unavailable in the current environment because Chromium lacks a runtime library.

**Risk:** Focus trapping, touch drag behavior, viewport resizing, print flows, file upload, and nested modal behavior still depend partly on manual verification.

### 3.9 Long-term maintainability risk

The app is a large self-contained HTML file with extensive inline JavaScript, styles, templates, data migration, rendering, and event handling.

**Risk:** Incremental changes can affect distant workflows, and onboarding another developer will become progressively harder.

## 4. Recommendations

## Priority 0 — address before broader deployment

### R1. Force password change on first Admin use

- Replace the known default with a first-run setup flow.
- Require a sufficiently long password/passphrase.
- Store only a password verifier for Admin authentication.
- Continue deriving backup encryption keys with PBKDF2/AES-GCM using a random salt.
- Provide a documented recovery procedure that does not reveal the active password.

**Benefit:** Removes the largest avoidable operational security weakness.

### R2. Complete a real-device acceptance test matrix

Test at minimum:

- Desktop Chrome/Edge
- Android Chrome touch flow
- iPhone Safari
- Tablet portrait and landscape
- Keyboard-only desktop
- Reduced-motion mode
- Offline launch and reload
- Receipt/refund upload
- Enrollment PDF, Clearance Form, and Certificate print/save
- Backup export, preview, Merge, and Replace
- Post-clearance enrollment edit and reapproval

Record pass/fail evidence and the tested build/cache version.

**Benefit:** Converts static confidence into deployment confidence.

### R3. Implement normalized backup tables plus referenced media

Recommended package:

```text
manifest.csv
enrollments.csv
students.csv
contacts.csv
enrollment_courses.csv
schedules.csv
payments.csv
refunds.csv
trainer_assignments.csv
completion_audits.csv
audit_events.csv
catalogue_courses.csv
trainers.csv
media/
  payment-receipts/...
  refund-receipts/...
  course-artwork/...
  trainer-photos/...
```

Keep the entire ZIP password-protected and include hashes in the manifest.

**Benefit:** Better auditability, portability, selective recovery, and future migration.

## Priority 1 — improve daily administrative flow

### R4. Add an Admin “Today / Work Queue” landing dashboard

Show actionable counts and oldest items:

- Payments awaiting verification
- Done records awaiting Completion Audit
- Refunds awaiting proof/confirmation
- Records invalidated after clearance
- Incomplete enrollments
- Classes starting soon
- Backup age/status

Each item should deep-link directly to the relevant record and task.

**Benefit:** Staff no longer need to scan many tabs to discover pending work.

### R5. Group Admin navigation by purpose

Suggested grouping:

- **Daily Work:** Dashboard, Verify Payments, Completion Audit, Enrollments, Class Monitor
- **Catalogue:** Courses, Categories, Trainers, Promos, Payment Plans
- **Operations:** Facility, Holidays
- **Governance:** Guidelines, Policies, Backup & Restore

Use a compact group menu or secondary tabs rather than one flat row.

**Benefit:** Reduces navigation scanning and makes the system easier to teach.

### R6. Make Completion Audit one workspace with two entry points

Keep both entry paths, but open the same audit workspace and preserve a clear breadcrumb:

```text
Admin / Completion Audit / Learner Name
Class Monitor / Done / Learner Name
```

Provide explicit actions:

- Previous unresolved audit
- Next unresolved audit
- Return to audit queue
- Return to Class Monitor

**Benefit:** Removes context ambiguity while preserving fast access.

### R7. Move trainer allocation out of Student details

Place primary trainer and additional trainer-time assignments in Schedule or a dedicated “Delivery Team” subsection between Courses and Schedule.

**Benefit:** Makes Step 1 genuinely about learner identity and improves conceptual grouping.

### R8. Show a persistent enrollment completion summary

Add a compact status summary near the sticky controls:

```text
4 of 6 sections complete
Missing: Payment plan, Agreements
Warnings: 1 blocked schedule date
```

Make each item clickable.

**Benefit:** Reduces end-stage surprises and supports non-linear editing.

### R9. Add audit reason codes and structured exception notes

For rejection, override, status correction, and policy exception, capture:

- Reason category
- Required note
- Acting Administrator
- Timestamp
- Previous and new state

**Benefit:** Improves consistency and future reporting without relying entirely on free text.

### R10. Add document revision identity

Generated documents should visibly include:

- Enrollment/reference number
- Approval timestamp
- Revision number or clearance version
- “Superseded” status when a material edit invalidates an earlier issue

**Benefit:** Makes it easier to distinguish current documents from stale saved PDFs.

## Priority 2 — improve usability, reporting, and scale

### R11. Add search and filters to operational queues

Filters should include status, course, trainer, date range, payment state, clearance state, and refund state.

**Benefit:** Preserves usability as record volume grows.

### R12. Add safe reminders, not automatic approvals

Examples:

- Payment pending for more than a set number of days
- Class is Done but audit has not started
- Refund evidence missing
- Clearance invalidated after edit
- Backup older than policy threshold

**Benefit:** Prevents forgotten tasks without weakening gates.

### R13. Introduce a read-only record timeline

Show major events in one chronological view:

- Enrollment created/finalized
- Payment added/approved
- Schedule changed
- Timeline moved
- Completion evidence confirmed
- Refund confirmed
- Clearance approved/invalidated
- Documents generated

**Benefit:** Reduces the need to reconstruct history from several sections.

### R14. Modularize the codebase incrementally

Do not rewrite the app. Extract one stable concern at a time:

1. Domain rules and calculations
2. Data migrations and persistence
3. Enrollment rendering/events
4. Admin catalogue
5. Lifecycle monitor
6. Completion Audit and documents
7. Backup/import

Maintain the current static checks and add module-level tests as each area is extracted.

**Benefit:** Lowers regression risk while preserving the approved application.

### R15. Add privacy-oriented retention controls

Define and implement policy for:

- Receipt and refund-image retention
- Cancelled/dropped enrollment retention
- Backup retention and disposal
- Export history
- Staff access-log retention

**Benefit:** Aligns operational convenience with data-minimization obligations.

## 5. Recommended target flow

```text
Admin sign-in
   ↓
Today / Work Queue
   ├─ Verify pending payment ──────────────┐
   ├─ Resolve refund evidence ─────────────┤
   ├─ Continue incomplete enrollment ─────┤
   └─ Open oldest Completion Audit ────────┘
                                           ↓
Unified learner record
   Overview | Enrollment | Payments | Schedule | Audit | Documents | History
                                           ↓
Record-specific next action and blocker list
                                           ↓
Final review → Admin approval → document previews
                                           ↓
Issue documents → event recorded → backup status checked
```

This target does not require changing the underlying rules. It reorganizes existing capabilities around **the learner record and the next required action**.

## 6. Suggested implementation sequence

### Phase A — operational safety

1. First-run password change and verifier-based authentication
2. Real-device acceptance test matrix
3. Document revision identity
4. Normalized backup design and migration plan

### Phase B — navigation and workload

5. Today / Work Queue dashboard
6. Grouped Admin navigation
7. Unified Completion Audit workspace and queue controls
8. Record timeline

### Phase C — enrollment refinement

9. Move trainer allocation to Delivery Team/Schedule
10. Persistent completion summary
11. Earlier inline guidance and structured reason codes

### Phase D — maintainability and scale

12. Incremental code modularization
13. Queue search/filtering
14. Reminder rules
15. Data-retention controls

## 7. Success measures

Track aggregate, privacy-safe measures such as:

- Median time from enrollment start to finalized record
- Percentage of enrollments returning from Review because of missing data
- Median payment-verification age
- Median time from Done to cleared
- Number of clearance attempts blocked and most common blocker category
- Number of post-clearance edits and successful reapprovals
- Refunds awaiting confirmation
- Backup age and restore-test success rate
- Admin task completion on mobile/tablet without support

Do not collect typed content, learner identities, receipt details, or record references in usage analytics.

## Final conclusion

The application’s underlying process design is strong and increasingly defensible: it preserves evidence, separates independent gates, logs material changes, and prevents stale clearance from surviving revised enrollment data. The next improvement should not be another broad feature layer. It should be a **workflow simplification pass** centered on a daily work queue, grouped Admin navigation, a unified learner record, and stronger first-run security.

The most important immediate actions are:

1. Remove reliance on a known default Admin password.
2. Perform documented real-device end-to-end testing.
3. Complete normalized backup architecture.
4. Add a daily Admin work queue.
5. Consolidate Completion Audit navigation around one workspace.

---

### Assessment limitations

This assessment used the current committed application structure, rendering logic, validation rules, smoke-test results, generated guidelines, and implementation reports. Static verification currently passes. Automated browser interaction testing was not available in the sandbox because the bundled Chromium runtime lacks a required system library; therefore, touch, print, upload, focus, and viewport recommendations should be validated through the proposed real-device test matrix.
