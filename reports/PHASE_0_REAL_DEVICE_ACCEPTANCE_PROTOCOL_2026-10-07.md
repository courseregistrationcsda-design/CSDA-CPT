# Phase 0 — Real-Device Acceptance Protocol

**Prepared:** 7 October 2026  
**Application:** CSDA Pricing Toolkit  
**Phase 0 baseline commit:** `8150020`  
**Baseline cache:** `csda-toolkit-2cc65843888d`  
**Baseline checkpoint SHA-256:** `3613bd2f007ccc161b887d836d991f319e426b29b7e4b19100449b67fb114b8e`  
**Automated static verification:** 125 passed, 0 failed, 1 known browser-runtime warning

## 1. Purpose

This protocol verifies the current application on real browsers and devices before authentication, navigation, data architecture, or workflow changes proceed. It is designed so an authorized CSDA staff tester can execute it without developer assistance.

The tester must not use live personal, payment, guardian, or receipt data. Use clearly fictional test records and test receipt images.

## 2. Roles and sign-off

Complete before testing:

| Role | Name | Responsibility | Signature/date |
|---|---|---|---|
| Primary acceptance tester |  | Executes all required scenarios |  |
| Secondary verifier |  | Rechecks failures and critical document output |  |
| CSDA release approver |  | Accepts residual risk and authorizes next phase |  |

## 3. Required device and browser matrix

Record the actual version and result for each environment.

| ID | Environment | Browser/version | Device/OS | Required mode | Result |
|---|---|---|---|---|---|
| D1 | Desktop | Chrome or Edge | Windows/macOS/Linux | Mouse and keyboard | ☐ Pass ☐ Fail |
| D2 | Android phone | Chrome | Android | Touch, portrait | ☐ Pass ☐ Fail |
| D3 | iPhone | Safari | iOS | Touch, portrait | ☐ Pass ☐ Fail |
| D4 | Tablet | Safari or Chrome | iPadOS/Android | Portrait | ☐ Pass ☐ Fail |
| D5 | Tablet | Safari or Chrome | iPadOS/Android | Landscape | ☐ Pass ☐ Fail |
| D6 | Desktop accessibility | Chrome/Edge/Safari | Any supported desktop | Keyboard only | ☐ Pass ☐ Fail |
| D7 | Reduced motion | Supported browser | Any | OS Reduce Motion enabled | ☐ Pass ☐ Fail |
| D8 | Offline PWA | Installed app/browser | Any supported device | Offline launch/reload | ☐ Pass ☐ Fail |

If a required environment is unavailable, record the reason and obtain release-approver acceptance. Do not silently mark it passed.

## 4. Test-data preparation

Prepare fictional records:

- **Adult learner:** `TEST ADULT, ALEX`
- **Minor learner:** `TEST MINOR, JAMIE`
- **Guardian:** `TEST GUARDIAN, MORGAN`
- **Trainer:** one existing individual trainer or a dedicated test trainer
- **Payment references:** unique values beginning with `TEST-`
- **Receipt images:** clearly labeled `TEST RECEIPT — NOT A REAL PAYMENT`
- **Refund receipt:** clearly labeled `TEST REFUND — NOT A REAL TRANSFER`
- **Portfolio link:** a non-sensitive test URL or local test description

Before testing:

- [ ] Export a protected checkpoint backup if testing against a non-empty operational installation.
- [ ] Record existing enrollment count.
- [ ] Record existing course count.
- [ ] Record existing trainer count.
- [ ] Confirm test records can be deleted or retained under CSDA test-data policy.

## 5. Result notation

For each scenario record:

- **Pass:** Actual result matches every acceptance statement.
- **Fail:** A required result is absent, incorrect, unsafe, or unusable.
- **Blocked:** The scenario cannot be executed because of environment/setup limitations.
- **Observation:** Non-blocking issue that should be considered later.

Severity for failures:

| Severity | Definition | Release effect |
|---|---|---|
| Critical | Data loss/corruption, unauthorized disclosure, gate bypass, stale document issuance, unrecoverable lockout | Stop deployment and next phase |
| High | Core workflow cannot complete, incorrect total/status, inaccessible required action | Fix before next user-facing phase |
| Medium | Workaround exists but causes material confusion or repeated errors | Prioritize and obtain acceptance |
| Low | Cosmetic or minor wording issue without workflow impact | May enter backlog |

## 6. Scenario A — First launch, splash, landing, and responsiveness

Run on D1–D5 and D7.

1. Clear only the test browser’s site data when authorized.
2. Open the application.
3. Observe the splash screen.
4. Search for a known course.
5. Change the category dropdown.
6. Open and close a course.
7. Rotate or resize the viewport while the catalogue and focused detail are visible.
8. Hover inactive artwork on pointer devices and tap it on touch devices.

Expected:

- [ ] First-launch splash remains visible for approximately three seconds.
- [ ] Original CSDA logo appears on the left.
- [ ] Transparent CPT logo appears without a background container.
- [ ] Search and category filter update visible courses and counts.
- [ ] Course opening uses calm, zero-bounce motion.
- [ ] Focused background blurs and the source card is not duplicated.
- [ ] Closing restores the source card smoothly.
- [ ] No content is clipped after resize or rotation.
- [ ] Reduced-motion mode removes unnecessary animation without hiding content.

Result: ☐ Pass ☐ Fail ☐ Blocked  
Notes:

## 7. Scenario B — Adult enrollment

Run on D1, D2, and D3.

1. Start a new enrollment.
2. Enter the fictional adult learner.
3. Confirm the second step is described as Emergency Contact and is optional.
4. Select one course.
5. Assign a trainer.
6. Complete schedule, payment plan, and agreements.
7. Move backward and forward across all six sections.
8. Review and generate the enrollment form.
9. Use Back to form, make one harmless correction, review again, save, and finalize.

Expected:

- [ ] Progress increases and decreases from steps 1–6.
- [ ] Adult path does not require guardian/guarantor data.
- [ ] Tabs and Back/Next retain entered data.
- [ ] Missing sections are identified before review.
- [ ] Trainer name persists into the saved enrollment.
- [ ] Final controls read `Finalize and create PDF`, `Save`, and `Back to form` where applicable.
- [ ] Generated form matches learner, course, schedule, fees, and trainer.
- [ ] Sticky controls do not cover fields on mobile.

Result: ☐ Pass ☐ Fail ☐ Blocked  
Record reference:

## 8. Scenario C — Minor enrollment

Run on D1 and one touch device.

1. Start a new enrollment.
2. Enter a birth date under age 18.
3. Leave guardian information incomplete and attempt review.
4. Complete parent/legal guardian and guarantor information.
5. Complete remaining sections and generate the form.

Expected:

- [ ] Second step changes to Primary Guardian & Guarantor.
- [ ] Missing guardian consent/details block completion clearly.
- [ ] Duplicate emergency/guardian paths are not shown.
- [ ] Completed guardian data appears correctly in the saved record/document.

Result: ☐ Pass ☐ Fail ☐ Blocked

## 9. Scenario D — Multi-course pricing and discount rules

Run on D1.

1. Create a multi-course enrollment.
2. Add and remove courses.
3. Check subtotal and net total after each change.
4. Test an eligible long-course promotion.
5. Test a short course/workshop.
6. Confirm Full Payment and Bundle discounts do not apply to short courses/workshops.
7. Confirm Group of 3+ and Early Bird remain available where configured.

Expected:

- [ ] Totals recompute immediately and consistently.
- [ ] No removed course remains in schedule, hours, or totals.
- [ ] Discount eligibility follows course-type rules.
- [ ] Resulting promotion price is shown with its checkbox rather than in a redundant table.

Result: ☐ Pass ☐ Fail ☐ Blocked

## 10. Scenario E — Payment entry and independent verification

Run on D1 and D2.

1. Add a payment while omitting each required field in turn.
2. Confirm incomplete payments cannot be saved.
3. Complete date, amount, method, reference, notes, and test receipt.
4. Open Admin using the actual tester’s name.
5. Open payment verification.
6. Review the receipt and simulate checking the external portal.
7. Approve the payment.

Expected:

- [ ] Every transaction field is mandatory.
- [ ] Receipt can be uploaded without clipping or losing form state.
- [ ] Payment remains pending until approved.
- [ ] Approval records the named Administrator and timestamp.
- [ ] Receipt remains attached and visible after reopening.
- [ ] App wording does not treat a screenshot as independent proof.

Result: ☐ Pass ☐ Fail ☐ Blocked

## 11. Scenario F — Lifecycle monitor, drag, and accessible movement

Run on D1, D2, D4/D5, and D6.

1. Open Class Monitor.
2. Verify cards show only learner names.
3. Drag a card by different parts of its surface.
4. On touch, drag using a normal thumb.
5. Use keyboard to open a card and use the Move control.
6. Move a record to Done.
7. Return it to automatic status.

Expected:

- [ ] Entire card is draggable.
- [ ] Drop target is comfortable for touch.
- [ ] Keyboard users can perform equivalent movement.
- [ ] Moved card opens the audit when entering Done.
- [ ] Timeline movement changes schedule state only.
- [ ] Payment, portfolio, trainer, and Admin gates remain unchanged.

Result: ☐ Pass ☐ Fail ☐ Blocked

## 12. Scenario G — Completion Audit without refund

Run on D1 and one touch device.

1. Open the oldest unresolved Done audit.
2. Ensure enrollment is Active.
3. Confirm all approved payments have receipts and cover the net total exactly.
4. Add the portfolio link and press Confirm portfolio verified.
5. Enter trainer report, choose `COMPETENT`, set attendance Complete, and confirm trainer report.
6. Save progress, close, and reopen.
7. Enter the final Admin password and approve.

Expected:

- [ ] Pending panel gives a detailed record-specific list.
- [ ] Academic name comes automatically from the learner enrollment.
- [ ] Trainer name comes automatically from assigned trainer.
- [ ] Confirmation uses buttons, not checkboxes.
- [ ] Confirmed state survives save/reopen.
- [ ] Approval remains disabled until all required gates are complete.
- [ ] Correct password opens the two-document review window.

Result: ☐ Pass ☐ Fail ☐ Blocked

## 13. Scenario H — `NOT YET COMPETENT` clearance

Run on D1.

1. Prepare a Done, Active enrollment with complete financial, portfolio, attendance, and trainer report requirements.
2. Choose `NOT YET COMPETENT`.
3. Confirm trainer report.
4. Complete final approval.

Expected:

- [ ] Result is recorded visibly.
- [ ] App does not require competency reassessment.
- [ ] `NOT YET COMPETENT` does not itself block clearance.
- [ ] All other gates remain required.

Result: ☐ Pass ☐ Fail ☐ Blocked

## 14. Scenario I — Refund-required Completion Audit

Run on D1.

1. Prepare approved payments that exceed the current net total.
2. Open Completion Audit.
3. Observe the calculated refund requirement.
4. Attempt confirmation without amount/reference/receipt.
5. Enter the exact amount and reference.
6. Upload the test refund receipt.
7. Confirm refund.
8. Change the reference and save.
9. Confirm the prior refund confirmation is invalidated.
10. Correct and reconfirm.

Expected:

- [ ] Overpayment amount is calculated correctly.
- [ ] Clearance remains pending until exact amount, reference, receipt, and confirmation are present.
- [ ] Partial or unsupported refund cannot be confirmed.
- [ ] Changing material refund details invalidates confirmation.
- [ ] Refund confirmation records actor and timestamp.

Result: ☐ Pass ☐ Fail ☐ Blocked

## 15. Scenario J — Post-clearance enrollment edit

Run on D1.

1. Open a cleared record.
2. Use Open and edit full enrollment.
3. Add or remove a course and change a schedule/hour value.
4. Save and return to Completion Audit.

Expected:

- [ ] Course list, schedule, hours, subtotal, and net total recompute.
- [ ] Official timestamped change entry names the Administrator.
- [ ] Prior final clearance is invalidated.
- [ ] Stale documents cannot remain approved.
- [ ] Refund or balance requirement updates from the revised total.
- [ ] Fresh confirmations/approval are required where applicable.

Result: ☐ Pass ☐ Fail ☐ Blocked

## 16. Scenario K — Clearance Form and Certificate

Run on D1, D2/D3, and available print/save destinations.

1. Approve a fully cleared record.
2. Inspect both previews.
3. Print/save the Clearance Form.
4. Print/save the Certificate.

Expected:

- [ ] Separate previews are visible.
- [ ] Each has its own Print / Save action.
- [ ] Learner, course, completion date, hours, trainer, Administrator, and reference are correct.
- [ ] Print layout is not clipped.
- [ ] Browser Save as PDF produces readable output.

Result: ☐ Pass ☐ Fail ☐ Blocked

## 17. Scenario L — Backup export, preview, Merge, and Replace

Run on D1 using test data.

1. Record current counts.
2. Export a password-protected CSV ZIP backup.
3. Inspect expected package entries.
4. Attempt import with the wrong password.
5. Import with the correct password and inspect the preview.
6. Test Merge on a controlled copy/profile.
7. Test Replace on a controlled copy/profile.
8. Reopen representative enrollments, payments, receipts, schedules, trainers, artwork, audit history, and settings.

Expected:

- [ ] Wrong password reveals no usable content and changes no data.
- [ ] Preview identifies recognized contents before modification.
- [ ] Merge retains local content and combines recognized imported content according to current rules.
- [ ] Replace restores imported session content.
- [ ] All recorded evidence survives round trip.
- [ ] Failure does not leave a partial import.

Result: ☐ Pass ☐ Fail ☐ Blocked

## 18. Scenario M — Keyboard, focus, and reduced motion

Run on D6 and D7.

1. Complete landing search/filter using keyboard only.
2. Open and close a course.
3. Open Admin, move across tabs, open a guarded editor, and close it.
4. Open enrollment and navigate tabs with Arrow, Home, and End keys.
5. Open Class Monitor and a detail/audit window.
6. Check focus after each close.
7. Repeat key transitions with reduced motion enabled.

Expected:

- [ ] All required controls are reachable and visibly focused.
- [ ] Focus remains trapped inside active modal dialogs.
- [ ] Closing returns focus to a logical triggering control.
- [ ] Tab arrow-key behavior works.
- [ ] Status and errors are available as text.
- [ ] Reduced motion removes animation without breaking visibility or state.

Result: ☐ Pass ☐ Fail ☐ Blocked

## 19. Scenario N — Offline install, launch, and update

Run on D1 and one mobile device.

1. Install/open the PWA while online.
2. Close it fully.
3. Disable network access.
4. Relaunch and open core locally stored screens.
5. Restore network.
6. Load a newer test cache/build when available and verify activation.

Expected:

- [ ] App launches offline after successful initial caching.
- [ ] Local records remain available.
- [ ] App does not depend on external fonts/scripts/images for core operation.
- [ ] New cache activation does not erase data.
- [ ] Old caches are removed according to service-worker behavior.

Result: ☐ Pass ☐ Fail ☐ Blocked

## 20. Defect log template

Duplicate one row per issue.

| Defect ID | Date | Tester | Build/cache | Device/browser | Scenario/step | Expected | Actual | Severity | Reproducible | Evidence | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| P0-001 |  |  |  |  |  |  |  |  | ☐ Yes ☐ No |  | Open |

## 21. Final sign-off

### Summary

- Total scenarios passed:
- Total scenarios failed:
- Total scenarios blocked:
- Critical defects open:
- High defects open:
- Accepted medium/low observations:

### Tester statement

I confirm that I executed the recorded scenarios using fictional or authorized test data and that the results above accurately represent the tested application build.

**Primary tester:** ____________________  **Date:** __________

**Secondary verifier:** ________________  **Date:** __________

### Release/phase decision

- [ ] Approved to begin Phase 1
- [ ] Conditionally approved with listed accepted risks
- [ ] Not approved; critical/high defects must be resolved

**CSDA release approver:** ______________  **Date:** __________

## 22. Known test-environment limitation

The repository’s static smoke suite currently passes. Automated browser interaction checks cannot run in the present sandbox because bundled Chromium lacks a required runtime system library. This is why real-device execution of touch, focus, file upload, print, service-worker, and viewport scenarios is mandatory before broader deployment.
