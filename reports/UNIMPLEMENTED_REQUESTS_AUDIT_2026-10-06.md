# Requested Features Resolution Report

**Date:** 2026-10-06  
**Status:** Implemented and statically verified

## Resolved requests

### Landing catalogue

- Replaced the category-button rail with a compact native **Filter Categories** dropdown.
- Preserved active category, visible-category filtering, search interaction, and matching course counts.

### Individual trainer directory

- Added migration that splits slash-separated team entries into one person per directory entry.
- Courses retain a primary default trainer while enrollment may add any number of additional individual trainers.
- Existing saved enrollment trainer snapshots remain readable.

### Trainer assignment time

- Added per-enrollment trainer assignments with independent trainer, start date, end date, and credited hours.
- Hours are independent of session count and do not need to total the course hours.
- Trainer profiles aggregate primary-course hours and additional credited-hour assignments into a total quantified time with CSDA.

### Trainer profile popup

- Trainer cards open a centered guarded profile dialog.
- Added optimized square WebP photo upload, name, professional title, email, mobile, specialties, biography, portfolio links, and Active/Inactive status.
- Displays assignment history and total credited hours.
- Background clicks do not close the editor; the explicit X/Cancel control does.

### Admin course popup

- Removed persistent Edit and Hide/Show buttons from course cards.
- Entire Admin course cards are clickable.
- Cards open a centered, background-obscuring guarded details popup containing Edit and Hide/Show actions.
- Outside clicks do not close it; the explicit X button does.

### Payments

- Payment entry now requires date, positive amount, method, reference/OR number, and explanatory payment notes.
- Incomplete payment transactions are blocked with a consolidated validation message.

### Enrollment actions

- Enrollment navigation and final actions now use a sticky footer at the bottom of the enrollment window.
- Review and generate, Back to form, Save, and Finalize/Create PDF remain context-appropriate.

### CSV backup package

- Full-session download is now a password-protected CSV ZIP workflow.
- The ZIP contains `manifest.csv` and `database.csv`.
- The complete database payload in `database.csv` remains PBKDF2/AES-256-GCM encrypted with the Admin password.
- Import recognizes the ZIP, extracts the encrypted CSV payload, asks for the password, validates it, and retains Replace/Merge choices.

### Certificate-ready popup

- Successful final clearance now opens a separate centered popup.
- It offers both **Print / Save Completion Certificate** and **Print / Save Clearance Certificate**.

### Popup and action placement correction

- Moved enrollment navigation, Review/Generate, and final controls to a sticky top action bar so they no longer cover lower fields.
- Changed centered detail/profile/audit/certificate overlays to viewport-level sizing behavior, escaping the parent modal's clipping boundary.
- Long popup content now scrolls inside a viewport-safe panel with safe-area padding and overscroll containment.
- Close controls and primary popup tools remain at the top of each panel.

### Direct Admin course editing

- Clicking an Admin course card now opens its editor directly instead of showing an intermediate details screen.
- The complete editor remains in the same centered, guarded popup presentation while editing.
- The X button discards the draft and returns to the main Admin course list.
- Outside clicks remain non-destructive.
- Replaced the clunky popup transition with a short opacity fade and restrained 8-pixel panel rise without bounce.

### Edit Course layout stability

- The Edit Course panel now keeps a fixed viewport-safe height while internal content updates.
- Added a dedicated scrolling body with stable scrollbar space and preserved scroll position across module/artwork re-renders.
- Dynamic artwork/collapsible regions use a `0fr`/`1fr` grid transition boundary with hidden overflow.
- Modal and dynamic elements use targeted `will-change: transform, opacity` rendering hints.
- Validation has a permanently reserved status line, preventing error text from shifting the editor.
- Opening animation runs once; internal updates no longer replay the modal entrance animation.
- Added reduced-motion overrides for all new transitions.

### Structural refactor

- Edit Course actions now occupy a fixed 64-pixel footer outside the scrolling form body.
- Dynamic editor regions retain grid transition boundaries, reserved validation height, layout containment, preserved scroll position, and one-axis fade/rise motion.
- Minor enrollment now has one canonical **Primary Guardian & Guarantor Information** path; duplicate guardian/emergency/billing inputs are no longer rendered.
- Adult enrollment treats the student as sole guarantor and renders only an optional Emergency Contact panel.
- Guardian validation is age-conditional: mandatory only for minors, optional for adults.
- Added a revision-based centralized client cache for visible catalogue configuration; views do not perform independent network fetches.
- Added shared spacing and responsive grid tokens/utilities for stable component rhythm.

### Edit Course animation and trainer cleanup correction

- Removed the Edit Course zoom/spatial-scaling effect entirely.
- Edit Course now uses a short 180ms opacity-only fade; internal editor updates remain animation-free.
- The underlying Admin modal retains its structural transform, preventing tablet jumps.
- Guarded popup panels now use the same 18-pixel curved corners as the rest of the application.
- Trainer migration continues splitting legacy slash-separated teams into individual profiles.
- Trainer lists explicitly exclude any residual name containing `/`.
- New or edited trainer profiles reject `/` and instruct Admin to create separate person records.

### Completion Audit update

- Added a dedicated **Completion Audit** tab to the Administrator window, listing all Done enrollments and their Pending/Cleared state.
- Academic sign-off is now the student’s canonical enrollment name and is displayed read-only as student acknowledgement.
- Replaced free-text grades with a controlled competency dropdown: **COMPETENT** or **NOT YET COMPETENT**.
- Attendance is now a dropdown that defaults to **Complete**.
- Removed seat-utilization input and storage from new completion-audit submissions.
- Final clearance requires Active enrollment, financial clearance, portfolio evidence, student acknowledgement, COMPETENT result, Complete attendance, trainer report, and Admin password approval.

### Completion Audit enrollment synchronization

- Full-enrollment edits launched from Completion Audit now create a permanent, timestamped official change entry naming the administrator.
- Entries identify student/contact changes, course additions or removals, old and new net totals, and schedule/instructional-hour changes.
- Audit reconciliation immediately uses the newly saved enrollment courses, totals, schedule, and approved payments.
- Material edits invalidate any prior final clearance so documents cannot retain stale computations.
- Academic sign-off defaults to the student name but is now editable; all portfolio, competency, attendance, trainer-report, trainer-signatory, and Admin approval controls remain editable before clearance.
- Final approval now opens a second window with visible previews of the CSDA Clearance Form and generated Certificate of Completion, each with its own Print / Save action.

## Verification

- Smoke checks: **118 passed, 0 failed**.
- Inline JavaScript parses.
- No duplicate static IDs.
- Full browser gesture automation remains unavailable because sandbox Chromium lacks a required runtime library.

## Compatibility

- Existing saved records remain readable.
- Trainer team directory entries are normalized at migration time.
- Encrypted legacy `.csdabackup` imports remain supported in addition to the new CSV ZIP package.
