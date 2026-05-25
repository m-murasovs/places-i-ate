# Places I Ate

A full-stack web application to track and review restaurants you've visited. Log your dining experiences with ratings, reviews, and see them on a map.

## Features

- **GitHub OAuth** — Sign in with GitHub, keep your restaurant visits private to your account
- **Visit Logging** — Record each restaurant visit with:
  - **Rating System** — Rate 1-5 stars, or mark as "S-tier" for your absolute favorites
  - **Written Reviews** — Add detailed notes about your experience
  - **Visit Date** — Track when you ate there
- **Place Autocomplete** — Search from 200+ pre-loaded Gdynia restaurants, or add a new place manually
- **Visit History** — Browse all your visits with rating filter pills (All, 1-5 stars, S-tier), paginated 10 per page
- **Sorting** — Sort visits by date (newest first), rating (highest first), or place name (A-Z)
- **Edit / Delete** — Inline edit rating and review, or delete a visit with confirmation
- **Interactive Map** — See visited restaurants on a Leaflet map with color-coded markers

### Planned

- Better mobile styling
- Public profiles and social features

## Tech Stack

- **Frontend**: React 18, Next.js 14, Tailwind CSS, Leaflet
- **Backend**: Next.js server actions, NextAuth 5 (GitHub OAuth)
- **Database**: MongoDB Atlas + Prisma ORM
- **State**: TanStack Query v5
- **Testing**: Playwright (e2e)
- **Data**: Apify dataset (Gdynia restaurants scraped from Google Maps)

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account or local MongoDB instance
- GitHub OAuth app (free — https://github.com/settings/developers)

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
   MONGODB_URI="mongodb+srv://.../<dbname>?retryWrites=true&w=majority"

   # Auth
   AUTH_SECRET=<generated-secret>
   AUTH_URL=http://localhost:3737
   AUTH_GITHUB_ID=<your-github-oauth-client-id>
   AUTH_GITHUB_SECRET=<your-github-oauth-client-secret>
   ```

4. Set up the database:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. Seed the places dataset:
   ```bash
   npx tsx scripts/seed-places.ts
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open http://localhost:3737 in your browser

## Project Structure

```
src/
├── app/               # Next.js pages
│   ├── page.tsx       # Home (visit form + visit list with filters)
│   ├── map/           # Map view (Leaflet)
│   └── login/         # Login page
├── components/        # React components
│   ├── VisitForm.tsx  # Create visit with place autocomplete
│   ├── VisitCard.tsx  # Visit display with edit/delete
│   └── VisitMap.tsx   # Leaflet map with markers
├── hooks/             # React Query hooks
│   ├── use_fetch_visited_places.ts
│   ├── use_search_places.ts
│   ├── use_create_visit.ts
│   ├── use_update_visit.ts
│   └── use_delete_visit.ts
├── lib/               # Utilities
│   ├── prisma.ts      # Prisma client
│   └── auth.config.ts # NextAuth config
└── Server/
    ├── actions/       # Server actions
    │   ├── PlaceActions.ts
    │   └── VisitActions.ts
    ├── PlaceService/  # Place service (Prisma)
    └── VisitService/  # Visit service (Prisma)
scripts/
├── seed-places.ts     # Import Apify dataset into Place table
└── seed-test-user.ts  # Create e2e test user in database
e2e/
├── global.setup.ts    # Authenticate test user, save session cookies
└── tests/
    ├── home.spec.ts        # Home page, filters, sorting
    ├── visit-crud.spec.ts  # Create, edit, delete visits
    └── map.spec.ts         # Map page
```

## License

MIT
