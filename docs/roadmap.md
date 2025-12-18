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

#### Proposed packaging
Split into small, focused packages:

- `@previewcn/receiver`
  - A small, framework-aware receiver for Next.js App Router apps.
  - Dev-only integration recommended.
- `previewcn` (CLI)
  - Bootstraps receiver installation and starts the local editor UI.

#### CLI commands (proposal)
- `npx previewcn init`
  - Detect `app/layout.tsx` (App Router).
  - Add receiver file (or install `@previewcn/receiver`).
  - Add dev-only `<ThemeReceiver />` to `app/layout.tsx`.
  - Optionally provide instructions for iframe embedding requirements (if iframe mode is used).
- `npx previewcn dev --target http://localhost:3000`
  - Start PreviewCN editor UI locally.
  - Open the editor in the browser.
- `npx previewcn doctor`
  - Validate common requirements and explain failures in plain English.

#### Definition of Done
- A brand-new App Router app can be made "PreviewCN-ready" with `npx previewcn init`.
- No receiver code copy/paste is required.
- No theme is applied automatically (first apply remains user-triggered).

#### Status
- Implemented ✅

#### Implementation notes (current architecture)
- **Monorepo structure**: Restructured to Turborepo + pnpm workspaces monorepo.
  - `apps/web` - Editor UI (`@previewcn/web`, private)
  - `packages/receiver` - ThemeReceiver component (`@previewcn/receiver`, npm publish)
  - `packages/cli` - CLI tool (`previewcn`, npm publish)
- **@previewcn/receiver**:
  - Exports `ThemeReceiver` component and all message types (`ConnectionStatus`, `PreviewCNMessage`, etc.).
  - Built with tsup (ESM + CJS + types), minified to ~1.7KB.
  - `peerDependencies: react >= 18`.
- **previewcn CLI**:
  - Built with commander.js + chalk + ora + prompts.
  - Commands: `init`, `dev`, `doctor`.
  - `init`: Detects Next.js App Router, installs `@previewcn/receiver`, modifies `app/layout.tsx`.
  - `dev`: Starts bundled editor server from `editor/` directory.
  - `doctor`: Diagnoses setup issues (project type, receiver installation, layout integration).
- **Build pipeline**: Turborepo manages build order (`packages/receiver` → `apps/web` → `packages/cli`).
- **Not yet published**: Packages are ready but not yet published to npm. Next step is to publish and test the full flow.

---

## Non-goals (for now)

- Hosted web app version (SaaS)
- VS Code extension
- Accessibility tooling (contrast checks, simulations)


