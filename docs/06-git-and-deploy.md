# Rule 06: Git and deployment

## Git
- Single `main` branch is fine for V1. Initialize the repo in phase 1.
- `.gitignore` must cover: `node_modules`, `.next`, `out`, `.env*`, `coverage`, `playwright-report`, `test-results`, `.vercel`, `*.log`, `.DS_Store`.
- **One local commit per phase**, plus a commit whenever a logical unit is complete and the gate passes. Never commit a failing build or failing tests.
- Commit messages: short, imperative, descriptive. Examples:
  - `set up Next.js project with TypeScript and Tailwind`
  - `add pattern types, taxonomy and data validator`
  - `add sliding window pattern in English and French`
  - `improve search to ignore accents`
  - `add language switcher that keeps the current path`
- Keep `data/*.json` version-controlled and committed in small, readable changes.
- **Do not run `git push`** or add remotes. The human pushes after reviewing.
- Do not rewrite history. Do not commit generated folders or secrets.

## package.json scripts (required names)
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint . --max-warnings 0",
  "typecheck": "tsc --noEmit",
  "validate:data": "tsx scripts/validate-data.ts",
  "prebuild": "npm run validate:data",
  "test": "vitest run",
  "test:e2e": "playwright test",
  "audit": "npm audit --audit-level=high",
  "check": "npm run lint && npm run typecheck && npm run validate:data && npm test && npm run audit && npm run build && npm run test:e2e"
}
```
Adjust only if a tool's installed version requires it, and record why in `DECISIONS.md`.

## Quality gate
Before every commit: `npm run lint && npm run typecheck && npm test`.
Before finishing a phase: the relevant parts of `npm run check`.
Before finishing phase 9: the full `npm run check`.

## Deployment (human steps, document them in the README)
1. Create an empty GitHub repository.
2. `git remote add origin <url>` and `git push -u origin main`.
3. In Vercel: **Add New Project**, import the repository. Framework preset: Next.js. Build command and output directory: defaults. **No environment variables needed.**
4. Deploy, then open the public URL and verify: `/` redirects to `/en`; `/fr` works; a detail page loads; security headers are present (browser dev tools, Network tab).
5. Each later `git push` to `main` triggers a new production deployment.

Treat production as another environment to verify, not the first place to discover errors: always run `npm run check` locally first.

## README must contain
- What the project is (2-3 lines).
- Requirements (Node version), install, and the scripts above.
- Project structure (short).
- How to add a pattern (see `04-i18n-and-data.md`).
- How language and theme work.
- Security notes (headers, no secrets, CSP trade-off).
- Deployment steps (above).
- Roadmap: V1.1 sorting/categories and filters in the URL; V1.2 browser favorites; V1.3 recognition practice mode; V2 database/auth/progress; V3 optional AI.
