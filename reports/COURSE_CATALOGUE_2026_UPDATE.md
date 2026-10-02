# 2026 Course Catalogue Update

**Source:** `Course List w Trainers - Sheet1.pdf`  
**Catalogue version:** `course-list-2026-10`  
**Status:** Implemented

## Imported catalogue

The active catalogue now contains:

- 20 Regular Courses
- 7 Hero Offerings
- 3 MasterClass programs
- 5 TESDA programs
- 21 Weekend Workshops
- 19 Summer Arts and Animation Workshop 2026 offerings
- 2 existing Shared Service Facility services

That is 75 course/program listings from the uploaded PDF plus 2 facility-service listings, or 77 active items total.

## Categories

The directory now groups listings into:

- Regular Courses — Foundation
- Regular Courses — Concept Art
- Regular Courses — Animation
- Regular Courses — Graphic Design
- Hero Offerings
- MasterClass
- TESDA
- Weekend Workshops — Concept Art
- Weekend Workshops — Dynamic Illustration
- Weekend Workshops — Animation
- Weekend Workshops — Graphic Design
- Weekend Workshops — Pintura
- Summer Workshop 2026 — Creative Kiddos (8–12)
- Summer Workshop 2026 — Teens & Young Adults (13–21)
- Digital Entertainment Exchange

## Course data

Where supplied by the PDF, each listing includes:

- Course code
- Course title
- Tuition fee
- Number of sessions
- Number of hours
- Calculated hours per session
- Assigned trainer or trainer team

Course codes and trainer names are now visible on catalogue cards. Trainer/team assignments also populate the enrollment trainer selector through the existing course-assignment logic.

## MasterClass interpretation

The PDF presents three ₱40,000 MasterClass tracks with component subjects but no separate fee/session/hour values for those components. They were implemented as three program listings:

1. Content Creation MasterClass
2. Japanese Animation / Cutout Animation MasterClass
3. Brands by Collab MasterClass

Their component subjects appear as included titles inside each program rather than as separately priced courses.

## Free class

`FDN103 — Dynamic Illustration` is visible as a ₱0 course and identified as a free class delivered through CSDA YouTube.

## Workshops and discounts

All Weekend and Summer workshop listings are marked as workshop/no-full-payment offerings. Existing pricing policy therefore permits only:

- Group of 3+ students
- Early Bird

Full Payment and Bundle discounts remain unavailable for these listings.

## Existing saved records

The uploaded PDF is authoritative for active sales listings. On first load after the update:

- New catalogue categories, courses, prices, and trainer assignments are installed.
- Old courses referenced by saved enrollment records are retained as hidden archival rows so historical record names remain readable.
- Unreferenced outdated listings are removed from the active data set.
- Existing enrollment, payment, facility, backup, configuration, and activity data is preserved.
- Existing custom trainers are retained in addition to the imported trainer/team assignments.

## Source ambiguities handled

- Blank trainer cells remain unassigned unless the PDF layout clearly implies a merged trainer group.
- PIN101–PIN103 use Eli Ituriaga / Chelsea M.; PIN104–PIN105 use Chelsea M., based on the grouped Pintura trainer layout.
- Missing session/hour values remain blank rather than being invented, except one-session workshops, which are represented as one three-hour workshop for scheduling consistency.
- Trainer email addresses remain blank because the PDF supplies names only.

## Validation

```text
Active items: 77
PDF course/program listings: 75
Facility services: 2
Categories: 15
Trainer/team assignments: 25
Duplicate item IDs: 0
Duplicate course codes: 0
Missing category references: 0
Missing trainer references: 0
```
