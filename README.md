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
- **Interactive Map** — See visited restaurants on a Leaflet map with color-coded markers and clustering
- **Public Profiles** — Choose a username, get a public profile at `/u/username` with your visits and map
- **Follow System** — Follow other users (asymmetric, no approval needed)
- **People Search** — Find other users by name or username at `/people`, with debounced search and profile links
- **Mobile Tab Bar** — Fixed bottom navigation on mobile with safe-area padding

- **Tag Companions** — Tag users you ate with on a visit, displayed as "@username" profile links on the visit card
- **UserTagPicker** — Reusable debounced search picker for tagging users, with dismissible pills and duplicate/self-tag prevention
- **Place Detail Pages** — Each place has a page (`/place/id`) with its aggregate rating (S-tier counts as 6) and visit count, a "Friends also rated this" feed from people you follow, and your own visits
- **Network Leaderboard** — `/leaderboard` ranks the top-rated places across you and everyone you follow, by average rating then visit count

### Planned
- Bookmarks ("want to try" list)
- Per-visit visibility (public / followers-only / private)

## Tech Stack

- **Frontend**: React 18, Next.js 14, Tailwind CSS, Leaflet
- **Backend**: Next.js server actions, NextAuth 5 (GitHub OAuth)
- **Database**: MongoDB Atlas + Prisma ORM
- **State**: TanStack Query v5
- **Testing**: Playwright (e2e)
- **CI**: GitHub Actions (lint, typecheck, build), Husky pre-commit hooks
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
│   ├── login/         # Login page
│   ├── onboarding/    # Username claim on first login
│   ├── people/        # User search / discovery
│   ├── place/[id]/    # Place detail (aggregate rating, friends' + your visits)
│   ├── leaderboard/   # Top-rated places across your follow network
│   └── u/[username]/  # Public profile page
├── components/        # React components
│   ├── VisitForm.tsx  # Create visit with place autocomplete
│   ├── VisitCard.tsx  # Visit display with edit/delete (readOnly for profiles)
│   ├── VisitMap.tsx   # Leaflet map with markers
│   ├── RatingBadge.tsx # Shared rating badge (colored circle / S-tier star)
│   └── NavLinks.tsx   # Desktop + mobile bottom tab bar navigation
├── hooks/             # React Query hooks
├── lib/               # Utilities
│   ├── prisma.ts      # Prisma client
│   └── auth.config.ts # NextAuth config (shared with middleware)
└── Server/
    ├── actions/       # Server actions
    │   ├── PlaceActions.ts
    │   ├── VisitActions.ts
    │   └── UserActions.ts  # Profile, follow/unfollow
    ├── PlaceService/  # Place service (Prisma)
    ├── VisitService/  # Visit service (Prisma)
    ├── UserService/   # User lookup, username claim
    └── FollowService/ # Follow/unfollow, counts
e2e/
├── global.setup.ts    # Authenticate, seed username + visits with coordinates for test user
├── global.teardown.ts # Clean up test places and visits
└── tests/
    ├── home.spec.ts        # Home page, filters, sorting
    ├── visit-crud.spec.ts  # Create, edit, delete visits
    ├── map.spec.ts         # Map page
    ├── people.spec.ts      # People search, navigation to profile
    ├── place.spec.ts       # Place detail aggregate, leaderboard render + navigation
    └── profile.spec.ts     # Profile page, follow button, read-only cards
```

## License

MIT
