# CLI Simplification: Devtools-Only Mode

## Overview

CLIをdevtoolsモードのみに簡素化し、iframeモード（receiver）を完全に削除した。

---

## Deleted Files/Directories

### CLI Commands
| Path | Reason |
|------|--------|
| `packages/cli/src/commands/dev.ts` | Editor server startup command (no longer needed) |
| `packages/cli/src/commands/start.ts` | Target+editor startup command (no longer needed) |

### CLI Utils
| Path | Reason |
|------|--------|
| `packages/cli/src/utils/target-dev-server.ts` | Target server management (no longer needed) |
| `packages/cli/src/utils/shutdown.ts` | Shutdown handlers (no longer needed) |
| `packages/cli/src/utils/ports.ts` | Port detection (no longer needed) |
| `packages/cli/src/utils/find-components-dir.ts` | Components directory detection (no longer needed) |
| `packages/cli/src/utils/prefixed-output.ts` | Prefixed output (no longer needed) |
| `packages/cli/src/utils/constants.ts` | Constants (no longer needed) |

### CLI Build Scripts
| Path | Reason |
|------|--------|
| `packages/cli/src/templates/` | Receiver template (no longer needed) |
| `packages/cli/scripts/` | Editor copy script (no longer needed) |
| `packages/cli/editor/` | Standalone build storage (no longer needed) |

### Packages
| Path | Reason |
|------|--------|
| `packages/receiver/` | Entire receiver package (no longer needed) |
| `apps/web/` | Entire editor app (no longer needed) |

---

## Modified Files

### `packages/cli/src/index.ts`
- Made `init` the default command
- Removed `dev` and `start` commands
- Removed `--devtools` and `--force` flags from init

### `packages/cli/src/commands/init.ts`
- Removed all receiver mode logic
- Simplified to devtools setup only
- Removed `devtools` and `force` options from `InitOptions`

### `packages/cli/src/utils/modify-layout.ts`
- Removed receiver-related functions (`addThemeReceiverToLayout`, `checkThemeReceiverInLayout`, `checkReceiverFileExists`)
- Kept only devtools-related functions (`addDevtoolsToLayout`, `checkDevtoolsInLayout`)

### `packages/cli/src/utils/previewcn-setup.ts`
- Rewrote `isPreviewcnInitialized` to check for devtools instead of receiver
- Checks if `@previewcn/devtools` is in package.json
- Checks if `PreviewcnDevtools` is in layout

### `packages/cli/src/commands/doctor.ts`
- Updated checks for devtools mode:
  - Check 1: Next.js App Router (kept)
  - Check 2: `@previewcn/devtools` in package.json (new)
  - Check 3: `PreviewcnDevtools` in layout (updated)
- Removed receiver file check
- Removed target app running check

### `packages/cli/package.json`
- Removed `build:editor` script
- Updated `prepublishOnly` to just `pnpm build`
- Removed `editor` from `files` array

---

## New CLI Structure

```bash
npx previewcn          # Runs init (default)
npx previewcn init     # Setup devtools
npx previewcn doctor   # Diagnose setup status
```

### Init Command Behavior
1. Detect Next.js App Router project
2. Find `layout.tsx`
3. Install `@previewcn/devtools` as devDependency
4. Add devtools import and component to `layout.tsx`

---

## Result

| Aspect | Before | After |
|--------|--------|-------|
| Modes | 2 (iframe/devtools) | 1 (devtools) |
| Commands | 5 (start, init, dev, doctor, help) | 2 (init, doctor) |
| Packages | 3 (cli, receiver, devtools) | 2 (cli, devtools) |
| Apps | 1 (web editor) | 0 |

---

## Usage After Changes

```bash
# Initialize PreviewCN devtools in a Next.js project
npx previewcn

# Check setup status
npx previewcn doctor

# Start development (user's own dev server)
pnpm dev
# Then click the theme palette icon in the bottom-right corner
```
