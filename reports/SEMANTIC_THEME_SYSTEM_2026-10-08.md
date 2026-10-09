# Semantic Light/Dark Theme System — 2026-10-08

## Header

Get App, Admin, Fullscreen, and Theme are grouped in a dedicated `header-actions` container with automatic left margin and right justification. Branding remains isolated on the left; controls remain together on the right and wrap as one group on narrow screens.

## Theme architecture

The application now defines mode-independent semantic roles for system backgrounds, typography, brand/interactive accents, and status colors. Existing component variables map to these roles so the migration remains incremental and does not alter layout geometry.

Machine-readable token map: `theme-tokens.json`

Implementation guide and component example: `guides/THEME_ARCHITECTURE.md`

Primary button contrast against white text:

- Light `#6D28D9`: 7.10:1
- Dark `#7C3AED`: 5.70:1

Both exceed WCAG AA for normal text.

## Verification

197 checks passed, 0 failed, with the existing browser-runtime warning. The hosted production build completed successfully.
