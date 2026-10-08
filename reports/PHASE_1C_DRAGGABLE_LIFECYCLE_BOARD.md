# Phase 1C — Draggable Lifecycle Board

**Status:** Implemented and smoke-tested  
**Date:** 2026-10-06  
**Parent commit:** `35bd6f9`

## Compact board

Lifecycle cards now show only the learner name, allowing each column to accommodate more records. Border/background color communicates Scheduled, Ongoing, Almost Done, Done, Dropped, and Cancelled states. Full details remain available by clicking a card or activating it with Enter/Space.

## Timeline movement

Desktop users can drag cards between all four lifecycle columns. Touch and keyboard users receive the equivalent **Move timeline card** selector in the detail dialog.

A move stores a schedule-state override with the current schedule fingerprint, administrator, timestamp, and interaction method. It does not alter finance, academic, trainer, or final Admin gates. Editing session dates/times/hours changes the fingerprint and automatically returns lifecycle tracking to calculated mode. Admin can also explicitly select **Return to automatic**.

## Detail dialog

The detail dialog shows reference, course, schedule, trainer, current timeline source, and enrollment status. It supports Active, Dropped, and Cancelled status changes. Financial history is preserved. Dropped/Cancelled records release their seat marker and become certificate-ineligible; reactivated records are marked for capacity checking pending the course-capacity module.

Done details retain the visible **Certification Clearance Pending** warning.

## Verification

- 75 smoke checks passed
- 0 failed
- Inline JavaScript parses
- Hosted build succeeded
- Cache: `csda-toolkit-d27261ff4d28`
- Source HTML: 622,346 bytes
- Hosted HTML: 363,634 bytes
- Gzip: 239,572 bytes
- Brotli: 210,909 bytes

Browser interaction automation remains unavailable in the sandbox because Chromium lacks a required runtime library.
