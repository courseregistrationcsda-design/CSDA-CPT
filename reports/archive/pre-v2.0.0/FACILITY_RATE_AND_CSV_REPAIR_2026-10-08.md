# Facility Rate and CSV Repair — 2026-10-08

## Rate display repair

The Shared Service Facility console previously selected the first generic facility catalogue item, which was the ₱4,800 lab-block product. It now explicitly selects `ssf-hourly`, so the visible rate and every newly opened workstation session use **₱80 per hour**, pro-rated by actual minutes.

Historical active and closed sessions retain their recorded rate.

## Office entry

New rental sessions default Office to **CSDA**. Staff may choose **Others**, which reveals a required office/organization field.

## Downloaded rental report

The CSV report now contains exactly five columns, one row per recorded session:

1. user name
2. office
3. purpose
4. booked time
5. billed amount

The obsolete technical ledger columns, date-block headings, and subtotal rows were removed from this operational report.

## Verification

193 checks passed, 0 failed, with the existing browser-runtime warning. The hosted production build completed successfully.
