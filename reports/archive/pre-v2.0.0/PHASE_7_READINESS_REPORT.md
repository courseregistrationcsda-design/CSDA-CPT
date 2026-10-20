# Phase 7 Readiness Report — Evidence from Real Users

**Status:** Testing infrastructure and privacy-safe counters implemented; five moderated sessions pending  
**Service-worker cache:** `csda-toolkit-d2bf1091a14f`  
**Date:** 2026-10-03

## User decision

The deployment build may keep anonymous workflow counters on the current device. Participants will be available later, so the full facilitator package has been prepared now.

## T-701 — Five moderated usability sessions

The sessions cannot be fabricated or marked complete before they occur. A facilitator-ready package is available under `usability/`:

- `PHASE_7_TEST_PLAN.md` — introduction, six core tasks, role-specific extensions, intervention rule, and debrief
- `SYNTHETIC_TEST_DATA.md` — fictional adult, minor, facility, and payment data
- `SESSION_CHECKLIST.md` — privacy and cleanup checklist
- `OBSERVATION_TEMPLATE.csv` — structured task outcomes and observations
- `FINDINGS_PRIORITIZATION_TEMPLATE.md` — scoring and release-decision framework

Required participants remain:

- Two enrollment staff
- One administrator
- One trainer
- One mobile-first user

Tests must use synthetic data only.

## T-702 — Privacy-safe local funnel events

Implemented aggregate local workflow counters for:

- Search used
- Course opened
- Quote opened
- Enrollment started
- Enrollment reviewed
- Enrollment saved
- Enrollment finalized
- Facility opened
- Facility session started
- Administrator unlocked
- Backup downloaded

Each event stores only:

- Allowlisted event name
- Aggregate count
- Most recent calendar day

The counter container stores its version and creation timestamp. Counters reset after 90 days.

The implementation does not store or transmit:

- Search terms
- Names or initials
- Course, enrollment, workstation, payment, or receipt identifiers
- Dates of birth
- Contact details or addresses
- Typed field values or notes
- Consent/signature data
- Payment data
- Password attempts
- Device fingerprints, IP addresses, or user agents

No network analytics endpoint, third-party analytics script, cookie, or transmission logic was added.

Counters are visible under **Admin → CSV & Backup → Local workflow counters** and can be cleared from there. Their schema and limits are documented in `usability/PRIVACY_SAFE_EVENT_SCHEMA.md`.

Counts are explicitly unsuitable for staff-performance monitoring, legal audit evidence, or determining whether a workflow was completed correctly.

## T-703 — Evidence-based prioritization

The prioritization framework is ready but cannot be populated until session observations exist.

The template scores findings using:

```text
(Frequency × Impact × Confidence) ÷ Effort
```

It also requires release checks for adult enrollment, minor consent, quote understanding, facility operation, backup understanding, and absence of severity-5 failures.

## Verification

```text
55 checks passed
0 failed
1 documented browser-runtime warning
```

New assertions confirm:

- Local workflow counters exist
- Counters use an allowlist
- Counter calls do not pass obvious sensitive-value variables
- JavaScript parses
- Hosted build succeeds
- No duplicate static IDs exist

## Current payload

- Standalone HTML: 565,801 bytes
- Gzip: 229,929 bytes
- Brotli: 203,068 bytes
- Hosted HTML: 325,633 bytes

## What remains

1. Schedule and run the five sessions.
2. Return anonymized observation rows—without participant names or real student data.
3. Calculate task completion, median time, errors, backtracking, assistance, and confidence.
4. Prioritize only repeated, observed failures.
5. Make incremental corrections and rerun applicable regression checks.

There is no subsequent prewritten implementation phase in the current backlog. The next development cycle must be based on Phase 7 evidence rather than guessed aesthetic changes.
