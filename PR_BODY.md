## Summary

Three commits: a build/test fix, backend try-on work, and a frontend redesign.

The suite could not run and the client could not typecheck — a doc comment in
`src/config/navigation.ts` closed early, leaving five lines of prose parsed as
code (~30 TS errors). That is fixed, plus two real bugs found while verifying.

## Commits

**`7ed0481` fix(e2e): unbreak the suite**
- Malformed doc comment merged into one block — restores typecheck and build.
- `SITE_URL` reads `import.meta.env` through optional chaining. `e2e/smoke.js`
  imports this module directly under plain Node, where `import.meta.env` is a
  Vite-only global and therefore undefined — the property read crashed the
  tests before a browser could open.
- `e2e/flow.js` hardcoded `/dashboard` for the GuestOnly assertion while
  `AUTHENTICATED_HOME` moved to `/home` in this same branch, so a working app
  reported a failing test. Now imports the constant, which also restores the
  "no route string literals outside `config/navigation.ts`" rule.
- `.gitignore` covers the local `e2e/_*.js` probes and their screenshots.

**`aeeda78` feat(try-on): skin-tone extraction, colour-aware garments, CORS**
- `image.service`: extract a dominant skin tone with Sharp — samples the
  central face region, filters skin-like pixels by red dominance and luma,
  returns median RGB as hex, falls back to a neutral warm tone.
- `app.ts`: CORS moves from a static allowlist to a callback — no-Origin
  requests (curl, server-to-server) pass, unknown origins are rejected
  explicitly, credentials permitted.
- `api.ts`: read the bearer token from the in-memory auth store instead of
  parsing localStorage. The session is Firebase-managed and no longer
  persisted there, so the old read always missed.
- `useTryOn`: dropped per-mutation error toasts; `TryOn.tsx` already surfaces
  failures inline, so the toast was a duplicate notification.

**`45bd48c` refactor(ui): editorial redesign, drop exit transitions**
- Marketing and app pages reworked onto the shared editorial vocabulary;
  design tokens consolidated in `index.css`.
- `TryOn.tsx` loses ~340 net lines of duplicated panel markup.
- `AnimatePresence` removed from `App.tsx`. Route exit animations kept the
  outgoing page mounted while the next entered, which on mobile left the nav
  drawer overlapping a half-exited page. Routes animate on entrance only; the
  first page of a session skips the fade since it is already on screen at
  hydration. `ScrollManager` stays inside the `motion.div`.

## Verification

- `npm run typecheck` — clean, client and server
- `npm run build:client` — succeeds
- `npm run test:e2e` — green: 18 routes, mobile checks, both anchor-navigation
  cases, signup/chat/alias flows, 0 errors
- Merges cleanly into `main` (checked with `git merge-tree`)

## Reviewer notes

- One anchor case failed once with "Page crashed" and passed on reruns —
  **flaky, not a regression**, but it may need attention in CI.
- The two behavioural changes worth a second opinion are the removal of route
  exit animations and the `AUTHENTICATED_HOME` move from `/dashboard` to
  `/home`; both are intentional here but change what users see.
- Commit messages were reconstructed from the diffs of previously uncommitted
  work, so they describe what the code does rather than the original intent.
