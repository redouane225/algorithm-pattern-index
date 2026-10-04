# Rule 07: UI and design

## Direction
Clean reference/documentation style, not marketing-heavy. Think readable technical docs: generous whitespace, calm colors, clear hierarchy. **Search is the dominant interaction on the index page.** Important information is always visible, never hidden behind hover or animation.

## Tokens (CSS variables in `app/globals.css`)
Define semantic tokens once, with light values on `:root` and dark values under `.dark` (and the matching `prefers-color-scheme` default):
`--bg`, `--surface`, `--surface-muted`, `--border`, `--text`, `--text-muted`, `--accent`, `--accent-contrast`, `--focus-ring`, plus one badge color per difficulty (`beginner`, `intermediate`, `advanced`) and a neutral category badge.
Components use these tokens through Tailwind (for example `bg-[--surface]` or theme-extended classes). No hard-coded hex values in components.

## Theme behaviour
- Default follows the system preference.
- The `ThemeToggle` offers Light / Dark / System and stores the choice in `localStorage` (try/catch around access).
- Avoid a flash of the wrong theme: a tiny inline script in the layout `<head>` sets the class before paint. Keep it under ~15 lines, with no external dependencies; note it in `DECISIONS.md` (it relies on `'unsafe-inline'` in the CSP).
- Both themes must meet WCAG AA contrast (4.5:1 for normal text, 3:1 for large text and UI components). Verify with the axe checks.

## Typography
- System font stack for text (no external fonts). Monospace stack for pseudocode and complexity: `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`.
- Body text at least 16px, line-height around 1.6, max line length about 70 characters in detail pages.
- Pseudocode: ordered list in a monospace block, lines numbered, horizontal scroll inside the block (never the page) if a line is long.

## Layout
- Mobile-first, works from 320px.
- Index grid: 1 column (mobile), 2 (tablet), 3 (desktop).
- Header: site title (links to `/[lang]`), language switcher, theme toggle.
- Detail page: single readable column; metadata badges under the title; sections in the required order with clear headings.
- The page body never scrolls horizontally. Wide content (code, tables) scrolls inside its own container.

## Components
- **PatternCard:** name (link), category badge, difficulty badge, first 2-3 recognition clues, time/space. Mostly presentational. The whole card is clickable via the link, with a visible focus state.
- **Badges:** one shared badge component; category is neutral, difficulty uses its token color **and** shows the text label (never color alone).
- **ComplexityBadge:** monospace, shows `time` and `space` with translated labels.
- **EmptyState:** clear message, hint, and a "clear filters" button.
- **SearchBar:** `type="search"`, visible label (or `aria-label`), placeholder is a hint only, native clear behavior left alone.
- **Filters:** native `<select>` elements with labels are acceptable and preferred over custom dropdowns.

## Accessibility checklist
- [ ] One `h1` per page; heading levels in order.
- [ ] Landmarks: `header`, `main`, `nav` (breadcrumb), `footer` if present.
- [ ] A "skip to content" link as the first focusable element.
- [ ] Every control is reachable and operable by keyboard; `:focus-visible` ring is clearly visible in both themes.
- [ ] Result count is in an `aria-live="polite"` region.
- [ ] Language links have `lang` and `hreflang`; the current language is marked with `aria-current="true"`.
- [ ] Respect `prefers-reduced-motion`; avoid animation unless it carries meaning (V1 needs almost none).
- [ ] Touch targets are at least 44x44px on mobile.
- [ ] Images are not needed in V1; if one is added, it needs meaningful `alt` text.

## Do not
- No animation libraries, no carousels, no modals for core content, no cookie banners (nothing is tracked), no decorative gradients that reduce contrast.
