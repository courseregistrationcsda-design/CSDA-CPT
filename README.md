# CSDA Pricing Toolkit

Course pricing, quotations, bundle builder, payment schedules and student enrollments for
**Cordillera School of Digital Arts, Inc.** (Baguio City).

The whole application is `index.html` — one self-contained file with hand-written CSS,
vanilla JavaScript and every image inlined. No build step, no dependencies, no frameworks,
no network calls. It runs identically from a web server, from a USB stick, or from a laptop
with the Wi-Fi switched off.

---

## Deploy to Vercel

### Option A — from the GitHub UI (no terminal)

1. Create a new repository on GitHub, e.g. `csda-pricing-toolkit`.
2. Upload the **contents** of this folder (not the folder itself) to the repository root.
   `index.html` must sit at the top level.
3. Go to [vercel.com/new](https://vercel.com/new) and import that repository.
4. Framework preset: **Other**. Leave *Build Command* and *Output Directory* empty —
   this is a static site.
5. Press **Deploy**. It takes about twenty seconds.

### Option B — from the command line

```bash
cd csda-toolkit-site
git init
git add .
git commit -m "CSDA Pricing Toolkit"
git branch -M main
git remote add origin https://github.com/<you>/csda-pricing-toolkit.git
git push -u origin main

npx vercel --prod        # or import the repo at vercel.com/new
```

### After the first deploy

Vercel gives you a URL such as `https://csda-pricing-toolkit.vercel.app`.

1. Open `index.html` and replace the placeholder domain in the four social-preview tags
   (`og:url`, `og:image`, `twitter:image`, and `rel="canonical"`) with your real URL, then
   push again. Everything else works untouched — these tags only affect link previews.
2. Open the site in Chrome or Edge and use **⋮ → Cast, save and share → Install page as app**.
   Because the site serves a real manifest over HTTPS, the browser installs it as a proper
   application with the CSDA icon, its own window and its own Start-menu / Dock entry.

---

## What is in this folder

| Path | Purpose |
|---|---|
| `index.html` | **The application.** Edit this file directly; there is nothing to compile. |
| `manifest.webmanifest` | Web-app manifest: name, colours, icons, and two app shortcuts (Enroll, Admin). |
| `sw.js` | Service worker. Network-first for pages, cache-first for icons, so the site works offline. |
| `icons/` | App icons: 192 and 512 in WebP and PNG, a maskable 512, and a 180px Apple touch icon. |
| `favicon.ico` | Multi-resolution favicon (16 → 64). |
| `vercel.json` | Static config: clean URLs, cache headers, correct manifest MIME type, security headers. |
| `.gitignore` | Keeps editor and OS clutter out of the repository. |

Seven items. Nothing else is required to deploy.

> **If you edit the icons**, bump `CACHE` in `sw.js` (e.g. `csda-toolkit-v2`) so returning
> visitors pick up the new files instead of the cached ones.

---

## Using the toolkit

**Feed.** A category directory with live counts on the left, course cards on the right.
Search with `/`; `Esc` closes a panel, then clears the search.

**Quote modal.** Click any course to build a quotation: add courses to a bundle (10% comes
off automatically at three or more), see the rate breakdown, compare every promo side by
side, run the eligibility check, and read each payment plan's schedule with per-stage
amounts and late-interest exposure.

**Enroll.** The *Enroll student* button opens a two-step form: student and guardian details,
course selection with live bundle pricing, a generated class schedule, and a payment plan.
Step two is a printable quotation and enrollment form that saves to PDF and stores a record
inside the app.

**Scheduling.** Sessions run every other day and never on a Sunday. *Regenerate all dates*
asks whether Saturdays should be included. Any date can be typed, picked from the calendar,
or nudged a day at a time with the `‹ ›` buttons.

**Admin.** The gear button; password `csda2026` (change it under *Promos & Discounts →
global rules*). Six tabs: Courses, Categories, Promos & Discounts, Payment Plans,
Enrollments, and CSV & Backup.

**Get app.** Downloads a multi-resolution `.ico` plus a desktop shortcut carrying the CSDA
icon, and fires the browser's own install prompt when one is available.

**Download the app file.** Inside the *Get app* panel. The page writes a standalone copy of
itself — every asset inlined, server-only tags stripped — so it keeps working from a folder
or a USB stick with no internet at all.

---

## Data and privacy

Everything lives in the browser's `localStorage` on the machine where it was entered.
Nothing is uploaded; there is no server, database or analytics of any kind. Student records
therefore stay on the device that captured them.

Two consequences worth planning around:

* Clearing site data wipes the catalogue edits and saved enrollments.
* Another computer starts from the built-in defaults.

Use **Admin → CSV & Backup → Export JSON** to take a snapshot, and **Import JSON** to restore
it or move it to another machine. The catalogue can also be round-tripped as CSV so a trainer
can edit it in a spreadsheet offline.

---

## Notes and limits

* **Storage can be blocked.** In a sandboxed iframe `localStorage` throws; the app falls back
  to in-memory storage so it still runs, but changes are lost on reload. That is why Export /
  Import exists.
* **A saved `.html` cannot choose its own icon.** Windows and macOS assign icons by file type.
  The *Get app* launcher works around this by giving you a shortcut file, which *can* name its
  own icon — keep the `.ico` and the shortcut in the same folder. On macOS a `.webloc` still
  needs the icon dragged in through *Get Info*; use *Add to Dock* instead if that matters.
* **The downloaded single-file copy has no service worker.** Browsers refuse to register one
  from a `file://` page. It needs no network anyway — every asset is already inside it.

---

## Source figures

Pricing, contact hours and page citations come from the official CSDA pricing document and
the Homeschool TLE proposal. Category headers carry their source page, and any course whose
effective hourly rate drifts from its category baseline is flagged in the card and in the
quote.
