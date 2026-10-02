# CSDA Pricing Toolkit — Incremental Improvement Tasks

**Working principle:** Improve the existing application in place. Do not rebuild from scratch, change frameworks, or remove working functionality without a measured reason.

**Source:** `UI_UX_AUDIT_REPORT.md`

## Prioritization key

- **P0:** Required before broad production use
- **P1:** High-value usability improvement
- **P2:** Performance, maintainability, and refinement
- **S:** Small — localized change
- **M:** Medium — several related components
- **L:** Large — cross-application behavior or careful migration

---

# Phase 0 — Establish a safe baseline

These tasks prevent future improvements from breaking existing behavior.

## T-001 — Create a regression checklist

- **Priority:** P0
- **Effort:** S
- **Risk:** Low
- **Change type:** Documentation/testing only
- **Scope:** Record the existing critical flows:
  - Search and filter courses
  - Open/close a course outline
  - Build a quote
  - Complete adult enrollment
  - Complete minor enrollment with consent
  - Generate and adjust a schedule
  - Record and verify payments
  - Save/print an enrollment
  - Manage catalogue data
  - Start and close a facility rental
  - Export/import backups
  - Install/open offline copy
- **Acceptance criteria:** Every future change is checked against the applicable flows before completion.

## T-002 — Add a lightweight automated smoke-test script

- **Priority:** P0
- **Effort:** M
- **Risk:** Low
- **Dependencies:** T-001
- **Scope:** Extend the existing Puppeteer setup without changing application architecture.
- **Checks:**
  - Application boots without JavaScript errors
  - Catalogue renders
  - First course opens and closes
  - Search returns results
  - Enrollment modal opens
  - Admin login screen opens
  - Key assets return HTTP 200
- **Acceptance criteria:** One command reports pass/fail for the critical shell of the application.

## T-003 — Record current performance baselines

- **Priority:** P1
- **Effort:** S
- **Risk:** Low
- **Scope:** Track HTML bytes, gzip bytes, embedded-image bytes, CSS size, JavaScript size, and local boot errors.
- **Acceptance criteria:** Future compression work can show an objective before/after result.

---

# Phase 1 — Accessibility foundations

Do these as targeted improvements to existing markup-generation functions. Do not redesign the forms.

## T-101 — Associate labels with form controls

- **Priority:** P0
- **Effort:** L
- **Risk:** Medium
- **Scope:** Add stable IDs and matching `for` attributes to generated enrollment, admin, rental, payment, schedule, and installation forms.
- **Implementation approach:** Update one form area at a time; preserve all current IDs used by JavaScript.
- **Acceptance criteria:**
  - Clicking a visible label focuses its control
  - Every required input has an accessible name
  - Existing event handlers continue to work
  - No duplicate IDs are introduced

## T-102 — Upgrade custom checkbox and radio controls

- **Priority:** P0
- **Effort:** L
- **Risk:** Medium
- **Scope:** Existing `.ck`, payment-plan, consent, agreement, and selection controls.
- **Preferred approach:** Use native `<input type="checkbox">` and `<input type="radio">` where migration is safe. Otherwise add `role`, `tabindex`, `aria-checked`, and keyboard handlers.
- **Acceptance criteria:** Every custom selection can be operated with Tab, Space, and Enter and announces its state correctly.

## T-103 — Implement complete tab semantics

- **Priority:** P0
- **Effort:** M
- **Risk:** Medium
- **Scope:** Enrollment, admin, quote, and legal tabs.
- **Requirements:** `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, `role="tabpanel"`, and arrow-key navigation.
- **Acceptance criteria:** Tabs work with mouse, touch, Tab, and arrow keys without changing their current visual design.

## T-104 — Standardize modal focus management

- **Priority:** P0
- **Effort:** L
- **Risk:** Medium
- **Scope:** Course details, quote, enrollment, admin, install, and rental panels.
- **Requirements:**
  - Store the launch control
  - Move focus into the opened panel
  - Trap focus while open
  - Apply a consistent Escape policy
  - Restore focus on close
- **Acceptance criteria:** Keyboard focus never falls behind an active overlay.

## T-105 — Add accessible live status announcements

- **Priority:** P0
- **Effort:** S
- **Risk:** Low
- **Scope:** Toast messages, validation failures, schedule regeneration, save completion, and payment updates.
- **Acceptance criteria:** Screen readers announce important state changes once without interrupting normal navigation.

## T-106 — Add persistent inline validation

- **Priority:** P0
- **Effort:** L
- **Risk:** Medium
- **Scope:** Enrollment and administrative forms.
- **Requirements:** Keep existing toasts, but add visible field-level errors using `aria-invalid` and `aria-describedby`.
- **Acceptance criteria:** Users can identify and correct every invalid field after a toast disappears.

## T-107 — Run keyboard-only flow verification

- **Priority:** P0
- **Effort:** M
- **Risk:** Low
- **Dependencies:** T-101 through T-106
- **Acceptance criteria:** Search, course review, adult enrollment, minor consent, quote review, and admin entry are completable without a pointer.

---

# Phase 2 — Mobile and responsive ergonomics

## T-201 — Increase touch targets

- **Priority:** P1
- **Effort:** M
- **Risk:** Low
- **Scope:** Close buttons, schedule nudges, remove buttons, icon buttons, chips, and compact table controls.
- **Target:** At least 44×44 CSS pixels, using invisible hit-area expansion where visual size should remain compact.
- **Acceptance criteria:** No essential mobile action requires tapping a target smaller than 44×44 px.

## T-202 — Improve wide tables on mobile

- **Priority:** P1
- **Effort:** L
- **Risk:** Medium
- **Scope:** Schedule, payment, verification, enrollment, and rental tables.
- **Approach:** Apply one of these per table without changing data logic:
  - Responsive stacked cards
  - Controlled horizontal scroll with visible cue
  - Hide secondary columns behind a details row
- **Acceptance criteria:** Primary values remain readable at 320 px without clipped controls.

## T-203 — Make the splash non-blocking for returning users

- **Priority:** P1
- **Effort:** S
- **Risk:** Low
- **Approach:** Keep the existing branded splash on first visit/version, then shorten or skip it on subsequent launches.
- **Acceptance criteria:** Returning users reach the catalogue immediately or within 500 ms.

## T-204 — Add safe-area support

- **Priority:** P1
- **Effort:** S
- **Risk:** Low
- **Scope:** Bottom sheets, sticky actions, installation prompt, and mobile course detail panel.
- **Acceptance criteria:** Controls do not overlap phone notches, home indicators, or browser UI.

## T-205 — Test responsive states systematically

- **Priority:** P1
- **Effort:** M
- **Risk:** Low
- **Viewports:** 320×568, 390×844, 768×1024, 1280×720, 1440×900, 1920×1080, and 2560×1440.
- **Acceptance criteria:** No clipped modal, hidden CTA, unexpected closure, or horizontal page overflow.

---

# Phase 3 — Content clarity and workflow efficiency

## T-301 — Standardize contact terminology

- **Priority:** P1
- **Effort:** S
- **Risk:** Low
- **Decision needed:** Define when the app means emergency contact, parent, legal guardian, or payer.
- **Acceptance criteria:** Each term has one documented meaning and is used consistently in UI and print output.

## T-302 — Shorten instructional copy

- **Priority:** P1
- **Effort:** M
- **Risk:** Low
- **Scope:** Enrollment, scheduling, payment, installation, and rental guidance.
- **Approach:** Keep one concise sentence visible; move policy detail into expandable “Why?” or “More information” sections.
- **Acceptance criteria:** Required actions remain clear while primary screens become easier to scan.

## T-303 — Add explicit enrollment progress

- **Priority:** P1
- **Effort:** S
- **Risk:** Low
- **Scope:** Existing six enrollment tabs.
- **Example:** “Step 3 of 6 — Courses.”
- **Acceptance criteria:** Users always know current position and remaining work.

## T-304 — Clarify final enrollment actions

- **Priority:** P1
- **Effort:** M
- **Risk:** Medium
- **Scope:** Save, finalize, print, trainer email, and copy-summary actions.
- **Approach:** Establish one primary action and group optional follow-up actions after completion.
- **Acceptance criteria:** A first-time user can explain the difference between save and finalize without assistance.

## T-305 — Standardize close and cancel behavior

- **Priority:** P1
- **Effort:** M
- **Risk:** Medium
- **Scope:** All overlays and guarded workflows.
- **Acceptance criteria:** Close button, Escape, backdrop click, and Cancel follow a documented, predictable policy with protection against accidental data loss.

---

# Phase 4 — Animation and visual-system cleanup

## T-401 — Consolidate motion tokens and overrides

- **Priority:** P1
- **Effort:** M
- **Risk:** Medium
- **Scope:** Remove superseded motion declarations only after confirming computed behavior.
- **Important:** Do not redesign animations again. Preserve the currently approved course blur/open/exit/source-fade behavior.
- **Acceptance criteria:** One authoritative token set controls durations and easing; no obsolete keyframe duplicates remain.

## T-402 — Reduce decorative glint frequency

- **Priority:** P1
- **Effort:** S
- **Risk:** Low
- **Approach:** Keep glint on primary actions or first discovery; stop continuous glints on every repeated card/control.
- **Acceptance criteria:** The interface remains premium but feels calmer during extended use.

## T-403 — Verify reduced-motion behavior

- **Priority:** P0
- **Effort:** S
- **Risk:** Low
- **Acceptance criteria:** With reduced motion enabled, no scale, sweep, stagger, or prolonged transition blocks interaction.

## T-404 — Audit non-color state cues

- **Priority:** P1
- **Effort:** M
- **Risk:** Low
- **Scope:** Selected tabs, selected plans, warnings, verification states, required states, and availability.
- **Acceptance criteria:** Every important state has text, shape, icon, or pattern in addition to color.

---

# Phase 5 — Compression and hosted-build performance

Compression should preserve the current standalone/offline capability rather than eliminate it.

## T-501 — Inventory embedded assets by byte size

- **Priority:** P1
- **Effort:** S
- **Risk:** Low
- **Scope:** Inline logos, CPT artwork, QR/image defaults, and icon constants.
- **Acceptance criteria:** A table identifies each embedded asset and its contribution to the 828 KB HTML file.

## T-502 — Remove redundant embedded icon formats

- **Priority:** P1
- **Effort:** M
- **Risk:** Medium
- **Dependencies:** T-501
- **Approach:** Reuse one optimized embedded source at runtime where possible. Keep external PNG/WebP/PWA icons for the hosted build.
- **Acceptance criteria:** Splash, downloaded copy, launcher generation, print output, and PWA icons still work.

## T-503 — Optimize transparent CPT artwork

- **Priority:** P1
- **Effort:** S
- **Risk:** Low
- **Approach:** Preserve PNG transparency where required, but resize and losslessly optimize to the maximum displayed dimensions. Consider WebP only where the requirement does not explicitly demand PNG.
- **Acceptance criteria:** No visible degradation at target display size and a documented byte reduction.

## T-504 — Create hosted and standalone asset modes

- **Priority:** P2
- **Effort:** L
- **Risk:** Medium
- **Approach:**
  - Hosted build: external CSS/JS/images with cacheable files
  - Downloaded copy: existing self-contained serialization
- **Constraint:** Keep one source of truth; do not fork the application manually.
- **Acceptance criteria:** Hosted first load is smaller while “Download app file” remains self-contained and offline.

## T-505 — Minify production CSS and JavaScript

- **Priority:** P2
- **Effort:** M
- **Risk:** Medium
- **Dependencies:** T-401, T-504
- **Acceptance criteria:** Source remains readable; deployment output is minified; no functionality changes.

## T-506 — Automate service-worker cache versioning

- **Priority:** P2
- **Effort:** M
- **Risk:** Low
- **Approach:** Generate the cache name from a content/version hash instead of manual `v13`, `v14`, etc.
- **Acceptance criteria:** A changed deployment invalidates stale assets automatically.

## T-507 — Measure production performance

- **Priority:** P1
- **Effort:** M
- **Risk:** Low
- **Dependencies:** Deployed HTTPS build
- **Checks:** Lighthouse/PageSpeed, LCP, INP, CLS, transfer size, parse/compile time, offline repeat load.
- **Acceptance criteria:** Results are recorded for desktop and mobile before and after compression.

---

# Phase 6 — Data safety and privacy

## T-601 — Document local-data retention

- **Priority:** P0
- **Effort:** M
- **Risk:** Low
- **Scope:** What is stored, retention period, who can access the device, and what clearing browser data does.
- **Acceptance criteria:** Staff can explain where records live and how loss is prevented.

## T-602 — Add backup status and reminders

- **Priority:** P1
- **Effort:** M
- **Risk:** Medium
- **Approach:** Track the most recent export time locally and show a non-blocking reminder when records have changed substantially.
- **Acceptance criteria:** Staff can see whether a recent backup exists without exposing its contents.

## T-603 — Review sensitive-data fields

- **Priority:** P0
- **Effort:** M
- **Risk:** Medium
- **Scope:** Date of birth, guardian/contact details, addresses, receipts, signatures/consents, and payment references.
- **Acceptance criteria:** Each field has a documented operational/legal need and retention rule.

## T-604 — Harden administrative access expectations

- **Priority:** P0
- **Effort:** M
- **Risk:** Medium
- **Scope:** Clarify that a client-side password is a workflow gate, not strong security.
- **Acceptance criteria:** Deployment guidance includes device account security, browser profile controls, and physical access requirements.

---

# Phase 7 — Evidence from real users

## T-701 — Run five moderated usability sessions

- **Priority:** P1
- **Effort:** L
- **Risk:** Low
- **Participants:** Two enrollment staff, one administrator, one trainer, one mobile-first user.
- **Use:** The task script in `UI_UX_AUDIT_REPORT.md`.
- **Acceptance criteria:** Capture completion, time, errors, backtracking, assistance, and confidence without real student data.

## T-702 — Define privacy-safe funnel events

- **Priority:** P2
- **Effort:** M
- **Risk:** Medium
- **Dependencies:** Privacy/governance decision
- **Constraint:** Never capture entered student, guardian, payment, or receipt content.
- **Acceptance criteria:** Every event has a purpose, retention period, and non-sensitive schema.

## T-703 — Prioritize findings from evidence

- **Priority:** P1
- **Effort:** S
- **Risk:** Low
- **Dependencies:** T-701 and/or T-702
- **Acceptance criteria:** The next iteration is based on observed task failures rather than aesthetic preference alone.

---

# Recommended execution order

## Sprint 1 — Safety and accessibility start

1. T-001 Regression checklist
2. T-003 Performance baseline
3. T-101 Label association — begin with enrollment Student and Guardian tabs
4. T-105 Live announcements
5. T-403 Reduced-motion verification

## Sprint 2 — Complete accessible interaction foundations

1. T-101 Remaining labels
2. T-102 Custom selection controls
3. T-103 Tab semantics
4. T-104 Modal focus management
5. T-106 Inline validation
6. T-107 Keyboard verification

## Sprint 3 — Mobile and workflow clarity

1. T-201 Touch targets
2. T-202 Mobile tables
3. T-203 Returning-user splash
4. T-204 Safe areas
5. T-301 Terminology
6. T-303 Enrollment progress
7. T-304 Final actions

## Sprint 4 — Compression without a rewrite

1. T-501 Embedded asset inventory
2. T-502 Redundant icon cleanup
3. T-503 CPT artwork optimization
4. T-401 Motion cleanup
5. T-506 Cache version automation
6. T-507 Production measurement

## Sprint 5 — Evidence and further refinement

1. T-601 through T-604 Data/privacy review
2. T-701 Usability sessions
3. T-703 Evidence-based reprioritization
4. T-504/T-505 Hosted build optimization only if measurements justify it

---

# First task to execute

**T-001 — Create the regression checklist**, followed by **T-003 — capture the performance baseline**. These create a safety net before modifying accessibility markup or compressing embedded assets.

No application source changes are included in this task plan.
