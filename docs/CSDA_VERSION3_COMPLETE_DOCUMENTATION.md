# CSDA Pricing Toolkit / Institutional Operations PWA

## Complete Product, Operations, Data, and Support Documentation

**Organization:** CORDILLERA SCHOOL OF DIGITAL ARTS, INC.  
**Working edition:** 2026 pre-release documentation  
**Implemented scope:** Version 3 Stages 1–9 plus TESDA pathways, reservation follow-up, Guest Course Explorer, and creative 77-card catalogue  
**Release status:** Stage 10 is intentionally on hold. General grading, completed-hours eligibility, GPA, final general TOR, credential re-enablement, final migration certification, and the `3.0.0` release package remain pre-deployment work.

---

## 1. Purpose and operating model

The CSDA Pricing Toolkit is a local-first progressive web application for public course discovery and authorized school operations. It combines a 77-card curated Guest catalogue with enrollment, scheduling, finance, class lifecycle, academic records, TESDA pathways, payroll, institutional documents, management intelligence, facility rental, notification follow-up, protected backup, and governance controls.

The browser profile is the active data store. Saving in the app does not transmit records to a cloud service. Staff must use an approved device/browser profile, preserve protected backups, close Admin access on shared devices, and follow institutional privacy rules.

### Core principles

1. **Source records are authoritative.** Correct the enrollment, payment, schedule, academic, payroll, or audit source instead of editing exported PDFs.
2. **Evidence precedes approval.** A note, promise, screenshot, or verbal assurance never substitutes for required evidence.
3. **History is preserved.** Revisions, reissues, reversals, status realignments, and superseded documents remain attributable.
4. **No invented academics.** General grades, completed hours, GPA, and final general TOR remain pending until the approved grading controller exists.
5. **Local-first requires disciplined backup.** Device loss, browser clearing, profile removal, or storage corruption can remove the working session.

---

## 2. Launch modes

Every launch presents **Guest** and **Admin**.

### Guest Course Explorer

Guest mode displays 77 curated cards: 76 instructional courses plus the Digital Entertainment Exchange hourly facility card. It allows catalogue browsing, category filtering, search, full-card detail opening, Learn More keyboard access, and quote estimates. Each Guest entry randomly opens one featured card.

Guest mode hides Admin, enrollment, payment entry, facility-rental operations, learner records, and quote-to-enrollment actions. **Exit Guest and restart** reloads the app and returns to the chooser.

### Admin mode

Admin mode opens the institutional toolkit. Credential enforcement is temporarily disabled for development and must be restored during Stage 10. Staff identity attribution still matters: enter and preserve the actual person responsible for each action.

---

## 3. Catalogue and artwork

The active catalogue contains 76 instructional courses and two facility/service records. The Guest experience curates 77 cards by excluding the 8-session facility block.

Every curated card has distinct curriculum-aware vector artwork generated from course identity, icon family, geometric layout, monogram, rotation, and color treatment. Uploaded custom artwork remains unrestricted, lossless, independently positioned, and protected from generated-art replacement.

Pointer users may open a course by selecting anywhere on its front. Learn More remains visible for clarity, keyboard operation, and assistive technology.

### Catalogue administration scenarios

- **Correct a course:** open Admin → Catalogue → Courses, edit only approved information, save, then inspect the public card and Learn More view.
- **Upload custom art:** retain the original-quality source, adjust framing without destructive cropping, and verify text contrast.
- **Curriculum incomplete:** leave unsupported fields blank; Curriculum Readiness will identify missing content.
- **Course publication pending:** use Academic review status rather than claiming readiness.
- **Trainer attribution vs assignment:** Lead Faculty is curriculum attribution. Operational trainer assignment occurs during enrollment/scheduling.

---

## 4. Enrollment workflow

Enrollment uses six visible sections: Student, Guardian/Emergency Contact, Courses, Schedule, Payment, and Agreements, followed by Review & Generate.

### Standard sequence

1. Verify legal name, birth date, educational attainment, provider/school, delivery mode, and optional private profile photo.
2. For a minor, complete the Primary Guardian & Guarantor path and every consent declaration. For an adult, use the optional Emergency Contact path.
3. Select courses, verify price and eligible discounts, and assign a trainer to each selected course.
4. Set trainer, instructional hours, session dates/times, and additional trainer allocation.
5. Select payment plan and record transactions with date, amount, method, reference, notes, and receipt.
6. Accept agreements and complete guardian consent when applicable.
7. Review the generated form, save the record, and use Finalize and create PDF when an official copy is needed.

### Enrollment exceptions

- **Missing trainer:** Standard Paid enrollment remains incomplete until an individual trainer is assigned.
- **Schedule conflict/capacity conflict:** resolve it or record an authorized, named, schedule-bound override. Any later schedule change makes the override stale.
- **Short course/workshop:** only Group of 3+ and Early Bird discounts are available.
- **Mixed restricted bundle:** the stricter discount rule applies so a restricted item never receives an unauthorized discount.
- **Material correction after clearance:** edit the source enrollment. Prior clearance is invalidated and must be reviewed again.
- **Duplicate reference:** saving uses reference-based upsert rather than creating an untracked duplicate.

---

## 5. TESDA enrollment pathways

The five TESDA courses use exactly one pathway.

### Standard Paid

Normal course, trainer, schedule, quote, payment plan, and transaction requirements apply.

### Pooling

Pooling creates a complete reserved applicant record while schedule and payment are deferred until cohort placement. Published fees are **not waived**. The course remains identified and locked, agreements remain mandatory, and the generated form explicitly states the deferred condition.

### Scholarship

Scholarship creates a complete enrollment, waives the full published fee, shows zero payable fees, defers scheduling until placement, and prominently identifies the learner as a TESDA scholarship student.

### Reservation follow-up

Admin → Daily Work → TESDA Reservations supports Reserved, Contacted, Follow-up Required, Placed, and Closed states; method/result; next date; cohort; placement; named history; and CSV export. Marking Placed requires a cohort/batch.

### TESDA scenarios

- **Applicant has no cohort:** retain Reserved or Follow-up Required; do not invent dates or trainer.
- **Pooling applicant asks whether tuition is free:** explain that fees are deferred, not waived.
- **Scholarship applicant asks for payment plan:** no payment plan is required while scholarship status applies.
- **Pathway change:** reopen the source enrollment, document the authorized correction, and regenerate affected documents.
- **No assessment result after completion:** the Executive and Academic views show an assessment backlog; do not infer competency.

---

## 6. Payments, receipts, balances, and refunds

A transaction requires date, amount, method, reference/OR number, notes, and receipt evidence. Pending claims are not approved collections.

### Verification

1. Compare claimant, amount, date, destination, and reference against the authorized external merchant/bank source.
2. Inspect the uploaded proof for readability and consistency.
3. Reject duplicate, altered, mismatched, unreadable, or unverifiable claims with a reason.
4. Approve only after independent confirmation.

### Balances and aging

Net enrollment value less approved collections produces outstanding balance. Executive Intelligence groups balance exposure into Current/not yet due, 1–30, 31–60, 61–90, and over 90 days.

### Refunds

When approved collections exceed current net value, the difference is refund exposure. Issue the refund through the authorized external channel, record the exact amount/reference/reason, attach proof, independently verify, and only then confirm completion.

### Finance scenarios

- **Screenshot but no merchant confirmation:** keep Pending or Flagged.
- **Duplicate reference:** reject and investigate; do not approve both.
- **Payment exceeds net total:** record the payment accurately and complete controlled refund reconciliation.
- **Course removal reduces fees:** preserve original payments and record the revised total; never erase transaction history.
- **Pooling applicant:** amount remains deferred and must not be interpreted as scholarship waiver.
- **Scholarship applicant:** payable is zero and no payment transaction is required.

---

## 7. Scheduling, capacity, and facility use

Scheduling stores exact dates, start/end times, trainers, course boundaries, hours, and skipped dates. Long-form programs may use a date range; other courses use generated session rows.

Capacity Intelligence uses exact time overlap, a configurable default ceiling of 40 concurrent occupied seats, active enrollments, and facility sessions. Dropped and Cancelled enrollments do not occupy seats.

### Conflict scenarios

- **Trainer overlap:** change trainer/time or document an authorized exception.
- **Workstation overlap:** change unit/time; an override does not create physical equipment.
- **Over capacity:** move the session, split the cohort, or obtain an authorized exception with reason.
- **Schedule changed after override:** perform a fresh review because the old fingerprint is stale.
- **Holiday/storm day:** switch off or move the session and regenerate only when appropriate.

### Shared Service Facility

The individual workstation rate is ₱80/hour, pro-rated by minute. Office defaults to CSDA. The approved CSV columns are user name, office, purpose, booked time, and billed amount.

---

## 8. Class lifecycle and Completion Audit

Class Monitor tracks Scheduled, Ongoing, Almost Done, and Done. Timeline movement does not clear finance, academic, trainer, status, or document gates.

Completion Audit requires:

- **Financial:** approved payments, receipts, and resolved refund when applicable.
- **Academic:** verified portfolio/archive evidence.
- **Trainer:** report, attendance resolution, and COMPETENT or NOT YET COMPETENT result.
- **Status:** Active enrollment.
- **Final Admin:** independent review and authorization.

NOT YET COMPETENT is a valid professional outcome and does not by itself block administrative clearance. Missing assessment does block the related requirement.

Dropped or Cancelled records cannot receive current completion documents. Reactivation requires capacity, finance, academic, payroll, and document rechecks.

---

## 9. Academic Command Center and learner profiles

Academic records receive stable student IDs and enrolled-track rows. The Academic Command Center supports learner search, instructor/evaluation-date maintenance, Illustration Assessment, provisional TOR, and assessment-backlog visibility.

The Definitive Learner Profile consolidates identity, contact, enrollment status, courses, payments, schedule, trainer, academic tracks, TESDA pathway, documents, and operational history.

### Academic limitations

Until the grading controller is approved:

- Grade remains Pending.
- Completed-hours eligibility remains Pending.
- GPA remains Pending.
- The general TOR remains Provisional.
- No staff member may calculate, infer, certify, or manually present a final GPA through this app.

Illustration Assessment uses its approved weighted matrix and may produce its specialized assessment TOR independently of the unfinished general grading controller.

---

## 10. Trainer payroll

Expected trainer pool is 30% of net enrollment value. Currently payable pool is 30% of approved collections, capped at expected pool. Multiple distinct trainers share equally.

Voucher lifecycle includes Draft, Finalized, Approved, Partially Released, Released, Superseded, and Cancelled. Release requires exact amount, date, method, transaction reference, proof, and later acknowledgment. Reversal requires reason and recovery/return proof.

### Payroll scenarios

- **No trainer:** liability is held; do not finalize an unsupported allocation.
- **Fees/payments/trainers change:** old voucher is Superseded; create and approve a new revision.
- **Partial release:** preserve remaining liability.
- **Released voucher cancellation request:** do not cancel; use controlled adjustment/reconciliation.
- **Duplicate payout reference:** block and investigate.

---

## 11. Notifications and follow-up

The app prepares and records communication work but does not send messages externally. Minor records default to Guardian; adult records default to Learner. Record actual method, result, response, promise date, next follow-up, resolution, or cancellation reason.

Triggers include balances, payment verification, assessment, trainer report, portfolio, refund, certificate readiness, realignment, and TESDA reservation follow-up.

Never mark Sent before communication occurred, Acknowledged without a response, or Resolved while an obligation remains.

---

## 12. Executive intelligence and reporting

Executive Intelligence supports exact custom dates, month, quarter, calendar year, and fiscal year. It compares the selected period with the immediately preceding equal-length period.

Indicators include gross value, discounts, net value, approved collections, outstanding aging, refund exposure, payroll liability/released/remaining, completion, TESDA outcomes, course demand, trainer workload, seat utilization, dropout/cancellation reasons, assessment backlog, and management highlights.

Dedicated Executive, Finance, Academic, and Operations PDF/CSV outputs are available. Reports never estimate grades or GPA.

---

## 13. Institutional Document Center

The Document Center controls enrollment forms, payment summaries, clearance forms, completion certificates, provisional TORs, Illustration Assessment TORs, payroll vouchers, TESDA reports, management/executive/finance/academic/operations reports, and facility reports.

Each issue receives a unique verification identity, revision, source fingerprint, issuer, issue time, status, and supersession reference. Reissue requires a reason. If the source changes after issue, printing warns that the document is stale.

### Document scenarios

- **Typographical error:** correct the source, enter reissue reason, issue next revision.
- **Old document after material change:** treat as stale/superseded; do not distribute.
- **Certificate requested before clearance:** eligibility blocks issuance.
- **Final general TOR requested:** explain that it remains unavailable pending grading controller.
- **Verification identity mismatch:** stop distribution and compare the register/source.

---

## 14. Backup, restore, migration, and removal

Protected backup creates a password-encrypted full-session CSV ZIP with normalized related tables, encrypted referenced media, and SHA-256 manifest hashes. Session ZIP import has no application-level file-size limit; device memory remains a practical constraint.

### Replace vs Merge

- **Replace:** substitutes the current local session with the imported recognized session.
- **Merge:** retains local data and combines recognized records, preserving newest matching enrollments and operational history.

Always create a current backup before import when possible, verify the preview, confirm the intended mode, wait for adaptation confirmation, and inspect sample enrollments, payments, schedules, academic rows, payroll, documents, and media afterward.

Guarded removal requires administrator verification, mandatory full backup, custody confirmation, and explicit authorization before local clearing.

---

## 15. Privacy, security, and incident response

Access only records required for assigned duties. Do not copy learner, guardian, receipt, payment, recovery-key, or backup-password data to personal devices or unapproved channels. Search is local, but staff must still avoid unnecessary personal information in help queries.

### Incident response

1. Stop the action that could worsen the incident.
2. Preserve the current record, device, audit history, and relevant evidence.
3. Record who observed what and when.
4. Notify authorized management/privacy/security personnel.
5. Do not delete, overwrite, import, or restore until authorized.
6. After resolution, document corrective action and create a protected checkpoint.

---

## 16. Troubleshooting matrix

| Situation | Required response |
|---|---|
| App appears empty | Stop editing; verify browser profile/device and backup status. Do not reset storage. |
| Admin password forgotten | Use the authorized offline recovery key; rotate and securely store the replacement. |
| Wrong staff name shown | Close Admin and sign in with the actual operator before changes. |
| Course not visible | Check category, search, hidden status, and publication readiness. |
| Guest cannot enroll | Expected behavior; exit/restart and enter Admin. |
| Card will not open by keyboard | Tab to Learn More and activate it; full-card pointer click is supplementary. |
| Enrollment cannot finalize | Follow the six-section missing-items summary and record-specific errors. |
| Adult is asked for guardian | Verify date of birth and age path; adults use optional Emergency Contact. |
| Payment cannot be approved | Check required fields, proof, duplication, and external verification. |
| Clearance remains pending | Resolve every item in the record-specific Completion Audit checklist. |
| Certificate blocked | Confirm Active status and finalized Completion Audit. |
| Document says source changed | Reissue from corrected source with a reason. |
| Trainer payroll is zero | Verify approved collections and trainer assignment. |
| Seat override no longer works | Schedule changed; perform a new conflict review. |
| TESDA Pooling shows no schedule | Expected until cohort placement. |
| Scholarship shows fees | Recheck pathway and regenerate the source record/document. |
| GPA requested | State that the grading controller is pending; do not estimate. |
| Backup import fails integrity | Stop; retain the original ZIP and password and investigate the reported missing/hash-failed file. |
| Browser cannot show PDF | Download it and open it in an approved PDF reader. |
| Offline mode | Core app and packaged documentation remain available; external references do not. |

---

## 17. Routine checklists

### Start of shift

- Confirm approved device/browser profile.
- Confirm operator identity.
- Review Daily Briefing and Work Queue.
- Review payment verification, follow-ups, TESDA reservations, capacity conflicts, realignments, and oldest Completion Audits.
- Confirm backup recency.

### Before enrollment finalization

- Identity and age path verified.
- Contact/guardian and consent complete.
- Course, trainer, schedule, hours, fees, discounts, and pathway correct.
- Payment requirements complete or validly deferred/waived.
- Agreements accepted.
- Generated form reviewed.

### Before document release

- Correct source and recipient.
- Eligibility gates complete.
- Verification identity and revision present.
- Source fingerprint is current.
- Names, dates, courses, hours, signatories, and status reviewed.
- Distribution channel authorized.

### End of shift

- Active work saved.
- Pending work assigned/follow-up dated.
- Sensitive exports secured or removed from temporary locations.
- Protected backup created when required.
- Admin closed on shared devices.

---

## 18. Pre-deployment hold / Stage 10

Stage 10 must be completed together with remaining pre-deployment dependencies:

- Final grading controller
- Completed-hours eligibility rules
- GPA computation and certification rules
- Final general TOR activation
- Full migration and Replace/Merge backup testing
- Print and document-verification testing
- PWA/offline audit
- Documentation synchronization
- Administrator credential re-enablement
- Version metadata update to `3.0.0`
- Final build, protected checkpoints, release tag, and SHA-256 checksums

Do not represent the current build as the final Version 3 production release until these items are completed and approved.

---

**CORDILLERA SCHOOL OF DIGITAL ARTS, INC. 2026**
