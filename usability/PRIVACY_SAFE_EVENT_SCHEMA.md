# Privacy-Safe Local Workflow Counter Schema

## Decision

Approved for deployment: aggregate workflow counters stored only in the current browser profile. No network transmission is implemented.

## Allowed data

Each allowlisted event stores only:

- Event name
- Aggregate count
- Most recent calendar day

The counter container stores a schema version and creation timestamp. It resets after 90 days.

## Allowlisted events

- `search_used`
- `course_opened`
- `quote_opened`
- `enrollment_started`
- `enrollment_reviewed`
- `enrollment_saved`
- `enrollment_finalized`
- `facility_opened`
- `facility_session_started`
- `admin_unlocked`
- `backup_downloaded`

## Prohibited data

Never store in usage counters:

- Names or initials
- Search text
- Course, record, workstation, or payment identifiers
- Dates of birth
- Contact details or addresses
- Notes or typed field values
- Consent selections or signatures
- Payment amounts, references, methods, or receipt content
- Password attempts
- Trainer identity
- Device fingerprint, IP address, user agent, or precise time sequence

## Access and controls

Counters are visible under Admin → CSV & Backup → Local workflow counters. Staff can clear them using “Clear local counters.” Clearing site data also removes them.

## Interpretation limits

Counts indicate that a workflow point was reached, not whether the task succeeded, whether data was correct, or who performed it. They must not be used for staff performance monitoring or legal audit evidence.
