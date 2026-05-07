# Places I Ate

A full-stack web application to track and review restaurants you've visited. Log your dining experiences with ratings and reviews.

## Features

### Current (In Development)

- **Google OAuth** — Sign in via Google, keep your restaurant visits private to your account
- **Visit Logging** — Record each restaurant visit with:
  - **Rating System** — Rate 1-5 stars, or mark as "S-tier" for your absolute favorites
  - **Written Reviews** — Add detailed notes about your experience
  - **Visit Date** — Track when you ate there
- **Visit History** — View all restaurants you've visited in a searchable, scrollable list
- **Place Search** — Search your previously visited places by name

### Planned

- **Interactive Map** — See visited restaurants on a map with color-coded markers (Phase 3)
- **Google Places Autocomplete** — Search any restaurant by name with autocomplete (Phase 3)
- **Visit Edit/Delete** — Modify or remove past visits (Phase 3)
- **Filtering / Sorting** — Search by rating, date, etc. (Phase 3)

## Tech Stack

- **Frontend**: React 18, Next.js 14, Tailwind CSS
- **Backend**: Next.js server actions, NextAuth 5 (Google OAuth)
- **Database**: MongoDB Atlas + Prisma ORM
- **State**: TanStack Query v5

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account or local MongoDB instance
- Google OAuth credentials (for authentication)

### Installation

1. Clone the repo:
   ```bash
   git clone <repo-url>
   cd places-i-ate
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Set up environment variables (`.env.local`):
   ```
   # Database
   MONGODB_URI="mongodb+srv://..."

   # Auth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=<generated-secret>
   GOOGLE_ID=<your-google-oauth-id>
   GOOGLE_SECRET=<your-google-oauth-secret>
   ```

4. Set up the database:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open http://localhost:3000 in your browser

## Project Structure

```
src/
├── app/               # Next.js pages
│   ├── page.tsx       # Home (search + visited list)
│   ├── place.tsx      # Place search results component
│   └── login/         # Login page
├── components/        # Reusable React components
├── hooks/             # React Query hooks
│   ├── use_search_places.ts
│   └── use_fetch_visited_places.ts
├── lib/               # Utilities
│   ├── prisma.ts      # Prisma client
│   └── auth.config.ts # NextAuth config
└── Server/
    ├── actions/       # Server actions
    │   ├── PlaceActions.ts
    │   └── VisitActions.ts
    ├── PlaceService/  # Place service (Prisma)
    └── VisitService/  # Visit service (Prisma)
```

## Roadmap

**Phase 1** (current) — Foundation fixes, auth, visit rendering
**Phase 2** — Visit creation form (free-text place entry)
**Phase 3** — Map view, Google Places API, filtering, edit/delete

## License

MIT
