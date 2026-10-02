# Phase 2 Implementation Report — Mobile and Responsive Ergonomics

**Status:** Implementation complete; automated static/HTTP verification passed  
**Service-worker cache:** `csda-toolkit-v20`  
**Date:** 2026-10-02

## Requested Shared Service Facility update

The facility window now uses a responsive contextual split layout.

### Desktop and wide tablet behavior

When a free workstation is selected:

- The facility modal uses the existing wide-dialog format.
- The workstation area animates into the left column.
- The “Start a session” form enters from the right.
- Both areas remain visible, allowing the attendant to keep floor context while entering the booking.
- Existing rental form IDs, start-session logic, equipment selection, billing, timers, and session records are unchanged.

### Narrow-screen behavior

At widths below 820 px, the interface returns to a single-column flow. The workstation area and session form use restrained vertical entrance motion so fields remain readable and are not squeezed into impractical columns.

### Motion accessibility

The existing authoritative `prefers-reduced-motion` rule also covers the new facility motion, reducing it to effectively instant state changes for users who request less motion.

## T-201 — Touch targets

Important compact actions on touch devices now receive at least a 44×44 CSS-pixel target, including:

- Close buttons
- Icon controls
- Schedule-day controls
- Compact action buttons
- Remove buttons
- Selection chips
- Course-detail return button

Desktop density remains unchanged.

## T-202 — Mobile tables

Dense operational tables are now placed into their own focusable horizontal-scroll regions at narrow widths.

Improvements include:

- No page-level widening from supported operational tables
- Retained readable minimum column widths
- Touch momentum scrolling
- Overscroll containment
- A visible “Swipe to see more →” cue
- A subtle right-edge continuation cue
- A keyboard-focusable region announced as “Scrollable table”

This applies dynamically to schedule, payment, enrollment, verification, and rental-style data tables using their existing table classes.

## T-203 — Returning-user splash

- First launch/version retains the required three-second branded splash.
- Returning users receive a 250 ms continuity frame.
- The splash preference is local to the browser and does not affect application data.

## T-204 — Safe-area support

Added safe-area insets for:

- Modal headers and bodies
- Mobile course-detail panels
- Installation prompt
- Bottom controls near phone home indicators

## T-205 — Responsive states

The optional browser smoke suite now includes the full required viewport matrix:

- 320×568
- 390×844
- 768×1024
- 1280×720
- 1440×900
- 1920×1080
- 2560×1440

For each viewport it checks:

- No document-level horizontal overflow
- Catalogue visibility
- Primary enrollment action visibility

The responsive assertions are ready in `npm run smoke:browser`. The current sandbox cannot launch Chromium because `libnspr4.so` is unavailable and OS package installation is not permitted. Static checks, JavaScript parsing, HTTP checks, and responsive implementation checks pass here.

## Verification

```text
44 checks passed
0 failed
1 documented browser-runtime warning
```

New smoke assertions specifically confirm:

- Facility split-panel motion is present
- Mobile table scrolling cue is present
- Inline JavaScript parses
- No duplicate static IDs exist
- Core assets continue to return valid responses and MIME types

## Performance snapshot

- HTML: 843,071 bytes
- Gzip: 441,612 bytes
- Brotli: 415,148 bytes

## Regression assessment

Preserved without architectural changes:

- Workstation availability/busy state
- Session start and cancel actions
- Equipment release selections
- Session timers and alarms
- Session editing
- Session close and billing
- Rental records
- Enrollment, pricing, catalogue, admin, and installation workflows

## Next phase

Phase 3 — Content Clarity and Workflow Efficiency.

The contact-terminology decision required by T-301 has already been made and partially applied:

- “Emergency contact” is the normal contact for every enrollment.
- “Parent/legal guardian” is used for a minor’s legal consent.

Next work should complete T-301 across UI and print output, then continue with instructional-copy reduction, explicit enrollment progress, guided schedule setup, payment-status explanations, and clearer destructive-action language.
