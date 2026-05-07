# Places I Ate 🍽️

A full-stack web application to track and review restaurants you've visited. Log your dining experiences with ratings, reviews, and discover them all on a map.

## Features

### Current (In Development)

- **Multi-user Accounts** — Sign in via Google OAuth, keep your restaurant visits private to your account
- **Restaurant Discovery** — Search and autocomplete restaurant names powered by Google Maps API
- **Visit Logging** — Record each restaurant visit with:
  - **Rating System** — Rate 1-5 stars, or mark as "S-tier" for your absolute favorites
  - **Written Reviews** — Add detailed notes about your experience
  - **Visit Date** — Track when you ate there
- **Visit History** — View all restaurants you've visited in a searchable, scrollable list
- **Interactive Map** — See all your visited restaurants displayed on a map with color-coded markers (S-tier gold, 1-star red, etc.)

### Future (Planned)

- **Social Tagging** — Tag friends in visits to share dining experiences and see their restaurant explorations
- **Multi-user Visits** — Collaborative restaurant logs when dining with others
- **Photo Uploads** — Add photos of dishes or the restaurant ambiance (Phase 2+)
- **Wishlist** — Save restaurants you want to try in the future
- **Advanced Filtering** — Search by rating, review date, rating range

## Tech Stack

- **Frontend**: React 18, Next.js 14, Tailwind CSS
- **Backend**: Next.js API routes, NextAuth 5 (Google OAuth)
- **Database**: MongoDB + Prisma ORM
- **State**: React Query for server-state management
- **Maps**: Leaflet + React Leaflet (OpenStreetMap)
- **APIs**: Google Maps Places API

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account or local MongoDB instance
- Google OAuth credentials (for authentication)
- Google Maps API key (for restaurant search)

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
   DATABASE_URL="mongodb+srv://..."
   
   # Google OAuth (NextAuth)
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=<generated-secret>
   GOOGLE_ID=<your-google-oauth-id>
   GOOGLE_SECRET=<your-google-oauth-secret>
   
   # Google Maps API
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<your-google-maps-api-key>
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
│   ├── login/         # Login page
│   └── restaurants-map/  # Map view (Phase 3)
├── components/        # Reusable React components
│   ├── VisitForm.tsx  # Add/edit visit form
│   └── Map.tsx        # Map display component
├── hooks/             # React hooks
│   ├── use_search_places.ts
│   ├── use_fetch_visited_places.ts
│   └── use_update_place.ts
├── lib/               # Utilities & services
│   ├── prisma.ts      # Prisma client
│   ├── auth.config.ts # NextAuth config
│   └── googleMapsService.ts  # Google Maps integration
└── Server/
    ├── actions/       # Server actions (Next.js)
    │   ├── PlaceActions.ts
    │   ├── VisitActions.ts
    │   └── UserActions.ts
    └── *Service/      # Service layer (business logic)
        ├── PlaceService/
        └── VisitService/
```

## Roadmap

**Phase 1** — Foundation fixes & database schema  
**Phase 2** — Google Maps search + add/edit visits + ratings  
**Phase 3** — Interactive map display + polish

## Contributing

This is currently a personal learning project. Contributions welcome for features, bug fixes, and improvements!

## License

MIT
