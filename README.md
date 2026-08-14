# Career Guidance Program 2026 — Event Registration & Management System

A complete React + Firebase web app for the MBA Department's Career Guidance
Program: public event site, student registration with QR codes, volunteer
QR check-in, materials distribution tracking, and an admin dashboard with
live attendance stats, filters, sponsor management and CSV reports.

## 1. Setup

```bash
npm install
```

### Firebase project

1. Create a project at https://console.firebase.google.com
2. Enable **Firestore Database**, **Authentication → Email/Password**,
   and **Storage**.
3. Copy your web app config into `.env` (see `.env.example`):

   ```bash
   cp .env.example .env
   ```

4. Create at least one admin user in **Authentication → Users**, then
   add a matching document at `admins/{that user's UID}` in Firestore
   (any field, e.g. `{ role: "admin" }`) — this is what the security
   rules check to grant admin access.
5. Deploy the included rules:

   ```bash
   firebase deploy --only firestore:rules
   ```

   (or paste `firestore.rules` into the Firestore console's Rules tab.)

### Run locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

## 2. Editing event details

Everything organizer-facing lives in three files — no need to touch
components:

- `src/config/eventConfig.js` — event name, date, time, venue, Chief
  Guest, contact details, Google Maps URL, participant counts, etc.
- `src/config/colleges.js` — participating colleges list.
- `src/config/sponsors.js` — fallback/seed sponsor list (live sponsors
  are managed from `/admin/sponsors` once Firestore is connected).

## 3. Key routes

| Route | Purpose |
|---|---|
| `/` | Public event homepage |
| `/register` | Student registration form |
| `/registration-success` | Registration ID + QR + printable pass |
| `/check-in` | Volunteer QR scanner + manual search + attendance + materials |
| `/sponsors` | Sponsors display + "Become a Sponsor" enquiry form |
| `/location` | Venue details + location QR code |
| `/admin/login` | Admin sign-in |
| `/admin` | Live dashboard |
| `/admin/attendees` | Search/filter attendees, view details, correct attendance |
| `/admin/registrations` | Full registration list + CSV export |
| `/admin/distribution` | Materials distribution tracker |
| `/admin/sponsors` | Add/edit/delete sponsors, view enquiries |
| `/admin/reports` | College/department breakdowns + CSV export |

## 4. How it works

- **Registration IDs** (`CGP2026-0001`, …) are generated with a
  Firestore transaction on a `counters/{eventId}` document, so
  concurrent submissions never collide.
- **QR codes** encode only `{ eventId, registrationId }` — no personal
  data — and are looked up server-side against Firestore at check-in.
- **Check-in** requires an explicit "Confirm Attendance" tap after the
  QR scan; already-checked-in students show their original check-in
  time instead of being overwritten.
- **Admin dashboard** uses a Firestore `onSnapshot` real-time listener,
  so stats and the attendee table update live with no refresh.
- **Firestore rules** (`firestore.rules`) let anyone create a
  registration or sponsor enquiry, but restrict reading student data,
  editing attendance/materials, and managing sponsors to signed-in
  admins only (see `admins/{uid}` documents).

## 5. Images

Drop these into `public/images/` (referenced from `eventConfig.js` /
`sponsors.js`); the UI degrades gracefully if any are missing:

- `event-logo.png`, `hero-illustration.jpg`, `chief-guest.jpg`
- `sponsors/<name>.png` for each sponsor logo
