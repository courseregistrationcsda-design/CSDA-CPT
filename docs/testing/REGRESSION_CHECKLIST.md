# CSDA Pricing Toolkit — Regression Checklist

Run the automated check first:

```bash
npm run smoke
```

Then complete the manual sections affected by the change. Record the browser, viewport, result, and any evidence.

## Test record

- Date:
- Build/cache version:
- Tester:
- Browser and version:
- Device/OS:
- Viewport:
- Change under test:

Use **Pass**, **Fail**, **Blocked**, or **Not applicable**.

---

## A. Application shell

- [ ] Splash shows the CSDA logo and transparent CPT artwork correctly.
- [ ] Splash exits and reveals the catalogue.
- [ ] Header, search, theme, fullscreen, Get app, and Admin controls render.
- [ ] No visible broken images or missing icons.
- [ ] No unexpected horizontal page scrolling.
- [ ] No uncaught JavaScript errors appear in the browser console.

## B. Search and catalogue

- [ ] Category directory renders with counts.
- [ ] Search by a course-name term filters the feed.
- [ ] Search by a lesson/module term returns a relevant result.
- [ ] Clear-search button restores the full catalogue.
- [ ] `/` focuses search when no modal is open.
- [ ] Category filters switch the visible feed correctly.
- [ ] Hidden courses/categories remain hidden outside Admin.

## C. Course outline and quotation

- [ ] Clicking a course opens one focused detail panel.
- [ ] Source card is not duplicated behind the focused panel.
- [ ] Backdrop blur covers the catalogue.
- [ ] Detail panel stays inside the viewport at the current screen size.
- [ ] Resizing/orientation change keeps the open panel usable.
- [ ] Closing runs the panel exit and source-card return animation.
- [ ] Close button, outside click, and Escape behave as designed.
- [ ] Proceed to details opens the correct quotation.
- [ ] Adding/removing courses updates subtotal and net payable.
- [ ] Bundle and discount rules produce expected totals.
- [ ] Payment-plan comparison updates correctly.

## D. Adult enrollment

- [ ] Enroll Student opens a fresh form.
- [ ] Student details persist when moving between tabs.
- [ ] Emergency-contact details persist between tabs.
- [ ] Course add/remove updates pricing.
- [ ] Assigned-trainer selection and custom trainer fields work.
- [ ] Schedule is generated from the selected course hours.
- [ ] Payment plan and due dates update from the schedule.
- [ ] Privacy Policy and Terms can be accepted independently.
- [ ] Missing requirements block review with a useful message.
- [ ] Review generates the correct client document.
- [ ] Save record stores the enrollment.
- [ ] Finalize generates print output and trainer handoff when applicable.

## E. Minor enrollment and consent

- [ ] A date of birth under 18 activates parental consent requirements.
- [ ] Guardian name, relationship, and mobile are required.
- [ ] Consent declarations and electronic signature are initially unchecked.
- [ ] Review/save/finalize remain blocked until consent is complete.
- [ ] Completed consent appears in the generated document.

## F. Scheduling

- [ ] Every-other-day schedule is generated correctly.
- [ ] Sundays are excluded.
- [ ] Saturday choice is respected when regenerating.
- [ ] Configured holidays are skipped when enabled.
- [ ] Date nudge controls move only the selected session.
- [ ] Removing a session adds a replacement at the end.
- [ ] Restoring a removed date rebuilds the schedule.
- [ ] Changing session duration preserves total contact hours.
- [ ] Date-range courses show start/end instead of a session grid.

## G. Payments and verification

- [ ] Recording a payment updates paid and remaining balances.
- [ ] Removing a payment restores the previous balance.
- [ ] Payment stages reconcile correctly after course changes.
- [ ] Credit balances are labeled as credits, not amounts due.
- [ ] Receipt-image size validation works.
- [ ] Pending, Approved, Flagged, and Suspended states render correctly.
- [ ] Re-uploading flagged proof returns it to Pending.
- [ ] Printed totals agree with on-screen totals.

## H. Administration

- [ ] Admin opens and password gate works.
- [ ] Course create, edit, hide, show, and delete work.
- [ ] Category edit/hide/show works.
- [ ] Promo and payment-plan changes save correctly.
- [ ] Trainer add/edit/delete works.
- [ ] Enrollment search, open, edit, print, and protected delete work.
- [ ] Payment verification actions are recorded.
- [ ] CSV template/export/import works.
- [ ] JSON export/import restores catalogue and records.
- [ ] Reset restores defaults while preserving saved enrollments.

## I. Facility rental

- [ ] Facility Rental opens and lists workstations.
- [ ] A session can start with user and equipment details.
- [ ] Timer survives a page reload.
- [ ] Time can be added and corrected.
- [ ] Session can be closed with the correct prorated amount.
- [ ] Rental slip prints correctly.
- [ ] Rental CSV downloads correctly.
- [ ] An active workstation cannot be withdrawn.

## J. Install, offline, and backup

- [ ] Manifest, service worker, favicon, and icons return HTTP 200.
- [ ] Hosted app offers installation where supported.
- [ ] Download app file produces a clean standalone copy.
- [ ] Standalone copy boots without a network connection.
- [ ] Downloaded launcher and icon use the CPT artwork.
- [ ] Export/import instructions accurately describe local-only storage.

## K. Responsive viewports

Test the relevant flow at:

- [ ] 320 × 568
- [ ] 390 × 844
- [ ] 768 × 1024
- [ ] 1280 × 720
- [ ] 1440 × 900
- [ ] 1920 × 1080
- [ ] 2560 × 1440

At each applicable size confirm:

- [ ] No clipped modal or hidden primary action.
- [ ] No unintended page-level horizontal overflow.
- [ ] Focused course panel remains visible and scrollable.
- [ ] Mobile bottom sheets stay inside the dynamic viewport.
- [ ] Sticky actions do not cover required content.

## L. Accessibility and preferences

- [ ] Full applicable flow is keyboard operable.
- [ ] Visible focus is never lost behind an overlay.
- [ ] Focus returns to the launch control after closing.
- [ ] Screen reader announces modal/status changes.
- [ ] Light and dark themes retain readable contrast.
- [ ] Reduced-motion mode removes prolonged movement and shimmer.
- [ ] Browser zoom at 200% does not hide required actions.

## Exit criteria

A change is ready only when:

1. `npm run smoke` passes.
2. All affected manual checks pass.
3. Any skipped check has a documented reason.
4. No unrelated critical flow regresses.
5. The performance baseline is updated only when the production payload intentionally changes.
