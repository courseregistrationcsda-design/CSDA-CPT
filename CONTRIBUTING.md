# Contributing

## Principles

- Improve the existing application incrementally; do not rewrite it without an approved architecture decision.
- Preserve pricing, enrollment, schedule, facility, offline, print, and backup behavior.
- Never commit real student, guardian, trainer, payment, receipt, backup, or usability-participant data.
- Use synthetic test data from `usability/SYNTHETIC_TEST_DATA.md`.

## Before submitting a change

```bash
npm ci --ignore-scripts
npm run smoke
npm run build
```

Run `npm run smoke:browser` when Chrome runtime libraries are available.

Update applicable documentation and regenerate performance/inventory reports for payload or asset changes.

## Pull requests

Explain:

1. User problem and requested behavior
2. Files and workflows affected
3. Regression risks
4. Verification performed
5. Privacy or pricing implications

Pricing-policy, consent, retention, and sensitive-data changes require an authorized CSDA reviewer.

## Generated files

Do not edit or commit `release/`. It is generated from `index.html` by `npm run build`. Do not edit service-worker cache names manually; use `npm run version-cache` or the full build.
