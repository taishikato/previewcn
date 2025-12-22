# PreviewCN Roadmap (DX-first)

This document describes the next roadmap items for PreviewCN with a focus on **practical DX for applying themes to existing Next.js App Router apps**.

## Principles

- **App Router only**: We optimize for `app/` projects first.
- **No automatic apply on first load**: PreviewCN must not send any theme payload by default. A theme is applied **only after an explicit user action**.
- **Make the “why it doesn’t work” obvious**: If the target app cannot receive messages or cannot be embedded, PreviewCN should explain the exact next step.

## Roadmap

### 1) Fix misleading default “selected” states in the sidebar (UX correctness)

#### Problem
PreviewCN currently shows a color preset and font as “selected” in the sidebar on first load, but **it does not auto-send** any theme payload. This creates a mismatch:

- The UI looks “configured”
- The target app still looks unchanged
- Users assume something is broken

#### Goal
Ensure the sidebar does **not** imply that a theme has been applied when no message has been sent.

#### Proposed direction
Introduce an explicit “not applied yet” state, and avoid highlighting options by default until the user makes a choice.

Options (choose one):

- **Option A (preferred for clarity)**: Add `None / Not selected` as the initial state for:
  - Theme Color preset
  - Font
  - Show lightweight guidance text like “Select a color preset to apply”.
- **Option B**: Keep defaults visible but add an unmistakable badge (e.g. `Not applied`) and a single “Apply current settings” button that sends the first message (still manual).

I chose A.

#### Definition of Done
- On a fresh load, the sidebar does not show “selected” styles for Theme Color and Font.
- The UI clearly communicates that nothing has been applied yet.
- The first apply is still **user-triggered** (no auto apply).

#### Implementation notes (current behavior)
- **Unselected-by-default**: Theme Color and Font start as `Not selected` (no highlighted option).
- **Guidance text**: Each unselected section shows lightweight guidance (e.g. “Select a color preset to apply”).
- **No-op messaging for null**: The editor **does not send** theme messages for settings that are still unselected.
- **Export UX**: Export is disabled until at least one setting is selected (prevents copying empty CSS).
- **Applied consistently**: The same “not selected yet” pattern is also used for Radius and Mode for UI consistency.

#### Status
- Implemented ✅

---

### 2) Make connection status visible (small–medium effort, immediate UX win)

#### Problem
There are multiple failure modes, but the user currently can’t quickly tell which one they hit:

- Target app is not running / wrong URL
- Target app blocks embedding (`X-Frame-Options`, `Content-Security-Policy frame-ancestors`)
- The target app does not include the receiver (so messages are ignored)
- The target app receives messages but applies nothing due to unexpected DOM/CSS differences

#### Goal
Show an explicit, real-time connection status such as:

- `Connected` (receiver active and responding)
- `Not connected` (no receiver handshake)
- `Preview blocked` (iframe blocked by headers/CSP)

#### Proposed direction (handshake)
Add a minimal handshake protocol on top of `postMessage`.

- Receiver sends a one-time `PREVIEWCN_READY` message on mount.
- Editor can periodically `PREVIEWCN_PING` and expects `PREVIEWCN_PONG`.
- Editor UI derives and displays a status (and suggested next action).

Important: **This handshake must not trigger theme application**. It is only for visibility.

#### Definition of Done
- PreviewCN displays `Connected / Not connected / Blocked` states.
- When blocked, PreviewCN points to the specific configuration needed (e.g. CSP for iframe mode).
- When not connected, PreviewCN points to “Install/enable receiver” steps.

#### Status
- Implemented ✅

#### Implementation notes (current behavior)
- **Message protocol**:
  - Added `PREVIEWCN_READY`, `PREVIEWCN_PING`, `PREVIEWCN_PONG` message types (separate from theme-apply messages).
  - Receiver sends `PREVIEWCN_READY` on mount and responds to `PREVIEWCN_PING` with `PREVIEWCN_PONG`.
- **Editor polling**:
  - Editor sends `PREVIEWCN_PING` periodically and marks `Not connected` if no recent `PONG` is received.
  - Ping/pong is for connection visibility only; it does not apply any theme.
- **UI**:
  - Connection status is shown under **Target URL**.
  - `Connected`: receiver is present and responding.
  - `Not connected`: no handshake response; UI suggests installing/enabling `ThemeReceiver`.
  - `Preview blocked`: iframe load error; UI suggests allowing iframe embedding via CSP/headers.
- **Docs**:
  - `README.md` includes updated receiver snippet with the handshake messages.

---

### 3) CLI + npm packages (remove copy/paste, remove manual edits)

#### Problem
Today, setup requires manual steps:

- Copy/paste receiver code into the target app
- Manually update project config for embedding (when using iframe mode)

This is slow, error-prone, and discourages adoption.

#### Goal
Make setup a **single command** and reduce the “human editing surface area” to near-zero.

Concretely, the recommended happy path should be:

- `npx previewcn` (no subcommand) starts everything needed for local preview.
- File edits are explicit and consented to (prompted), since `init` modifies user source files.

#### Proposed packaging
Single CLI package (shadcn/ui-style file generation, no external dependencies):

- `previewcn` (CLI)
  - Generates receiver component directly into the target project (no npm install required).
  - Starts the local editor UI.

#### CLI commands (proposal)
- `npx previewcn` (recommended default)
  - If PreviewCN is already initialized → start the target dev server + start the editor.
  - If PreviewCN is not initialized → prompt “Run init now?” (Yes: run `init` then continue, No: print next steps and exit).
  - Start the target dev server on an available port (e.g. 3000, 3001, ...).
  - Pass the resolved target URL to the editor via `--target` / `PREVIEWCN_TARGET_URL` so the editor loads it by default.
- `npx previewcn init`
  - Detect `app/layout.tsx` (App Router).
  - Generate `components/previewcn-theme-receiver.tsx` (no npm package install).
  - Add dev-only `<PreviewCNThemeReceiver />` to `app/layout.tsx`.
  - Optionally provide instructions for iframe embedding requirements (if iframe mode is used).
- `npx previewcn dev --target http://localhost:3000`
  - Start PreviewCN editor UI locally.
  - Open the editor in the browser.
- `npx previewcn doctor`
  - Validate common requirements and explain failures in plain English.

#### Definition of Done
- A brand-new App Router app can be made "PreviewCN-ready" with `npx previewcn init`.
- Running `npx previewcn` in a fresh App Router app prompts to initialize, then launches the editor with the correct target URL already loaded.
- No receiver code copy/paste is required.
- No theme is applied automatically (first apply remains user-triggered).

#### Status
- Implemented ✅ (init/dev/doctor)
- Planned: default `npx previewcn` command (prompted init + start target dev + start editor)

#### Implementation notes (current architecture)
- **Monorepo structure**: Restructured to Turborepo + pnpm workspaces monorepo.
  - `apps/web` - Editor UI (`@previewcn/web`, private)
  - `packages/receiver` - ThemeReceiver source (used as template, not published)
  - `packages/cli` - CLI tool (`previewcn`, npm publish)
- **shadcn/ui-style approach**:
  - No `@previewcn/receiver` npm package to install.
  - CLI generates `components/previewcn-theme-receiver.tsx` directly in the target project.
  - Types are inlined in the generated file for zero external dependencies.
  - Users own their code and can customize if needed.
- **previewcn CLI**:
  - Built with commander.js + chalk + ora + prompts.
  - Commands: `init`, `dev`, `doctor` (+ planned default `previewcn` entry).
  - `init`: Detects Next.js App Router, generates receiver file, modifies `app/layout.tsx`.
  - `init --force`: Regenerates receiver file (useful for updates).
  - `dev`: Starts bundled editor server from `editor/` directory.
  - `doctor`: Diagnoses setup issues (project type, receiver file, layout integration).
- **Production safety**:
  - `init` inserts the receiver behind a `process.env.NODE_ENV === "development"` guard in `app/layout.tsx`.
  - The generated receiver component is also defensive and becomes a no-op in production even if accidentally rendered.
- **Build pipeline**: Turborepo manages build order (`apps/web` → `packages/cli`).
- **Single package to publish**: Only `previewcn` CLI needs to be published to npm.

#### Directory structure
```
previewcn/
├── apps/
│   └── web/                    # Editor UI (@previewcn/web, private)
│       ├── app/                # Next.js App Router pages
│       ├── components/
│       │   └── theme-editor/   # Editor sidebar & preview
│       └── lib/                # Theme presets, fonts, utilities
├── packages/
│   ├── receiver/               # ThemeReceiver source (template, not published)
│   │   └── src/
│   │       ├── theme-receiver.tsx
│   │       └── types.ts        # Message type definitions
│   └── cli/                    # previewcn CLI (npm publish)
│       └── src/
│           ├── index.ts        # CLI entry (commander)
│           ├── commands/       # init, dev, doctor
│           └── templates/      # Generated file templates
├── turbo.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

#### Key files
| File | Description |
|------|-------------|
| `packages/cli/src/templates/theme-receiver.ts` | Template for generating `previewcn-theme-receiver.tsx` |
| `packages/cli/src/commands/init.ts` | `npx previewcn init` implementation |
| `packages/cli/src/commands/dev.ts` | `npx previewcn dev` implementation |
| `apps/web/components/theme-editor/use-theme-editor.ts` | Editor state management & iframe communication |
| `apps/web/lib/theme-presets.ts` | Color presets and CSS variable generation |

#### Development workflow
```bash
pnpm install        # Install all dependencies
pnpm build          # Build all packages (receiver → web → cli)
pnpm dev:web        # Start editor at localhost:4000
pnpm lint           # Run ESLint across all packages
```

#### Communication flow
```
┌─────────────────────┐         postMessage          ┌─────────────────────┐
│   Editor (web)      │ ────────────────────────────▶│   ThemeReceiver     │
│   localhost:4000    │                              │   (target app)      │
└─────────────────────┘                              └─────────────────────┘

Messages (Editor → Receiver):
  - APPLY_THEME        : Full theme update (colors, font, radius, mode)
  - UPDATE_COLORS      : Color variables only
  - UPDATE_FONT        : Font family + Google Fonts URL
  - UPDATE_RADIUS      : Border radius value
  - TOGGLE_DARK_MODE   : Light/dark mode switch
  - PREVIEWCN_PING     : Connection health check

Messages (Receiver → Editor):
  - PREVIEWCN_READY    : Sent on mount (receiver is present)
  - PREVIEWCN_PONG     : Response to PING (connection alive)
```

---

## Non-goals (for now)

- Hosted web app version (SaaS)
- VS Code extension
- Accessibility tooling (contrast checks, simulations)

---

### 4) Embedded Editor / DevTools mode (single dev server, no iframe)

#### Problem
The current architecture runs a separate editor server and previews the target app via iframe. This creates friction and failure modes:

- Two dev servers (extra terminal/port).
- Iframe embedding can be blocked by headers/CSP (`X-Frame-Options`, `Content-Security-Policy frame-ancestors`).
- The experience feels like a separate app rather than “devtools inside your app”.

#### Goal
Offer an optional “embedded” workflow where the PreviewCN editor UI is available **inside the target app** during development:

- A small icon on the edge of the page (DevTools-style).
- Clicking toggles an overlay/sidebar editor UI.
- No iframe is required (the target app renders normally).
- Still respects the core principles: **no auto-apply on first load**, and **production-safe by default**.

#### Proposed direction
- `previewcn init --devtools` inserts a small `<PreviewcnDevtools />` component into `app/layout.tsx` (without wrapping `children`).
- The devtools UI is **lazy-loaded** and only mounted when the icon is opened.
- Production safety:
  - Gated by `process.env.NODE_ENV === "development"`.
  - Defensive no-op behavior even if accidentally committed.
- Packaging note:
  - The devtools UI is distributed as `@previewcn/devtools` npm package (devDependency).

#### Implementation
- `@previewcn/devtools` package: Standalone devtools with color, radius, font, and mode selectors
- CLI flag: `npx previewcn init --devtools` for automatic setup
- Styles: Built with Tailwind CSS, bundled as `dist/styles.css`
- State: Persisted in localStorage; applied only after user interaction (opening the panel / changing settings)

#### Status
- ✅ Implemented


