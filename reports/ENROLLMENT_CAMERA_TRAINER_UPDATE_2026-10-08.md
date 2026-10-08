# Enrollment Camera and Trainer Update — 2026-10-08

## Course-level trainer assignment

- Every selected course immediately displays a trainer selector.
- A course-level trainer becomes the default for that course's generated sessions.
- Generated calendar rows remain editable for session-specific reassignment.
- Course-level assignments are saved in enrollment records, included in full session ZIP backups, and restored with the record.
- Existing equal time-allocation and course-boundary guidance remain available.

## Embedded camera

A reusable in-app camera popup now uses the browser MediaDevices API on supported secure origins. It provides Capture, Retake, Use Photo, and Cancel/close behavior. Camera tracks are stopped when the popup closes.

The embedded camera is available for:

- flagged enrollment payment receipt replacement;
- Admin payment receipt verification uploads;
- Completion Audit refund receipts; and
- student profile photos.

Existing file-upload controls remain as fallbacks. Browser/device permission remains mandatory.

## Student record photo

The Student tab now has a right-side profile-photo panel. Staff may upload a JPG/PNG/WebP image or capture one with the embedded camera. Placement controls include zoom, horizontal positioning, and vertical positioning. On narrow screens, the panel moves below student details.

The photo is saved only in the private student record and complete encrypted backup. Enrollment print/PDF output does not reference or display it. Admin can reopen the full enrollment from the record/Completion Audit workflow to adjust placement later.

## Verification

- 190 focused static, syntax, module, HTTP, MIME, and workflow checks passed.
- Offline DOM simulation confirmed enrollment opens, the student photo panel renders, and the embedded camera opens without startup errors.
- Hosted production build succeeded.
- Real-device validation remains recommended for camera permission prompts, mobile lens selection, and photo framing.
