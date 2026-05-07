# Places I Ate — Implementation Plan

## Project Summary
Personal-learning Next.js 14 (App Router) app for logging restaurant visits with Google sign-in,
ratings 1-5 + S-tier, free-text reviews, and (later) a map view. Stack: Next 14, React 18,
Tailwind, NextAuth 5 beta, Prisma 5 + MongoDB Atlas, TanStack Query v4.
The codebase is mid-migration: the active write path uses Prisma server actions, but a parallel
raw-mongodb-driver `Repository<T>` layer with an Apify-scrape-shaped `IPlace` is still on disk
and the home page is wired to that old shape, so visits do not currently render.

## Architectural decisions (recommendations)

1. **Delete the raw-Mongo / `Repository<T>` / Apify-shaped `IPlace` layer entirely.**
   Files: `src/Server/PlaceService/`, `src/Server/Service/`, `src/Server/actions/UserActions.ts`,
   `src/lib/mongodb.ts`, `mongodb` package in `package.json`, `_mongoClientPromise` in `global.d.ts`.
   Trade-off: Loses the half-finished generic repo abstraction, but it has no live caller and was
   modelling Apify scrape JSON, not the new Prisma schema. Keeping it adds friction to every fix.

2. **Propagate the real Prisma `User.id` (ObjectId hex string) into the session and use it as
   `userId` everywhere — drop the email-as-id shortcut.** This fixes Issue 3 cleanly and unblocks
   visit writes. Trade-off vs. "just keep email": email-as-id collides with `Visit.userId @db.ObjectId`
   at the Prisma layer, so the shortcut isn't actually shorter — it's broken.

3. **Skip Google Places API for round 1; do free-text place entry instead.**
   Recommendation: Phase 2 ships with a "create visit" form that takes a free-text restaurant name
   + address (and optional lat/lng) and creates a `Place` row on first use. This unblocks the core
   loop without needing a billed Google Cloud project. Wire the real Places Autocomplete API in a
   later phase if the user wants it. Trade-off: no autocomplete polish day one, but no API key, no
   billing setup, no quota worries, and the schema (`googlePlacesId`, `latitude`, `longitude`) still
   fits — `googlePlacesId` becomes a synthetic id (e.g. slug + address hash) until Places is wired.

4. **Align TanStack Query on v5 (bump `@tanstack/react-query` to v5) rather than downgrade devtools.**
   Migration cost: `useQuery({ queryKey, queryFn })` already matches v5's required object form;
   `useMutation` needs a small refactor (`isLoading` → `isPending`); `invalidateQueries(['key'])` →
   `invalidateQueries({ queryKey: ['key'] })`. Trade-off: 30 min of churn vs. shipping a known-broken
   devtools/client mismatch.

5. **Defer the map (Leaflet + `/restaurants-map`) to Phase 3.** Don't try to ship it the same round
   as the visit form — a working create/list/edit flow is more valuable than a half-wired map.

## Phases (ordered by dependency / risk)

### Phase 0 — Configuration & deps cleanup (low risk, immediate)
Goals: stop the README/code drift, align the TanStack versions, remove dead deps once we delete
the Mongo layer (do this in Phase 1 cleanup, not here).

- **0.1 Fix the env var name in README.** README says `DATABASE_URL`; Prisma + (now-doomed)
  `lib/mongodb.ts` both read `MONGODB_URI`. Update README's "Set up environment variables" block
  to `MONGODB_URI`. *Why:* people copy-paste from README; current instructions silently break
  Prisma client startup.
- **0.2 Bump `@tanstack/react-query` to ^5.x to match devtools.** Update `package.json`. Adjust
  call sites:
  - `src/hooks/use_update_place.ts`: `useMutation((args) => ...)` → `useMutation({ mutationFn })`.
  - `src/app/place.tsx`: `isLoading` (mutation) → `isPending`.
  - `src/app/react_query_provider.tsx`: `queryClient.invalidateQueries(queryKeys)` →
    `queryClient.invalidateQueries({ queryKey: queryKeys })`.
  *Why:* devtools v5 attached to a v4 client is undefined behavior.

### Phase 1 — Foundational correctness (do before any feature work)
Goals: make the existing UI not lie, make the user identity end-to-end consistent, make
"submit a visit" possible at all.

- **1.1 Propagate the real `User.id` into session and stop using email as userId.**
  - File: `src/auth.ts`
    - In `jwt({ token, user })`, after the `findUnique`, set `token.id = dbUser.id` (and trust the
      PrismaAdapter to do the actual insert — remove the manual `prisma.user.create` block which
      passes a 16-byte hex into `_id @db.ObjectId` and will throw at runtime).
    - In `session({ session, token })`, set `session.user.id = token.id as string` instead of
      spreading `token` onto `session` (which puts the id in the wrong place).
    - Remove `import crypto from 'crypto'` once the manual create is gone.
    - Remove the unconditional `redirect() { return '/login' }` callback — leave default behavior.
      Currently this hard-redirects every Auth.js navigation back to /login, including post-login.
  - File: `src/Server/actions/VisitActions.ts`
    - Replace every `session.user.email` ownership check / write with `session.user.id`.
    - Be careful: also update the auth-guard early returns to check `session?.user?.id`.
  - File: `next-auth.d.ts` *(new)*
    - Augment `Session["user"]` to include `id: string` so callers don't need `@ts-expect-error`.
  *Why:* `Visit.userId @db.ObjectId` rejects email strings; the entire create-visit path is dead
  until this is fixed.

- **1.2 Fix `useFetchVisitedPlaces` arg order at the call site (or change the signature).**
  - File: `src/app/page.tsx:25`
    - Pick one. Recommended: change call to `useFetchVisitedPlaces(10, (pageNumber - 1) * 10)`
      (limit, offset). Don't change the hook signature — the limit-first form matches
      `fetchUserVisits(limit, offset)` and the action signature.
  *Why:* current call returns 1 row at offset 10.

- **1.3 Render the actual Visit shape on the home page.**
  - File: `src/app/page.tsx`
    - `useFetchVisitedPlaces` returns `{ visits, count }`. Destructure `data?.visits`. Type the
      mapped element as `Visit & { place: Place }`.
    - Replace the `IPlace` field references with the real ones:
      - `place.title` → `visit.place.name`
      - `place.imageUrl` → drop (no image on `Place`); use a placeholder
      - `place.reviewStars` → `visit.rating` (string, includes 'S')
      - `place.reviewText` → `visit.review`
      - `key={place.title}` → `key={visit.id}`
    - Remove the `IPlace` import.
  *Why:* visited list currently never renders correctly because the data shape doesn't match.

- **1.4 Fix or remove the broken "edit review on Place" form.**
  Two paths — pick one:
  - **(a) Remove for now (recommended).** Delete the `PlaceForm` block from `src/app/place.tsx`
    and `src/hooks/use_update_place.ts` and `updatePlace` from `PlaceActions.ts`. The "edit"
    UX belongs on a `Visit`, not a `Place`, and we'll build it properly in Phase 2 alongside the
    new visit form. `FoundPlaces` keeps its read-only render.
  - **(b) Keep edit but redirect it to `Visit`.** Replace `useUpdatePlace` with `useUpdateVisit`,
    point the form at `updateVisit({ visitId, rating, review })`. More work, blocks on having a
    visit row to edit (which we don't yet — the `searchPlaces` results are `Place`s, not `Visit`s).
  *Why:* the current form writes `reviewStars`/`reviewText` to `Place`, which has no such columns;
  Prisma will throw and "edit review" has never worked since the migration.

- **1.5 Tidy `routes.ts` and middleware.**
  - File: `src/routes.ts`
    - Remove the `'/*'` literal from `PROTECTED_ROUTES`. `'/' ` already matches everything via
      `startsWith` (since every path starts with `/`).
  - File: `src/middleware.ts`
    - Optional: tighten the matcher or invert the logic to "everything except AUTH_ROUTES is
      protected" — current behavior happens to be correct because of how `startsWith('/')` works,
      but it reads as accidentally-correct.
  *Why:* clarity. No runtime change.

### Phase 1.5 — Dead-code cleanup (do once Phase 1 lands)
Tied to architectural decision #1. Touch this all in one PR so the diff is reviewable.

- **1.5.1 Delete the raw-Mongo layer.**
  - Delete: `src/Server/PlaceService/PlaceService.ts`, `src/Server/PlaceService/IPlaceService.ts`,
    `src/Server/Service/` (whole tree), `src/Server/actions/UserActions.ts`, `src/lib/mongodb.ts`.
  - Rename `src/Server/PlaceService/PlaceServicePrisma.ts` to a saner home, e.g.
    `src/Server/services/placeService.ts`. Update the lone import in `PlaceActions.ts`.
  - File: `package.json` — remove `"mongodb": "^6.10.0"`.
  - File: `global.d.ts` — remove `_mongoClientPromise` declaration and the `mongodb` import.
- **1.5.2 Delete `/upload`.** `src/app/upload/page.jsx` is a fully commented-out stub. Either gut
  the directory or leave it for a future seed-data tool. Recommendation: delete now; it's dead
  weight and there's no roadmap item that needs it.
- **1.5.3 Update README.md "Project Structure" section.** Drop `VisitForm.tsx` / `Map.tsx` /
  `restaurants-map/` until they actually exist; mark them as Phase 2/3 instead.

*Why:* deletion before feature work means new code doesn't accidentally consume the dead types
(e.g. someone re-imports `IPlace` from `Service/PlaceService` and we're back where we started).

### Phase 2 — Visit form (the actual product)
Goals: a user can pick a place (free-text first, Google later), enter rating + review + date,
hit submit, see it on the home page.

- **2.1 `src/components/VisitForm.tsx`** — controlled form with:
  - `placeName` (text), `address` (text), optional `latitude`/`longitude` (number)
  - `rating` (radio group `1`/`2`/`3`/`4`/`5`/`S`)
  - `review` (textarea, optional)
  - `visitDate` (date input, default today)
- **2.2 New server action `createVisitWithPlace`** in `VisitActions.ts`:
  1. Look up `Place` by a synthetic `googlePlacesId` (e.g. slugify(name) + '-' + hash(address));
     create if missing.
  2. Insert `Visit` with the resolved `placeId`, the session `user.id`, and form fields.
  Be careful with `@@unique([userId, placeId, visitDate])` — same user + same place + same calendar
  date will throw; surface a friendly error.
- **2.3 Hook + integration.** `useCreateVisit` mutation; on success invalidate
  `['fetchVisitedPlaces']`. Mount the form in `page.tsx` (replace the search section, or sit
  alongside it).
- **2.4 Search refactor.** `searchPlaces` currently does a substring search over the local `Place`
  table — fine as a "have you visited this before?" lookup, but rename so the UX is clear (e.g.
  "your previously visited places matching X"). Don't pretend it's a global restaurant search.

### Phase 3 — Polish & optional integrations
Defer until Phase 2 is solid.

- **3.1 Google Places API integration** *(optional, gated on user's appetite for billing setup).*
  - New `src/lib/googleMapsService.ts` (server only, key from `GOOGLE_PLACES_API_KEY`).
  - Replace the free-text fields in `VisitForm` with an autocomplete-backed picker.
  - Populate `googlePlacesId`/`latitude`/`longitude` from the Places result.
- **3.2 Map view** (`/restaurants-map`).
  - Add `leaflet` + `react-leaflet`.
  - Server component pulls the user's visits with place coords; client component renders markers
    color-coded by rating (S = gold, 5 = green, 1 = red, etc.).
- **3.3 Filtering / sorting.** `getVisitsByRating` already exists in the service; expose via UI.
- **3.4 Visit edit/delete** in the home list (now that there's a stable visit shape and the user
  identity flow works).

## Latent bugs found during plan verification

- **`auth.ts` manual `prisma.user.create` is broken.** It passes
  `_id: crypto.randomBytes(16).toString('hex')` into `User.id @db.ObjectId`. A 16-byte hex isn't
  a valid ObjectId on insert and Prisma rejects it. This branch only fires if a Google sign-in
  happens for a user the PrismaAdapter hasn't already inserted (which the adapter normally handles
  itself). Removed in Phase 1.1.
- **`session({ session, token })` puts user id in the wrong place.**
  `session = { ...session, ...token }` spreads token fields onto the outer session object, not
  `session.user`. So even after we put `id` into the token, callers reading `session.user.id` see
  undefined. Fixed in Phase 1.1.
- **Header copy mismatch.** `layout.tsx` shows "Places we ate" while `metadata.title` is
  "Munch Gdynia". Pick one (open question 6).

## Open questions for the user

1. **Google Places API: in scope or skip?** Phase 2 works fine without it. Do you want to set up a
   GCP project + billing + API key for autocomplete in this round, or punt to Phase 3?
2. **Map: same question.** Adds two npm deps and a non-trivial component. OK to defer to Phase 3?
3. **Decision #1 (delete the raw-Mongo layer): are you attached to keeping the generic
   `Repository<T>` abstraction?** I'm recommending we delete it because it's unused, mistyped, and
   modelled the wrong domain — but it's your code, so confirm before I rip it out.
4. **TanStack Query: bump to v5 or downgrade devtools to v4?** Recommendation: bump to v5. Either
   way we should pick.
5. **`/upload` stub: delete, or leave the empty page in place for a future seed/import tool?**
6. **Header copy.** `layout.tsx` says "Places we ate" and `metadata.title` says "Munch Gdynia".
   Pick one — these should match.

## Critical files for implementation
(Phase 1 carries the highest risk; these are the files most touched.)

- src/auth.ts
- src/Server/actions/VisitActions.ts
- src/app/page.tsx
- src/app/place.tsx
- src/hooks/use_update_place.ts
