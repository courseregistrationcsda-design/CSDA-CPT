# New Input Intake — Version 2.x

Use this file as the staging point for future requests. Keep each request small enough to implement and verify independently.

## Input template

### Title

Short name for the requested change.

### User problem

What is difficult, incorrect, missing, or risky today?

### Requested behavior

Describe what the user should see and be able to do.

### Location

Identify the screen, workflow, record, report, or output involved.

### Data impact

- New fields or files:
- Existing records affected:
- Backup/restore impact:
- Migration needed:
- Privacy or security impact:

### Acceptance checks

1. Observable result.
2. Error/edge-case behavior.
3. Mobile/responsive behavior.
4. Offline behavior, when applicable.
5. Required report/documentation update.

### Decision needed

List any wording, workflow, or policy choice that must be confirmed before implementation.

## Intake rules

- One behavioral change per implementation checkpoint when practical.
- Preserve existing records and approved workflows unless the request explicitly replaces them.
- Update General Administrative Guidelines when an administrative workflow changes.
- Add a focused regression check before marking the input complete.
- Run the full smoke suite and production build after each completed input.
- Never use real learner or payment data in development fixtures.

## Queue

No pending inputs. Version 2.0.0 is the current clean baseline.
