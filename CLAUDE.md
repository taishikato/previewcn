# Repository Guidelines

## Project Structure & Module Organization

- `app/`: Next.js App Router routes (`page.tsx`, `layout.tsx`) and global styles (`globals.css`).
- `lib/`: shared utilities (e.g., `lib/utils.ts` exports `cn()` for Tailwind class merging).
- `public/`: static assets served at `/` (e.g., `public/*.svg`).
- `components.json`: shadcn/ui configuration (aliases like `@/components/ui`); UI components may be added under `components/` later.
- `.next/`: build output (generated; do not edit).

## Build, Test, and Development Commands

This repo includes `pnpm-lock.yaml`; prefer `pnpm`.

- `pnpm install`: install dependencies.
- `pnpm dev`: run the local dev server at `http://localhost:3000`.
- `pnpm build`: create a production build.
- `pnpm start`: run the production server (requires `pnpm build` first).
- `pnpm lint`: run ESLint (Next.js core-web-vitals + TypeScript rules in `eslint.config.mjs`).

## Coding Style & Naming Conventions

- TypeScript + React (Next.js App Router). Keep files as `*.ts`/`*.tsx`.
- Follow existing formatting: 2-space indentation and double quotes in TS/TSX.
- Prefer path aliases (`@/*` via `tsconfig.json`) over deep relative imports.
- Use Tailwind CSS v4 utilities; when composing class names, prefer `cn()` from `lib/utils.ts`.

## Testing Guidelines

- No test runner is configured yet (no `test` script and no `__tests__/` directory). If you add tests, also add the corresponding npm script and document how to run them.
- Suggested convention when introducing tests: `*.test.ts(x)` near the code they cover, or a top-level `__tests__/` folder.

## Commit & Pull Request Guidelines

- Git history is minimal (single bootstrap commit), so no established commit convention exists yet. Use short, scoped, descriptive subjects (e.g., `Add chat layout`, `Fix lint errors`).
- PRs should include: a brief summary, how to test (`pnpm dev` steps), and screenshots for UI changes.
- Keep changes focused; ensure `pnpm lint` passes before requesting review.

## Security & Configuration Tips

- Store local secrets in `.env.local` and do not commit them.
- Keep config changes isolated (e.g., `next.config.ts`, `eslint.config.mjs`) and explain them in the PR description.

## Do
- Write a semantic commit messages:
  - Example:
    ```
    feat: add hat wobble
    ^--^  ^------------^
    |     |
    |     +-> Summary in present tense.
    |
    +-------> Type: chore, docs, feat, fix, refactor, style, or test.
    ```
  - More Examples:
    - feat: (new feature for the user, not a new feature for build script)
    - fix: (bug fix for the user, not a fix to a build script)
    - docs: (changes to the documentation)
    - style: (formatting, missing semi colons, etc; no production code change)
    - refactor: (refactoring production code, eg. renaming a variable)
    - test: (adding missing tests, refactoring tests; no production code change)
    - chore: (updating grunt tasks etc; no production code change)
- Use `type` instead of `interface` whenever possible.
- When creating a new component file, name the file in kebab case, like `query-provider.tsx`.