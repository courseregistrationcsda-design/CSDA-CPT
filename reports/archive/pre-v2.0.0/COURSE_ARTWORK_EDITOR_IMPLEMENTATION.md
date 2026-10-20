# Course Artwork Editor Implementation

**Status:** Implemented and smoke-tested  
**Service-worker cache:** `csda-toolkit-d781fa4d92b0`  
**Date:** 2026-10-03

## Admin workflow

Open **Admin → Courses**, select **Edit**, and use Course Artwork. The editor supports JPG/PNG/WebP upload, drag/pan, directional movement, 1×–3× zoom, 90° rotation, reset, replace, apply, and remove. Applying changes the draft; **Save course** persists it.

## Processing and storage

Apply generates two processed WebP assets:

- `artFull`: the complete uncropped composition, proportionally resized to a maximum 768-pixel edge and adaptively compressed within its storage budget.
- `art`: a 512×288 16:9 crop for compact catalogue and Admin cards, adaptively compressed within a 70,000-character data-URI budget.

The original full-resolution upload is discarded. Only these optimized outputs are retained and included in the existing JSON backup. Zoom and pan determine the compact crop; they do not remove content from the optimized complete image.

Removing artwork deletes `art`, `artFull`, and `artTone` from the draft. Existing records containing only the older crop remain readable, but must be re-uploaded and applied once to recover pixels outside that crop.

## Display and inactive state

Compact public and Admin cards use the responsive 16:9 crop. Focused course details prefer the complete optimized image. Hidden Admin artwork is dimmed/desaturated with an **Inactive** badge and returns to full color on hover or keyboard focus.

## Accessibility

Controls have labels and accessible names; pointer dragging supports mouse, pen, and touch; all transformations are available through visible controls; existing reduced-motion rules remain authoritative.

## Validation

```text
65 checks passed
0 failed
Inline JavaScript parses
No duplicate static IDs
Hosted build succeeds
```

Browser interaction automation remains unavailable because Chromium lacks a required OS runtime library. Complete a manual synthetic upload/edit/save/reopen/remove check after deployment.
