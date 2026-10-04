# Algorithm Pattern Index

A bilingual (English / French) personal dictionary of algorithmic patterns and problem-solving strategies, built with Next.js 16 (App Router).

## Setup & Development

### Prerequisites
- Node.js >=22.12.0
- npm

### Installation
```bash
git clone <repo-url>
cd "Algorithmic dictionary"
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Validates data and builds the application for production.
- `npm run start`: Starts the Next.js production server.
- `npm run check`: Runs the complete quality gate (Lint, Typecheck, Validate Data, Unit Tests, Audit, Build, and E2E Tests).
- `npm run lint`: Lints the codebase.
- `npm run test`: Runs unit tests using Vitest.
- `npm run test:e2e`: Runs end-to-end tests using Playwright.
- `npm run validate:data`: Checks the JSON pattern files for schema validity and cross-language parity.
- `npm run audit`: Checks production dependencies for high-severity vulnerabilities.

## How to Add a Pattern

1. Open `data/patterns.en.json` and `data/patterns.fr.json`.
2. Add a new JSON object to both arrays. **The `id` must be identical in both files.**
3. For the English file, provide English text for: `name`, `tags`, `recognize`, `idea`, `pseudocode`, and `example`.
4. For the French file, provide French text for the same text-based fields.
5. The non-human-readable keys (`category`, `difficulty`, `time`, `space`, and `related`) must be identical across both files.
6. The `related` array must only contain valid IDs of existing patterns.
7. Run `npm run validate:data` to verify that your pattern is correctly formatted and perfectly mirrors between the two languages.
8. The UI will automatically pick up and display the new pattern—no UI code changes required!

## Deployment

This project is configured as a standard Next.js application, optimized for hosting on Vercel.

1. Push your repository to GitHub.
2. Log into [Vercel](https://vercel.com/) and create a new Project.
3. Import your GitHub repository.
4. Leave the default settings (Framework Preset: Next.js).
5. The Build Command should be `npm run build` and the Install Command `npm install`.
6. Deploy!
