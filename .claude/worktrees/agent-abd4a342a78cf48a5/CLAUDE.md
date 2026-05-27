# Project: Places I Ate

Personal Next.js 14 (App Router) app for logging restaurant visits. Stack: React 18, Tailwind, NextAuth 5 beta (GitHub OAuth), Prisma 5 + MongoDB Atlas, TanStack Query v5, Leaflet.

## Commands

- `npm run dev` — start dev server (runs prisma generate first)
- `npm run build` — production build
- `npm run lint` — ESLint
- `npx tsc --noEmit` — type check
- `npm run test:e2e` — Playwright e2e tests (requires E2E env vars, see below)

## E2E Tests

The dev server must be running with E2E env vars for tests to work:

```bash
E2E_TEST=true E2E_SECRET_TOKEN=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6 npx next dev
```

Then in another terminal:

```bash
E2E_TEST=true E2E_SECRET_TOKEN=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6 npx playwright test
```

Run the e2e suite after any feature change and fix failures before reporting done.

## Code Style

- Single quotes, semicolons always (enforced by ESLint)
- Path alias: `@/*` maps to `src/*`
- `--legacy-peer-deps` required for npm install (React 18 + some deps expect React 19)

## Architecture Notes

- Server actions live in `src/Server/actions/`, service classes in `src/Server/{Name}Service/`
- Shared types (`VisitWithPlace`, `RatingType`, `SortType`) exported from `src/Server/VisitService/VisitService.ts`
- Auth bypass for e2e: conditional CredentialsProvider in `src/lib/auth.config.ts`, guarded by `E2E_TEST=true && NODE_ENV !== 'production'`

## End-of-Session Checklist

Before wrapping up a session, update PLAN.md and README.md to reflect any completed work, new features, or changed architecture.
