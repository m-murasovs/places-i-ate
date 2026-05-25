# Places I Ate — Implementation Plan

## Project Summary
Personal-learning Next.js 14 (App Router) app for logging restaurant visits with GitHub sign-in,
ratings 1-5 + S-tier, free-text reviews, and a map view. Stack: Next 14, React 18, Tailwind,
NextAuth 5 beta (GitHub OAuth), Prisma 5 + MongoDB Atlas, TanStack Query v5, Leaflet.

## Completed

### Phase 0 — Configuration & deps cleanup
- [x] Fixed env var name in README (DATABASE_URL → MONGODB_URI)
- [x] Bumped TanStack Query v4 → v5, fixed all call sites
- [x] Removed `mongodb` driver package

### Phase 1 — Foundational correctness
- [x] Propagated real `User.id` into session (removed broken manual user create, fixed jwt/session callbacks)
- [x] Removed redirect callback that blocked post-login flow
- [x] Created `next-auth.d.ts` type augmentation
- [x] Updated all VisitActions to use `session.user.id` instead of email
- [x] Fixed `useFetchVisitedPlaces` arg order (was limit=pageNumber, offset=10)
- [x] Replaced `IPlace` rendering with real `Visit & Place` shape on home page
- [x] Removed broken PlaceForm / useUpdatePlace (wrote to non-existent Place columns)
- [x] Removed `'/*'` from PROTECTED_ROUTES
- [x] Updated header and metadata to "Places I Ate"

### Phase 1.5 — Dead-code cleanup
- [x] Deleted `src/Server/Service/` (raw Mongo layer)
- [x] Deleted old `PlaceService.ts` and `IPlaceService.ts` (kept PlaceServicePrisma)
- [x] Deleted `UserActions.ts`, `mongodb.ts`, `/upload` stub
- [x] Cleaned `global.d.ts` (removed MongoClient declaration)
- [x] Updated README project structure

### Phase 2 — Visit form
- [x] Created `VisitForm` component with place autocomplete (searches DB as you type)
- [x] Created `createVisitWithPlace` server action (finds-or-creates Place, then creates Visit)
- [x] Seeded 200 Gdynia restaurants from Apify dataset (`scripts/seed-places.ts`)
- [x] Created `useCreateVisit` hook with cache invalidation

### Phase 3 — Polish & integrations
- [x] Visit edit/delete — inline edit rating/review, delete with confirmation (`VisitCard`)
- [x] Rating filter pills (All, 1-5 stars, S-tier) on home page
- [x] Visit count display
- [x] Switched from Google OAuth to GitHub OAuth (free)
- [x] Leaflet map view at `/map` with color-coded markers by rating
- [x] Nav links in header (Visits / Map)

### Phase 4 — Sorting & testing
- [x] Sort visits by date, rating, or place name (sort pills on home page)
- [x] `SortType` threaded through service → actions → hook → UI
- [x] Playwright e2e test suite (11 tests: home page, filters, sort, visit CRUD, map)
- [x] Auth bypass for e2e via conditional CredentialsProvider (guarded by `E2E_TEST=true && NODE_ENV !== 'production'`)
- [x] Test user seed script (`scripts/seed-test-user.ts`)

### Phase 5 — Map polish
- [x] Loading skeletons for map page (pulse placeholders replacing bare "Loading..." text)
- [x] Marker clustering for dense areas (react-leaflet-cluster wrapping leaflet.markercluster)
- [x] Improved popup styling (bold name, colored rating badge, italic review, muted date)
- [x] Headless config for Playwright (HEADLESS env var in playwright.config.ts)

## Remaining / Future

### UX — Step 1: Foundational layout fixes (completed)
- [x] Fix Geist font override — `globals.css` body rule overrides the variable font loaded in layout
- [x] Header mobile layout — responsive padding, scaled brand text, compact nav gaps
- [x] Map height responsive — `h-[calc(100vh-12rem)] sm:h-[600px]` wrapping div
- [x] VisitCard touch targets — 44px min targets on Edit/Delete, redesigned delete confirmation with proper buttons
- [x] Updated e2e tests to match new delete confirmation UI

### UX — Step 2: Visual polish (completed)
- [x] Button component — already had `transition-colors`, `focus-visible:ring`, `disabled:opacity-50` from prior work
- [x] VisitCard hover state — already had `hover:shadow-md transition-shadow` and `p-4`; added `truncate` for long place names
- [x] "Add a visit" button — upgraded to PrimaryButton CTA with `w-full sm:w-auto`
- [x] Dark mode — no half-defined CSS vars existed; globals.css only has clean light-mode vars, no action needed

### UX — Step 3: Interaction improvements (completed)
- [x] Home page skeleton loading — 4 pulsing VisitCard shapes while loading
- [x] Success feedback — inline message after add with 3s auto-dismiss
- [x] Delete confirmation redesign — already had proper `Confirm delete` + `Cancel` button row from Step 1

### UX — Step 4: Form UX
- [ ] Autocomplete dropdown touch sizing — bump to `py-3`, add `active:bg-blue-100`, handle `touchstart` alongside `mousedown`
- [ ] Input focus styles — add `focus:border-blue-500 focus:outline-none` to all inputs/textareas (also an accessibility fix)
- [ ] Test `<input type="date">` on iOS Safari, add pattern fallback if broken

### UX — Step 5: Navigation
- [ ] Active nav link indicator — extract `NavLinks` client component using `usePathname()`, highlight current route
- [ ] Mobile tab bar — render nav links as full-width horizontal tabs below header on small screens, with underline active indicator
- [ ] Pagination for large visit lists

### Social — Phase 6: Profiles & follow graph
- [ ] Add `username` (unique slug) and `bio` fields to `User` model
- [ ] Public profile page (`/u/[username]`) showing user's visits, ratings, and summary map
- [ ] Follow/unfollow (asymmetric, no approval) — `Follow` model (followerId, followingId)
- [ ] Username prompt on first login (slugified from GitHub name as default)

### Social — Phase 7: Place intelligence
- [ ] Place detail page (`/place/[id]`) with aggregate rating (average + count) across all users
- [ ] "Friends also rated this" — show ratings from people you follow on the place page
- [ ] Top-rated places leaderboard filtered to your follow network

### Social — Phase 8: Bookmarks & visit visibility
- [ ] Bookmarks — save a place to a "want to try" list, visible on your profile (`Bookmark` model)
- [ ] Per-visit visibility setting: public / followers-only / private (`visibility` enum on `Visit`, default public)

### Data & integrations
- [ ] Google Places API autocomplete (optional, replaces DB search for worldwide coverage)
- [ ] Allow editing place name/address on manually-created places
- [ ] Re-run seed script to refresh dataset (or schedule via Apify webhook)
- [ ] Photo uploads for visits

### Project infra
- [ ] Set up a CI flow to make sure tests and deploy to Vercel are done automatically.

## Key architectural decisions made

1. **Deleted raw-Mongo layer** — was unused, mistyped, modelled Apify scrape JSON not Prisma schema
2. **User.id (ObjectId) as userId everywhere** — email-as-id was incompatible with `Visit.userId @db.ObjectId`
3. **GitHub OAuth instead of Google** — free, no billing/GCP project needed
4. **Apify dataset for places** — 200 Gdynia restaurants seeded into Place table, used for autocomplete
5. **TanStack Query v5** — aligned devtools/client versions
6. **react-leaflet v4** — v5 requires React 19, project is on React 18
7. **Playwright for e2e** — CredentialsProvider auth bypass, global setup writes session cookies once, all tests reuse stored auth state
