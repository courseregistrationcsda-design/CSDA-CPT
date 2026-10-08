# Session ZIP Restore Update — 2026-10-08

## Simplified restore

The complete-session restore control is now named **Import Session ZIP**. The obsolete pasted-catalogue restore area was removed from Restore & Reset.

The operator enters the backup password and selects a CSDA ZIP. The app then automatically:

1. extracts the ZIP;
2. validates the manifest hashes and required relationships;
3. reads the encrypted complete-session payload;
4. authenticates and decrypts it;
5. adapts recognized content through current migrations;
6. previews enrollment, catalogue, trainer, promotion, facility, configuration, audit, and media content; and
7. offers the guarded **Replace** or **Merge** choice.

Merge retains local content, keeps the newest matching records, and combines histories. Replace deliberately substitutes the current session while preserving the receiving installation's Administrator credential.

## Restore recommendation after guarded removal

After the mandatory pre-removal backup succeeds and local data is cleared, the app stores a minimal restore-recommended marker. If that marker survives or the app is re-opened on the same origin, Import Session ZIP prominently recommends restoring the retained backup. A completed Replace or Merge clears the marker.

Browser security prevents the app from silently reopening a previously downloaded file. The operator must select the retained ZIP and enter its password.

## Reset

Reset is now clearly limited to catalogue defaults and explicitly preserves enrollments. Complete-session recovery uses Import Session ZIP only.

## Verification

- 187 focused checks passed, 0 failed, with the existing browser-runtime warning.
- Production hosted build succeeded.
- The packaged PDF guidelines were updated and included in the hosted output.
