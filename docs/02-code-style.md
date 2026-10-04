# Rule 02: Code style

## TypeScript
- `strict: true` and `noUncheckedIndexedAccess: true`.
- No `any`. No non-null assertions (`!`) unless commented with the reason. Prefer `unknown` + narrowing.
- Use `import type` for type-only imports.
- Derive types from constants where possible (`as const` arrays for `CATEGORY_IDS`, `DIFFICULTIES`, `LOCALES`).
- Exported functions have explicit return types.

## Naming and files
- Components: `PascalCase.tsx`, one component per file, named export (no default exports except where Next.js requires them: `page`, `layout`, `not-found`, config files).
- Functions and variables: `camelCase`. Constants: `UPPER_SNAKE_CASE` only for true constants.
- JSON keys: `camelCase`. Pattern IDs and URL slugs: `kebab-case`.
- Test files: `*.test.ts` (unit) and `*.spec.ts` (e2e).

## Functions and modules
- Small, single-purpose, pure functions in `lib/`. A function that needs more than ~30 lines probably does two jobs.
- No side effects at import time, except reading static JSON.
- No dead code, no commented-out code, no `console.log` left behind, no TODOs without a matching entry in `DECISIONS.md`.
- Early returns over deep nesting.
- Comments explain **why**, not what. Add a short JSDoc to every exported function in `lib/`.

## React
- Props are typed with an `interface` named `<Component>Props`.
- Derive values during render; do not store derived state (for example, compute filtered results with `useMemo` or directly, instead of keeping them in state).
- Keys for lists are stable IDs, never array indexes (except for fixed, non-reorderable static lists such as pseudocode lines, and only with a comment).
- No inline styles. No `dangerouslySetInnerHTML` (see security rule).

## Tailwind
- Use utility classes in JSX. Do not use `@apply` except in `globals.css` for base element styles.
- Colors come from CSS-variable tokens (see `07-ui-design.md`), not hard-coded hex values in components.
- Repeated class lists become a component, not a copy-paste.

## Formatting and linting
- Prettier defaults plus `singleQuote: false`, `semi: true`, `trailingComma: "all"`, `printWidth: 100`.
- ESLint must pass with zero warnings (`--max-warnings 0`).
- Never disable a lint rule inline without a one-line reason.

## Errors
- Validation errors in data must name the file, the pattern `id`, and the field.
- Do not swallow errors. Do not catch an error just to ignore it.

## Accessibility baseline in code
- Semantic elements first (`header`, `main`, `nav`, `ul`, `button`, `a`, `label`).
- Every input has a visible or `aria-label` label (translated).
- Interactive elements are real buttons or links, never clickable `div`s.
