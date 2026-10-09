# Semantic Theme Architecture

## Principle

Components consume semantic roles such as `--surface-card` and `--text-primary`; they never contain mode-specific color values. Theme switching changes only the token values on `<html data-theme="light|dark">`, so layout, spacing, dimensions, borders, and motion remain unchanged.

The machine-readable source is [`theme-tokens.json`](../theme-tokens.json). The app defines the same tokens in `index.html` and maps older internal aliases to them while components are migrated incrementally.

## Example: “Simple Package” card

```html
<article class="package-card">
  <span class="package-card__badge">Simple Package</span>
  <h3>Everyday transfer</h3>
  <p>Fast payment with transparent fees.</p>
  <button>Choose package</button>
</article>
```

```css
.package-card {
  background: var(--surface-card);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  box-shadow: var(--shs);
  padding: 16px;
  transition: background-color .22s, color .22s, border-color .22s;
}
.package-card p { color: var(--text-secondary); }
.package-card__badge {
  color: var(--warning);
  background: color-mix(in srgb, var(--warning) 12%, transparent);
}
.package-card button {
  background: var(--primary-brand);
  color: var(--text-accent);
}
.package-card:focus-within {
  outline: 3px solid color-mix(in srgb, var(--action-blue) 35%, transparent);
}
```

## Switching

`applyTheme('light')` or `applyTheme('dark')` updates `data-theme`, browser chrome color, and the saved local preference. No component rerender or class replacement is required. Because both modes use identical spacing, typography sizing, and border widths, switching does not cause layout shift.

## Accessibility

- Primary button text is white on `#6D28D9` in light mode and `#7C3AED` in dark mode.
- Body and secondary text have dedicated contrast-safe values rather than opacity-only styling.
- Color is not the sole status signal; labels and icons remain required.
- Focus uses `action-blue`, visually distinct from the purple brand action.
