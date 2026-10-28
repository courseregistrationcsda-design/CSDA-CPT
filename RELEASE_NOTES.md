# CSDA Pricing Toolkit 2.0.0

**Release date:** 2026-10-08  
**Status:** Stabilized baseline for the next input cycle

## Release scope

Version 2.0.0 consolidates the completed pricing, enrollment, trainer allocation, payment verification, Shared Service Facility, lifecycle monitoring, Completion Audit, document, backup/restore, embedded guidance, camera, offline/PWA, and semantic theme work into one supported baseline.

## Current operational highlights

- Six-step enrollment with age-aware contact terminology and private student-record photos.
- Immediate trainer assignment per selected course, equal multi-trainer allocation, and editable generated sessions.
- Payment and refund evidence capture through upload or the embedded camera.
- Shared Service Facility workstation rental at ₱80 per hour, pro-rated by actual minutes.
- Completion Audit with independent financial, academic, trainer, status, and final Admin gates.
- Password-protected complete-session ZIP backup and previewed Replace/Merge restore.
- Embedded General Administrative Guidelines PDF with an optional secondary searchable guide.
- Responsive semantic light/dark themes using versioned design tokens.
- Hosted PWA and self-contained offline artifact generated from the same source.

## Version 3 Stage 2 curriculum intelligence

- **Admin → Catalogue → Curriculum Readiness** now calculates completeness across all 76 instructional courses without inventing missing content.
- Four readiness states distinguish Draft, Operationally Complete, Academic Review Required, and Ready for Publication. Publication readiness requires complete structured fields plus explicit Academic approval.
- Course Admin now supports learning outcomes, prerequisites, required software, required materials, assessment methods, certificate/competency outcome, and academic publication status.
- Curriculum governance exports a complete CSV and a signatory-ready Print/Save PDF report showing percentage, readiness, and exact missing fields per course.
- Learn More surfaces approved structured curriculum details when present; blank fields remain hidden from the public course view but visible as missing in Governance.

## Version 3 production curriculum catalogue

- The supplied production blueprint now populates all **76 instructional courses** with verified title, published faculty attribution, price, contact hours, sessions, duration, description, delivery format where supplied, structured modules, and lesson/hour roadmaps.
- The catalogue now contains **78 active records**: 76 instructional courses plus the two DTI Shared Service Facility entries. WCA07 Commercial Splash Art Production is the new instructional addition supplied by the Version 3 blueprint.
- Saved catalogues migrate to `csda-course-catalogue-v3`; pending, ungraded Academic Ledger tracks synchronize course identity, title, and hours without rewriting graded historical rows.
- Lead Faculty and Delivery Format are visible in Learn More and editable in Admin Course management. Published faculty teams remain curriculum attribution and do not silently recreate trainer profiles or operational assignments after the approved trainer reset.

## Post-2.0 catalogue enhancement

- Course cards now use compact square tiles in a four-column desktop grid. A complete 78-entry Version 3 icon matrix assigns every active course and DTI facility service its own high-vibrancy gradient and unique seeded geometric logo, extending the uploaded 66-logo visual grammar for full catalogue coverage.
- Guaranteed dark frosted title/detail plates, earlier long-title breakpoints, compact action rows, and mobile-specific type scales prevent curriculum names from clipping or becoming unreadable over any bright artwork.
- Course code, title, hours/sessions, price, and an explicit **Learn More** control form the landing-card hierarchy; details open only through that control.
- Generated art replaces legacy landing-card artwork by default. Admin can upload a new replacement at any time.
- Course artwork accepts JPG, PNG, or WebP without app-level file-size or quality ceilings. The original-quality source, lossless square framing, and editor positioning data are retained for offline use and protected backup.
- Shared controls, panels, status surfaces, and administrative cards receive the same soft-edged, floating-shadow treatment.

## Version 3 Stage 6 enrollment realignment

- Dropped, Cancelled, and reactivated enrollment status changes now create a named, timestamped realignment case covering seat occupancy, academic status, finance, payroll, notifications, and document eligibility.
- Dropped/Cancelled records immediately release capacity and are excluded from Stage 5 occupancy; reactivation requires a fresh capacity check.
- Financial history remains immutable while the realignment snapshot identifies net fees, approved collections, remaining balance, and credit/refund review exposure.
- Academic status synchronizes to dropout, cancelled, or active without inventing grades or GPA. Document issuance is blocked and stale clearance is invalidated for non-active records.
- Existing payroll vouchers become Superseded because enrollment status is part of the payroll fingerprint; prior releases remain preserved for reconciliation.
- **Admin → Operations → Enrollment Realignment** provides an oldest-first review queue, resolution record, CSV, Print/Save PDF, and protected `enrollment_realignments.csv` backup.

## Version 3 Stage 5 capacity and schedule intelligence

- **Admin → Operations → Capacity & Conflicts** now calculates exact concurrent occupancy from each session date, start time, and end time against the configurable 40-seat creator-space ceiling.
- Active learner enrollments and facility users count toward occupancy; Dropped and Cancelled enrollments are excluded.
- The engine reports peak occupancy by date/time, over-capacity periods, same-trainer overlaps, and duplicate workstation bookings with exact affected references.
- Enrollment finalization performs a preflight schedule check. Conflicts block silent finalization and require a named, timestamped override reason tied to the exact schedule fingerprint; schedule changes invalidate stale overrides.
- Capacity reporting supports exact From/To dates, CSV, Print/Save PDF, and configured signatories. Protected schedule backups retain capacity overrides.

## Version 3 Stage 4 notification and follow-up workflow

- **Admin → Daily Work → Follow-ups** now maintains local, auditable communication records without pretending to send external SMS, email, calls, or Messenger messages.
- Automatic, duplicate-safe triggers cover regular-course balances one session before completion, completed classes with unpaid balances, pending payment verification, assessment, trainer report, portfolio, refund, and certificate-ready follow-ups.
- Records progress through Queued, Prepared, Sent, Acknowledged, Follow-up Required, Resolved, and Cancelled states with named, timestamped history.
- Recipient routing defaults to Guardian for minors and Learner for adults, while remaining editable for authorized Emergency Contact handling.
- Sent, acknowledgment, and follow-up states enforce method/delivery, response, and follow-up-date evidence respectively; promise-to-pay dates and operational notes are retained.
- Today / Work Queue now includes an Open Follow-ups briefing card, and protected normalized backups include `notifications.csv`.

## Version 3 Stage 3 controlled payroll release

- Trainer vouchers now progress through Draft, Finalized, Approved, Partially Released, Released, Superseded, and Cancelled states.
- Finalized vouchers store a financial/trainer fingerprint. Any later change to net fees, approved collections, or assigned trainers marks the voucher Superseded and requires a new revision before approval or payout.
- Payroll releases require date, method, unique transaction reference, positive amount, and payout proof. The engine blocks releases above the approved-cash-payable balance and blocks cancellation after money has been released.
- Partial releases retain allocations across all assigned trainers, remaining liability, named Admin attribution, and trainer/representative acknowledgment. Recorded reversals require a reason and recovery/return proof and preserve the original release history.
- Consolidated payroll reporting supports exact From/To dates, trainer and enrollment detail, expected/payable/released/remaining totals, CSV, and Print/Save PDF.
- Protected normalized backups now include encrypted payroll voucher and release tables in addition to the full encrypted session.

## Finance automation and signatories staging

- Regular-course enrollments with an outstanding approved-payment balance enter the Balance Notification Queue on the second-to-last scheduled session and remain visible until settled or manually marked notified.
- Every enrollment receives a live trainer compensation computation immediately: the expected pool is 30% of the net enrollment total, while the currently payable pool is 30% of approved cash collected, capped at the expected amount.
- All assigned trainers participate equally in the 30% pool regardless of primary or co-teacher designation. Missing trainer assignments hold allocation rather than silently assigning it.
- Admin can print a separate **ADMIN COPY** payroll draft and finalize a revisioned Trainer Payroll Voucher. Fee, payment, or delivery-team changes require a new revision.
- Registrar, Academic Head, Finance Officer, and Administrator names/titles are configurable under Governance → Signatories and are reused by applicable TORs, certificates, clearance documents, payroll vouchers, and printed reports.

## Deployment blocker

> **Administrator credential enforcement is temporarily disabled for development.** Set `ADMIN_CREDENTIALS_DISABLED` to `false`, verify named sign-in and protected actions, and rerun the full release checks before any deployment.

## Version 3 academic architecture staging

- The new **Admin → Academic Ledger** workspace searches learners by name, Student ID, enrollment reference, course, or instructor and opens a permanent per-learner track view.
- Finalized enrollment courses now seed academic tracks automatically without overwriting existing ledger rows. Course code, title, hours, instructor, and evaluation date remain attached to the learner record.
- Instructor and evaluation-date corrections create named, timestamped academic change-history entries.
- A clearly marked **Provisional Transcript of Records** can be printed with configurable Academic Head and Registrar signatories. Grades, completed hours, and GPA display as Pending because the institutional grading controller is still being finalized; the app does not infer or certify them.
- Phase 1 academic records now include stable institutional Student IDs, isolated academic track arrays, clearance gates, and an Illustration Institutional Assessment matrix.
- Illustration NC II Completion Audits provide the complete 50% Skill and Output, 25% Performance, and 25% Knowledge rubric with validated 0–100 ratings.
- The assessment engine calculates weighted subtotals and a final binary result: COMPETENT at 80% or above, otherwise NOT YET COMPETENT.
- A monochrome, print-ready Illustration Transcript of Records includes criterion ratings, weighted scores, final result, remarks, assessor, verifier, and Student ID.

## Governance reporting and installation update

- **Get app** now proceeds directly to the browser-owned installation prompt. It no longer opens the installation window or offers separate launcher/logo downloads.
- Governance now includes **Reports & Analytics**, with custom dates plus monthly, quarterly, calendar-year, and configurable fiscal-year reporting.
- Management reporting summarizes enrolled, active, finished, dropped, and cancelled records, top courses, monthly trends, trainer performance, and class-level detail.
- Reports can be distributed through Print/Save PDF or detailed CSV export.
- TESDA Outcomes is now a core analytics section for the five TESDA-category courses, covering enrollees, active learners, graduates/finishers, drops, cancellations, assessment status, competency outcomes, completion rate, and competency rate.
- TESDA figures have dedicated PDF/CSV outputs and are also included in the combined management outputs.
- The trainer directory and all existing trainer assignments are intentionally cleared once during migration for a fresh operational start. The pre-change checkpoint preserves the prior state.
- Import Session ZIP no longer enforces a 50 MB application limit; complete offline archives are accepted subject only to browser and device capabilities.
- Successful Replace or Merge restoration now presents a confirmation popup proving that integrity verification, decryption, schema adaptation, and implementation completed, with recognized record counts and backup metadata.

## Compatibility and migration

- Existing browser records are migrated in place when the app opens.
- Existing facility sessions retain the rate stored when they began; new sessions use ₱80/hour.
- Receiving-installation Administrator credentials are preserved during session ZIP restore.
- Before upgrading a production device, download and verify a complete session ZIP.

## Verification baseline

The release must pass `npm test`, `npm run build`, and `git diff --check`. Browser/device acceptance remains required for camera permissions, printing, PDF embedding, installation, and touch interaction.

## Archived history

Pre-2.0 implementation and phase reports are preserved under:

`reports/archive/pre-v2.0.0/`

## TESDA Enrollment Pathways
- Added mutually exclusive Standard Paid, Pooling, and Scholarship pathways for the five TESDA courses.
- Pooling creates a complete applicant record while deferring schedule and payment until cohort placement; fees are not waived.
- Scholarship creates a complete enrollment with a 100% fee waiver, zero payable balance, deferred scheduling, and prominent scholarship labeling.
- Special pathways lock the selected TESDA course and disable trainer, schedule, discount, payment-plan, and transaction inputs while keeping applicant details, agreements, review, record creation, PDF output, backups, and analytics active.
- TESDA management reports and CSV exports now identify the enrollment pathway.

## TESDA follow-up filter
- Admin Enrollments now filters All TESDA, TESDA Standard Paid, Pooling/Reserved, and Scholarship/Reserved students for focused follow-up.
- Enrollment cards identify TESDA pathway and reservation state.
- Download shown (CSV) exports the active search/filter result with TESDA pathway and reservation-status columns.

## TESDA reservation follow-up workflow
- Added Admin → Daily Work → TESDA Reservations for Pooling and Scholarship applicants.
- Staff can record contact method/result, next follow-up date, cohort/batch, reservation state, placement, closure, and immutable named history.
- Placement requires a cohort; focused CSV export supports handoff and outreach.

## Version 3 Stage 7 Executive Reports and Decision Intelligence
- Added period-over-period decision intelligence using equal-length comparison windows and exact custom, month, quarter, calendar-year, and fiscal-year periods.
- Added gross revenue, discounts, net enrollment value, approved collections, outstanding-balance aging, refund exposure, payroll liability/released/remaining, completion, TESDA, demand, workload, seat-utilization, dropout/cancellation reason, and assessment-backlog indicators.
- Added management highlights and dedicated Executive, Finance, Academic, and Operations CSV/PDF outputs.
- General grading, completed-hours eligibility, and GPA remain explicitly pending the approved grading controller and are never estimated.

## Version 3 Stage 8 Institutional Document Center
- Added a centralized Governance document dashboard for learner and institutional documents.
- Supports controlled enrollment forms, payment summaries, clearance forms, completion certificates, provisional TORs, Illustration Assessment TORs, payroll vouchers, TESDA reports, management and executive reports, and facility reports.
- Every issued learner document receives a unique verification identity, revision number, source fingerprint, named issuer, issue time, and supersession chain.
- Reissue requires a reason; prior revisions remain in the document register as Superseded. Printing warns when the source record changed after issue.
- Final general TOR remains visibly pending the approved grading controller; grades, completed hours, and GPA are not estimated.

## Version 3 Stage 9 Premium Interface Polish
- Added the Academic Command Center, definitive consolidated learner profiles, an executive dashboard header, and a daily operational briefing.
- Added calm device-local save-state indicators, refined empty/loading treatments, consistent soft-surface styling, responsive Admin navigation, tablet/mobile grids, and touch-friendly controls.
- Added print-specific surface cleanup, stronger keyboard focus visibility, comprehensive reduced-motion fallbacks, and responsive accessibility refinements.
- Preserved visible grading-controller, completed-hours, and GPA pending states throughout academic and learner views.

## Daily Guest / Admin launch experience
- Every app launch now begins with a Guest or Admin choice.
- Guest mode provides a curated kiosk with 77 cards: all 76 current instructional courses plus the Digital Entertainment Exchange hourly facility card, including search, category browsing, Learn More, and quote estimates while hiding enrollment, facility rental, Admin, and institutional records.
- Each Guest entry randomly spotlights and opens one instructional course; the featured course changes on the next Guest launch.
- A visible Exit Guest and restart control reloads the app and returns to the launch choice.
- Stage 10 remains deferred and will be completed together with grading-controller and other pre-deployment requirements.

## Creative 77-card artwork collection
- Added a unique seeded vector composition for each of the 76 instructional courses plus the Digital Entertainment Exchange hourly card.
- Every generated cover combines curriculum-specific iconography with its own geometric field, placement, rotation, monogram, and color treatment; custom uploaded artwork remains untouched and lossless.
- Pointer users may now open course details by clicking anywhere on the front of a card. Learn More remains visible and keyboard accessible.

## Complete documentation and redesigned in-app guidelines
- Rebuilt the General Administrative Guidelines as a polished, responsive, searchable manual with a structured table of contents, scenario matrix, print layout, and mobile reading experience.
- Added complete Version 3 product, operations, data, control, troubleshooting, privacy, backup, document, TESDA, finance, academic, payroll, kiosk, and pre-deployment documentation.
- Replaced the cluttered in-app guideline stack with a focused documentation hub: quick local Guide Search, interactive manual, PDF download, and complete Markdown documentation download.
- Regenerated the detailed offline PDF and synchronized the guide with Stages 1–9, the 77-card Guest kiosk, and the explicit Stage 10/grading hold.

## Layout spacing and containment correction
- Added consistent interior padding around top-level quote, Admin, rental, course-editor, and enrollment panels so controls no longer sit against or over container borders.
- Removed overlapping sticky section-title geometry, negative tab offsets, and narrow-layout grid overflow.
- Added strict min-width containment for grid children, fields, cards, tables, QR content, plan rows, unit grids, and modal bodies.
- Improved tablet/mobile panel gutters, two-column small-screen workstation cards, wrapping controls, and print-safe spacing resets.
