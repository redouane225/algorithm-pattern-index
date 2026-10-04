# Rule 01: Architecture

## Principles
- Keep the architecture boring. Every part must be understandable by one developer.
- Data is separate from UI. Reusable logic is separate from components.
- Prefer simple array operations (`map`, `filter`, `find`, `some`, `includes`) before anything advanced.
- Do not optimize before a real bottleneck exists.
- If a feature becomes complicated, re-check the requirement first.

## Folder structure

```
algorithm-pattern-index/
├─ .agent/rules/                 # these rule files
├─ app/
│  ├─ globals.css                # Tailwind + CSS variable tokens (light/dark)
│  └─ [lang]/
│     ├─ layout.tsx              # <html lang>, header, theme script, validates lang
│     ├─ page.tsx                # index page (server component)
│     ├─ not-found.tsx
│     └─ patterns/[slug]/page.tsx
├─ components/
│  ├─ PatternBrowser.tsx         # CLIENT: owns search/filter state
│  ├─ PatternCard.tsx            # presentational
│  ├─ PatternGrid.tsx
│  ├─ SearchBar.tsx
│  ├─ FilterBar.tsx
│  ├─ CategoryFilter.tsx
│  ├─ DifficultyFilter.tsx
│  ├─ PatternTags.tsx
│  ├─ ComplexityBadge.tsx
│  ├─ EmptyState.tsx
│  ├─ LanguageSwitcher.tsx       # CLIENT (needs pathname)
│  └─ ThemeToggle.tsx            # CLIENT
├─ data/
│  ├─ patterns.en.json
│  ├─ patterns.fr.json
│  └─ ui/
│     ├─ en.json
│     └─ fr.json
├─ lib/
│  ├─ patterns.ts                # load by locale, lookup by id/slug, sort
│  ├─ search.ts                  # normalize + match helpers
│  ├─ filters.ts                 # combine text + category + difficulty
│  ├─ i18n.ts                    # locale list, isLocale, dictionary loader
│  ├─ taxonomy.ts                # CATEGORY_IDS, DIFFICULTIES
│  └─ validate.ts                # pure data validators (used by script + tests)
├─ scripts/
│  └─ validate-data.ts           # runs validators, exits non-zero on error
├─ types/
│  └─ pattern.ts
├─ tests/
│  ├─ unit/
│  └─ e2e/
├─ DECISIONS.md
├─ CONTENT_REVIEW.md
├─ README.md
└─ (config files: package.json, tsconfig.json, next.config.ts, eslint, vitest, playwright)
```

## Responsibilities
| Location | Responsibility | Must NOT |
|---|---|---|
| `app/` | Routes, layouts, composing pieces | contain search/filter logic |
| `components/` | Visual pieces and local UI state | read JSON files directly, contain matching logic |
| `data/` | Content and UI strings | contain code |
| `lib/` | Pure, testable logic | import React or browser APIs |
| `types/` | TypeScript contracts | contain logic |
| `scripts/` | Build-time tooling | be imported by the app |

## Server vs client components
- Pages and layouts are **server components**. They load data and pass it as serializable props.
- Only these are client components: `PatternBrowser`, `LanguageSwitcher`, `ThemeToggle` (and small children that need state). Add `"use client"` nowhere else.
- Never ship the other language's dataset to the browser. Load only the data for the current `lang`.
- `PatternCard`, `PatternGrid`, `PatternTags`, `ComplexityBadge`, and `EmptyState` stay presentational.

## Static generation
- `generateStaticParams` for `[lang]` and `[slug]`; unknown values must 404 (`dynamicParams = false` or the equivalent in the installed version).
- No runtime data fetching. No API routes. No middleware unless the installed version requires one for a locked decision (the `/` redirect is done with `redirects()` in `next.config.ts`).

## Dependency policy
Allowed runtime: `next`, `react`, `react-dom`.
Allowed dev: `typescript`, `tailwindcss` (and its required PostCSS plugin), `eslint` + Next's ESLint config + `typescript-eslint`, `prettier`, `vitest`, `@playwright/test`, `@axe-core/playwright`, `tsx`, and the type packages TypeScript requires.

Anything else needs a written justification in `DECISIONS.md` and, if it is a runtime dependency, **asking the human first**. No UI kits, state libraries, i18n libraries, search libraries, icon packs, animation libraries, or schema libraries.

## Complexity expectations
Search O(n x k), filtering O(n), slug lookup O(n) on an array. These are acceptable for the expected dataset. Do not index or cache prematurely. If the dataset ever grows large, an id-keyed map is the first step; note this in `DECISIONS.md`, but do not build it now.
