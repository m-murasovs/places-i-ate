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

### UX — Step 4: Form UX (completed)
- [x] Autocomplete dropdown touch handling — added `touchstart` event listener alongside `mousedown` for mobile dismiss
- [x] Input focus styles — all inputs already have `focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400`
- [x] Date input iOS Safari — `<input type="date">` works on iOS Safari; added `pattern` attribute as safety net

### UX — Step 5: Navigation (completed)
- [x] Active nav link indicator — extract `NavLinks` client component using `usePathname()`, highlight current route
- [x] Mobile tab bar — fixed bottom tab bar on small screens with active rose indicator, safe-area padding for notched devices
- [x] Pagination for large visit lists — 10 visits per page with prev/next controls, resets on filter/sort change

### Social — Phase 6: Profiles & follow graph (completed)
- [x] Add `username` (unique slug) and `bio` fields to `User` model + `Follow` model with unique constraint
- [x] Username onboarding flow — middleware redirects to `/onboarding` if no username, form claims slug
- [x] Public profile page (`/u/[username]`) showing avatar, bio, follower/following counts, visits map, and visit list
- [x] Follow/unfollow button (asymmetric, no approval) with optimistic UI
- [x] Profile link in nav (desktop header + mobile tab bar)
- [x] `readOnly` prop on VisitCard for profile view (hides edit/delete)
- [x] Session augmentation — `username` propagated through JWT/session to middleware + client
- [x] E2e tests for profile page (4 new tests), global setup seeds username for test user

### Bug fix — Map markers not rendering on first load (completed)
- [x] Root cause: `react-leaflet-cluster@4.1.3` required React 19 / react-leaflet 5, silently failed on React 18
- [x] Downgraded to `react-leaflet-cluster@2.1.0` (matches React 18 + react-leaflet 4 peer deps)
- [x] Fixed map container timing — `MapReady` component waits for real CSS dimensions before `invalidateSize`
- [x] Added `limit` to TanStack Query key to prevent home/map cache collision
- [x] E2E setup seeds 2 visits with real coordinates (Riga + Vienna), map tests assert markers on first load
- [x] Fixed Playwright teardown ordering (`teardown` property on chromium project)

### Social — Phase 7: User discovery (completed)

#### Step 7.1 — User search backend
- [x] `UserService.searchUsers(query, limit)` — case-insensitive search on `username` and `name`, exclude users without username, return `PublicUser[]`
- [x] `searchUsers` server action in `UserActions.ts` — min 2-char query, returns up to 10 results, no auth required

#### Step 7.2 — User search hook + page
- [x] `useSearchUsers` hook (`src/hooks/useSearchUsers.ts`) — TanStack Query, enabled when query >= 2 chars
- [x] `/people` page — search input, result list with avatar + name + @username + bio, links to `/u/[username]`
- [x] Add "People" to `NavLinks` (between Map and Profile) + mobile tab bar
- [x] Add `/people` to `PROTECTED_ROUTES`

#### Step 7.3 — E2E tests
- [x] `e2e/tests/people.spec.ts` — renders search input, finds test user, navigates to profile, short query shows no results

### Social — Phase 8: Tag users in visits (completed)

#### Step 8.1 — Resolve tagged users for display
- [x] `TaggedUser` type (`Pick<User, 'id' | 'username' | 'name' | 'image'>`) and `VisitWithPlaceAndTags` type in `VisitService.ts`
- [x] Batch `resolveTaggedUsers` helper — collect all unique IDs from a page of visits, single `findMany`, map back (avoids N+1)
- [x] `getUserVisits` and `getVisitsByRating` return `VisitWithPlaceAndTags[]`

#### Step 8.2 — Wire tagging through actions
- [x] `createVisitWithPlace` forwards `visitedWithUserIds` to `visitService.createVisit` (currently omitted)
- [x] `updateVisit` already accepts `visitedWithUserIds` — no change needed

#### Step 8.3 — UserTagPicker component
- [x] `src/components/UserTagPicker.tsx` — text input with debounced search (reuses `useSearchUsers`), dropdown results, selected users as dismissible pills (avatar + @username), prevents duplicates and self-tagging

#### Step 8.4 — VisitForm + VisitCard integration
- [x] VisitForm: add `UserTagPicker` before submit, pass `visitedWithUserIds` in mutation, reset on success
- [x] VisitCard view mode: "With: @username, @username" line with links to `/u/[username]`
- [x] VisitCard edit mode: `UserTagPicker` initialized with existing tags, updates on save
- [x] Propagate `VisitWithPlaceAndTags` type to all call sites (`page.tsx`, `u/[username]/page.tsx`)

#### Step 8.5 — E2E tests
- [x] Extend `visit-crud.spec.ts`: tag a user when creating, verify "With:" display, tagged link navigates to profile, remove tag in edit mode

### Social — Phase 9: Place intelligence
- [ ] Place detail page (`/place/[id]`) with aggregate rating (average + count) across all users
- [ ] "Friends also rated this" — show ratings from people you follow on the place page
- [ ] Top-rated places leaderboard filtered to your follow network

### Social — Phase 10: Bookmarks & visit visibility
- [ ] Bookmarks — save a place to a "want to try" list, visible on your profile (`Bookmark` model)
- [ ] Per-visit visibility setting: public / followers-only / private (`visibility` enum on `Visit`, default public)

### UX — Landing / logged-out view (completed)
- [x] Modern landing page for unauthenticated users — hero section with tagline, mock visit cards preview, and prominent "Sign in with GitHub" CTA with GitHub icon
- [x] Brief feature highlights (log visits, rate restaurants, map view, follow friends) as a 2x2/4-col icon grid with SVG icons
- [x] Social proof / stats section — live visit count from database, conditional render
- [x] Responsive layout — full-width hero on mobile (mock cards hidden), split layout on desktop

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
6. **react-leaflet v4 + cluster v2.1.0** — v5/v4.1.3 require React 19, project is on React 18. Upgrade to React 19 + Next.js 15 is a future task
7. **Playwright for e2e** — CredentialsProvider auth bypass, global setup writes session cookies once, all tests reuse stored auth state
8. **Visit tagging via `visitedWithUserIds String[]`** — no schema change needed, field already exists. Resolved to `TaggedUser` objects at the service layer with batched lookup (one `findMany` per page of visits). `UserTagPicker` is a shared component used by both VisitForm and VisitCard edit mode
