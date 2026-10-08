# Searchable General Administrative Guidelines Update

**Date:** 7 October 2026  
**Status:** Implemented and statically verified

## Guide Search

Admin → Governance → General Guidelines now begins with a local Guide Search.

It accepts ordinary task descriptions and problem statements rather than requiring exact policy terminology. The matcher normalizes punctuation and selected casual forms, recognizes topic synonyms, accepts word fragments, tolerates small spelling errors, and ranks the closest procedures.

Example questions include:

- I cannot log in
- Why is clearance pending?
- Student paid too much
- Receipt does not match
- Certificate has the wrong name
- How do I find an old record?
- What does not yet competent mean?
- How do I restore a backup?

## Troubleshooting content

Search topics cover:

- Daily Work Queue
- Admin login and credential recovery
- Adult and minor enrollment
- Trainer assignment and Delivery Team
- Payment and receipt verification
- Timeline movement
- Completion Audit blockers
- Competency meaning
- Refund processing
- Certificate correction and revisions
- Backup, Merge, and Replace
- Archive and retention holds
- Record search
- Offline behavior

Every result provides:

1. Plain-language explanation
2. Ordered steps
3. Common problems and solutions
4. Reviewed external resources when relevant and online

## Privacy and online behavior

- Search is processed locally.
- Typed questions are never sent to a web search provider.
- Staff are instructed not to type learner identities, payment references, receipt details, passwords, or recovery keys.
- When online, relevant topics show optional reviewed links to official TESDA, National Privacy Commission, Official Gazette, or Bangko Sentral ng Pilipinas resources.
- When offline, all local procedures and troubleshooting remain available; only external pages are unavailable.

## Printable guide

The printable General Administrative Guidelines now include a dedicated chapter explaining:

- Where Guide Search is located
- Example casual questions
- How language matching works
- How to improve a poor search result
- Search privacy
- Online reference behavior
- Offline availability

## Verification

- 181 smoke checks passed
- 0 failed
- One known browser-runtime warning
- `guide-search.js` parses, loads over HTTP, returns JavaScript MIME type, and is included in offline precache
- Focused checks cover casual wording, common misspellings, local-query privacy, connectivity-aware links, and official Philippine sources
