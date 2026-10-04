# Decisions

A log of non-obvious choices: what was chosen, the alternative, and why.
Newest entries at the bottom of each phase.

## Phase 1: Setup

### Rules files live in `docs/`, not `.agent/rules/`
- **Chose:** keep the rule files where the human put them (`docs/01-…07-*.md`).
- **Alternative:** move them to `.agent/rules/` as the master prompt's folder tree shows.
- **Why:** moving the human's files is not needed for any requirement. ESLint ignores `docs/`.

### Hand-written `package.json` instead of `create-next-app`
- **Chose:** write `package.json`, `tsconfig.json`, and configs by hand, then `npm install` exact versions.
- **Alternative:** `npx create-next-app ./`.
- **Why:** the folder name ("Algorithmic dictionary") is not a valid npm package name, so the generator refuses it.
  Writing the files by hand also avoids sample files we would delete anyway.

### Version pins that are not "latest"
| Package | Pinned | Latest | Why |
|---|---|---|---|
| `typescript` | 6.0.x | 7.0.2 | `typescript-eslint@8.71` supports TypeScript `<6.1` only. |
| `eslint` | 9.39.5 | 10.12.0 | `eslint-plugin-react`, `-import`, `-jsx-a11y` (bundled in `eslint-config-next`) declare `eslint ^9` as a peer. |
| `vitest` | 4.1.11 | 5.0.3 | See next entry. |
| `vite` (override) | ^7 | 8.x | See next entry. |

All versions are pinned exactly (`--save-exact`) so `npm ci` reproduces the same tree.

### Vitest 4 + `overrides.vite = ^7`
- **Chose:** Vitest 4 and an npm `overrides` entry forcing Vite 7 (Rollup + esbuild).
- **Alternative:** Vitest 5 / Vite 8 (Rolldown).
- **Why:** on this machine, Windows Application Control blocks Rolldown's unsigned native binary
  (`rolldown-binding.win32-x64-msvc.node`: "An Application Control policy has blocked this file").
  Vite 7 works. This adds no new direct dependency. Revisit once Rolldown ships a signed binary,
  or if the project is developed on a machine without that policy.

### `npm audit` gate covers production dependencies only (decided by the human)
- **Chose:** `"audit": "npm audit --omit=dev --audit-level=high"`; `npm run audit:full` shows everything.
- **Alternative:** the original `npm audit --audit-level=high`.
- **Why:** the full audit reports 5 "high" findings. They are all one advisory,
  [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) (`braces`, stack-exhaustion DoS from deeply
  nested glob patterns), reached only via `eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces`.
  - **Reachability:** dev-only. It runs when ESLint expands glob patterns from our own config, never in the
    deployed site and never on user input. Production dependencies report 0 vulnerabilities.
  - **No fix exists:** every `braces` version is affected; npm's only suggestion is downgrading to
    `eslint-config-next@14` (breaking, and older).
  - **Re-check:** run `npm run audit:full` whenever `eslint-config-next` is updated.

### ESLint flat config (Next 16 removed `next lint`)
- `eslint.config.mjs` uses `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`, plus explicit errors
  for `any`, non-null assertions, type-only imports, `console`, `react/no-danger`, `eval`-like APIs.

### Root layout lives in `app/[lang]/layout.tsx`, plus `app/global-not-found.tsx`
- **Chose:** no `app/layout.tsx`. The root layout is under `[lang]`, so `<html lang>` comes straight from the URL.
  `export const dynamicParams = false` + `generateStaticParams` makes `/de` and others 404.
- URLs outside any language have no layout to render a 404 into. Next 16 documents
  `global-not-found.tsx` (behind `experimental.globalNotFound`) for exactly this case
  ("root layout defined using top-level dynamic segments"). It is bilingual because there is no locale to read.
- **Alternative:** a root `app/layout.tsx` with a fixed `<html lang="en">` and a client effect to fix `lang`, which is wrong
  for the first paint and for crawlers.
- **Verified against:** `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md`.

### `params` are Promises; typed with `PageProps` / `LayoutProps`
- Next 16 passes `params` as a `Promise`. Pages use the global `PageProps<"/[lang]">` helpers (generated at build/dev)
  and `await params`. Verified in the bundled `internationalization.md` and `generate-static-params.md`.

### CSP: `'unsafe-inline'` for scripts (V1 trade-off)
- **Chose:** `script-src 'self' 'unsafe-inline'`.
- **Alternative:** per-request nonces.
- **Why:** Next.js static pages inline small bootstrap scripts, and so does our theme script. Nonces need a
  per-request value, which forces dynamic rendering and loses static generation. `'unsafe-eval'` is added in
  development only. `upgrade-insecure-requests` is also skipped in development so `http://localhost` keeps working.

### `turbopack.root` pinned to the project folder
- There is a stray `package-lock.json` in the user's home folder. Turbopack picked it as the workspace root and printed
  a warning. Pinning `turbopack.root` fixes it without touching files outside the project.

### Theme tokens with CSS `light-dark()`
- **Chose:** each token is declared once as `light-dark(<light>, <dark>)`. `color-scheme: light dark` on `:root`
  follows the OS. A `.light` or `.dark` class on `<html>` forces a theme.
- **Alternative:** two blocks of tokens (`:root` and `.dark`) plus a duplicated `prefers-color-scheme` block.
- **Why:** no duplication, and "System" works with no JavaScript at all. Supported by all current browsers.

### Theme script without `dangerouslySetInnerHTML`
- `components/ThemeScript.tsx` renders `<script>{code}</script>`. React 19 emits string children of `<script>`
  verbatim during server rendering (verified in the built `en.html`), so the security rule holds.
  `<html suppressHydrationWarning>` is needed because the script adds a class before hydration.
