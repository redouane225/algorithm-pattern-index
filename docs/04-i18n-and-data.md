# Rule 04: Internationalisation and data

## Language model
- Locales: `en` (default) and `fr`. Defined once in `lib/i18n.ts` as `LOCALES = ["en", "fr"] as const`, with `DEFAULT_LOCALE = "en"` and `isLocale(value)`.
- The language is the first URL segment: `/en/...`, `/fr/...`.
- `/` redirects to `/en` via `redirects()` in `next.config.ts` (temporary redirect). No browser-language detection in V1.
- `<html lang={lang}>` is set in `app/[lang]/layout.tsx`.
- Add `alternates.languages` metadata (hreflang) so each page links to its other-language version.
- The language switcher is a link (not a button with state): it replaces the first path segment and keeps the rest of the path. It is labelled in its own language ("English", "Français") and sets `lang`/`hreflang` on each link.

## Two kinds of text
1. **UI strings** (buttons, labels, headings, empty states, category and difficulty labels): `data/ui/en.json` and `data/ui/fr.json`. Same keys in both files. Components receive a dictionary (or the strings they need) as props. **No hard-coded UI text in components.**
2. **Pattern content**: `data/patterns.en.json` and `data/patterns.fr.json`.

UI dictionary shape (minimum):
```json
{
  "site": { "title": "", "tagline": "" },
  "search": { "label": "", "placeholder": "" },
  "filters": { "category": "", "difficulty": "", "all": "", "clear": "" },
  "results": { "count": "", "empty": "", "emptyHint": "" },
  "detail": { "back": "", "recognize": "", "idea": "", "pseudocode": "", "complexity": "", "time": "", "space": "", "example": "", "problem": "", "why": "", "related": "" },
  "nav": { "language": "", "theme": "", "light": "", "dark": "", "system": "" },
  "notFound": { "title": "", "body": "", "home": "" },
  "categories": { "basic": "", "lookup": "", "sequences": "", "searching": "", "recursion": "", "optimization": "", "combinatorial": "" },
  "difficulties": { "beginner": "", "intermediate": "", "advanced": "" }
}
```
Pluralisation (result count): use two keys (`one`, `other`) and pick with a small helper. Do not add an i18n library.

## Pattern schema and stability
- The schema in `MASTER_PROMPT.md` section 5 is the single source of truth. Keep it stable; changing it requires updating types, both JSON files, the validator, tests, and `DECISIONS.md` together.
- `category` and `difficulty` are **language-neutral keys**. Never store translated labels in them. Labels come from the UI dictionaries.
- `time` and `space` are identical in both files (for example `"O(n)"`).
- `id` equals the URL slug: lowercase letters, digits, and hyphens only (`/^[a-z0-9]+(?:-[a-z0-9]+)*$/`).

## Validation (`lib/validate.ts`, run by `scripts/validate-data.ts`)
Pure functions, no dependencies. The validator must check, and report with file + id + field:

**Per file**
- The file is a JSON array; every item is an object with exactly the schema's fields (no missing required fields, no unknown fields).
- Types are correct (strings, string arrays, nested `example` object).
- `id` matches the slug pattern and is unique within the file.
- `category` is in `CATEGORY_IDS`; `difficulty` is in `DIFFICULTIES`.
- No empty strings, no empty `recognize`, `pseudocode`, or `tags` arrays.
- `time` and `space` look like complexity strings (start with `O(`).
- Every `related` ID exists in the same file and is not the pattern's own ID.

**Across files**
- Same set of `id`s in `en` and `fr`.
- For each `id`: identical `category`, `difficulty`, `time`, `space`, `related`.
- Every UI dictionary has exactly the same key set (deep comparison), and contains a label for every `CATEGORY_IDS` and `DIFFICULTIES` entry.

**Wiring**
- `npm run validate:data` runs the script. It is part of `prebuild` and `npm run check`, so invalid data **fails the build**.
- Unit tests call the same validators with deliberately broken fixtures to prove they catch each error type.

## Adding a pattern (document this in the README)
1. Add the object to `patterns.en.json` and `patterns.fr.json` with the same `id`.
2. Run `npm run validate:data`.
3. Run `npm run dev` and check both languages.
No UI code should change. If it does, that is a bug in the architecture.

## Content rules
- You write only the 3 seed patterns. Keep them accurate and conventional; the human reviews them (`CONTENT_REVIEW.md`).
- French content must be natural technical French (for example "fenêtre glissante", "deux pointeurs", "recherche dichotomique"), not literal word-for-word translation. Keep code-like terms (`left`, `right`) in code font where they refer to variables.
- Do not invent facts about complexity. If unsure, leave a note in `CONTENT_REVIEW.md` instead of guessing.
