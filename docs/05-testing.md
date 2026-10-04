# Rule 05: Testing

The mindset: try to **break** your assumptions, not just confirm the happy path.

## Tools and commands
| Script | What it does |
|---|---|
| `npm run lint` | ESLint, zero warnings |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run validate:data` | data validators (see `04-i18n-and-data.md`) |
| `npm test` | Vitest unit + data tests |
| `npm run test:e2e` | Playwright against a production build |
| `npm run audit` | `npm audit --audit-level=high` |
| `npm run check` | all of the above plus `npm run build` |

Playwright runs against `npm run build && npm start` (production behaviour, including headers), not the dev server.

## Unit tests (Vitest), `tests/unit/`
**Search (`lib/search.ts`)**
- Empty query returns everything.
- Exact match, partial match, upper/lower case, extra whitespace.
- Accent-insensitive: `recursivite` finds `récursivité`; `fenetre` finds `fenêtre`.
- Matches each searched field: name, category label, tags, recognize, idea.
- Unknown query returns an empty list.
- Special characters (`(`, `[`, `*`, `\`) do not throw.

**Filters (`lib/filters.ts`)**
- Category alone, difficulty alone, both together, none.
- Text + filters combined.
- Filters that match nothing return an empty list.

**Patterns (`lib/patterns.ts`)**
- Load by locale; lookup by id returns the pattern; unknown id returns `undefined`.

**i18n (`lib/i18n.ts`)**
- `isLocale` accepts `en`/`fr` and rejects everything else (`""`, `EN`, `de`, `en/`).
- Path-swapping helper keeps the rest of the path (`/en/patterns/x` becomes `/fr/patterns/x`).

**Data validators**
- The real data files pass.
- Broken fixtures fail with the right message: duplicate id, missing field, unknown field, bad category, bad difficulty, bad `related` id, self-reference, mismatched ids between languages, mismatched category/difficulty/time/space/related between languages, mismatched dictionary keys.

## End-to-end tests (Playwright), `tests/e2e/`
Use stable selectors (`getByRole`, `getByLabel`, `data-testid` only when needed). Run at least at desktop (1280px) and mobile (375px) viewports.

**Routing**
- `/` redirects to `/en`.
- `/en` and `/fr` render the index with the correct `<html lang>`.
- A card opens `/[lang]/patterns/[slug]`; direct URL load works.
- Unknown slug, unknown language (`/de`), and unknown path return 404 with the not-found page.

**Search and filters**
- Typing narrows results and updates the count.
- Category filter, difficulty filter, both together, and "clear" restoring all results.
- A query with no matches shows the empty state with a working clear button.

**Language and theme**
- Language switch from index and from a detail page lands on the same page in the other language.
- Text is actually in the right language (spot-check a heading and a pattern name).
- Theme toggle switches between light and dark and persists after reload; with storage blocked the app still works.

**Detail page**
- Sections appear in the required order (recognize, idea, pseudocode, complexity, example, related).
- A related link navigates to the other pattern in the same language.

**Security and quality**
- Response headers on `/en` include the CSP and the other required headers.
- No CSP violations or console errors on `/en`, `/fr`, and a detail page.
- `@axe-core/playwright` finds no serious or critical violations on index and detail pages, in light and dark.

**UI stress**
- Long pattern names, many tags, and zero results do not break the layout at 320px width (no horizontal scroll on the page body).

## Scale check
Add a unit test that generates 1,000 synthetic patterns and asserts search + filter completes quickly (generous threshold, for example under 100 ms). It documents that the linear scan remains appropriate; it is not a benchmark.

## Rules
- Never weaken, skip, or delete a test to get a green result. Fix the cause.
- A bug fix starts with a failing test that reproduces it.
- Tests must not depend on the order in which they run or on the real clock.
