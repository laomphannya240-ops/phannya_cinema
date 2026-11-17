# PHANNYA CINEMA

A premium, responsive cinema booking experience built with React, Vite, Tailwind CSS, React Router, Lucide, and Axios. The app runs entirely on in-memory demo data and is prepared for a future Laravel API.

## Quick start

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Other scripts:

```bash
npm run lint   # Oxlint
npm run build  # production build into dist/
npm run preview
```

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Customer | `guest@phannya.demo` | `demo1234` |
| Admin | `admin@phannya.demo` | `demo1234` |

The login page also has one-click demo account buttons. Any email containing `admin` receives the admin role in demo mode.

The session lives in memory only — no tokens or personal data are written to `localStorage`.

## Backend preparation

Copy `.env.example` to `.env` and set the API base URL when a Laravel backend is available:

```env
VITE_API_URL=https://api.example.com
```

With `VITE_API_URL` unset, Axios services fall back to the local demo store in `src/data/store.js`. API calls use an in-memory bearer token holder in `src/services/api.js`.

### Promo code

Use `PHANNYA10` at checkout for 10% off a demo booking.

## What's included

- Public pages: Home, Movies, Movie Details, Showtimes, Seat Selection, Checkout, Confirmation, My Bookings, Promotions, Favorites, Auth, Profile, 404.
- Admin dashboard with stats and CRUD screens for movies, cinemas, halls, seats, showtimes, bookings, users, and promotions.
- Role-based route guards, in-memory booking flow, search/filters/sorting, pagination, CSV export, toasts, notifications, skeletons, and empty states.
- Khmer/English language switching, light/dark themes, and responsive layouts from 375px to 1920px.
- Locally generated SVG movie artwork, so no external image host is required.

Checkout is a **demo only** flow. No real payment is collected or processed.
