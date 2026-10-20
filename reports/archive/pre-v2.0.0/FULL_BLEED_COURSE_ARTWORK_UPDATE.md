# Full-Height Focused Course Artwork Update

**Status:** Implemented and smoke-tested  
**Service-worker cache:** `csda-toolkit-d781fa4d92b0`  
**Date:** 2026-10-03

## Focused course panel

A focused course with artwork now opens as a responsive tall/full-height card. It prefers `artFull`, preserving the complete optimized pre-crop image without stretching.

- A contained foreground image displays the entire composition.
- A blurred cover-fill copy adaptively fills unused space around differing aspect ratios.
- Text, details, and controls remain layered above the artwork, with actions anchored toward the card bottom.
- The panel remains viewport-safe and responsive.
- Records without `artFull` fall back safely to their existing `art` crop.
- Courses without artwork retain the existing solid background.

## Automatic contrast

On Apply, perceived luminance is sampled from the complete processed artwork and stored as `artTone`. Light images receive dark text with a light readability treatment; dark images receive white text with a dark treatment. Previously saved artwork without a tone retains its safe fallback.

## Compact contexts

Catalogue and Admin cards continue using the edited 512×288 crop. Inactive Admin cards retain their label/dimming and full-color hover/focus behavior.

## Verification

```text
65 checks passed
0 failed
Hosted build succeeded
Source HTML: 606,854 bytes
Hosted HTML: 349,406 bytes
Gzip: 235,069 bytes
Brotli: 207,102 bytes
```

Smoke checks cover full-image persistence, contained foreground rendering, blurred fill, tall responsive layout, luminance logic, and contrast themes. Browser interaction checks remain skipped in this sandbox because Chromium lacks a required runtime library.
