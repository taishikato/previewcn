# PreviewCN: shadcn-style CLI Implementation Plan

## Overview

Change PreviewCN's distribution model from npm package to shadcn-style CLI that generates components directly into the user's project.

| Item | Decision |
|------|----------|
| Target directory | `components/ui/previewcn/` |
| Style approach | Inline Tailwind classes only (no CSS-in-JS) |
| Layout modification | Auto-modify with `@/components/ui/previewcn` import |

---

## Generated File Structure

```
components/ui/previewcn/
├── index.ts                    # Main export (PreviewcnDevtools)
├── devtools.tsx               # Main component (dev-only guard)
├── trigger.tsx                # Trigger button (FAB)
├── panel.tsx                  # Panel main layout
├── color-picker.tsx           # Color picker
├── preset-selector.tsx        # Preset selector
├── radius-selector.tsx        # Border radius selector
├── font-selector.tsx          # Font selector dropdown
├── mode-toggle.tsx            # Light/Dark mode toggle
├── css-export-button.tsx      # CSS export button
├── theme-applier.ts           # Theme application logic
├── use-theme-state.ts         # State management hook
├── css-export.ts              # CSS generation utility
└── presets/
    ├── index.ts
    ├── colors.ts
    ├── color-preset-specs.ts
    ├── radius.ts
    ├── fonts.ts
    └── theme-presets.ts
```

**Key changes from current structure:**
- Flattened (no `hooks/`, `utils/`, `panel/` subdirectories except `presets/`)
- Tailwind utilities only (no runtime style injection files)
- Files renamed to kebab-case consistently

---

## CSS to Tailwind Conversion Strategy

All styling is done with inline Tailwind utility classes (no runtime `<style>` injection and no CSS-in-JS).

### 1. Tailwind Class Mapping

| CSS Property | Tailwind Class |
|--------------|----------------|
| `position: fixed` | `fixed` |
| `z-index: 99999` | `z-[99999]` |
| `width: 48px; height: 48px` | `size-12` |
| `width: 320px` | `w-80` |
| `height: 100dvh` | `h-dvh` |
| `border-radius: 999px` | `rounded-full` |
| `display: flex` | `flex` |
| `flex-direction: column` | `flex-col` |
| `gap: 8px` | `gap-2` |
| `padding: 12px 16px` | `px-4 py-3` |
| `font-size: 12px` | `text-xs` |
| `font-weight: 500` | `font-medium` |
| `cursor: pointer` | `cursor-pointer` |
| `overflow: hidden` | `overflow-hidden` |
| `overflow-y: auto` | `overflow-y-auto` |

### 2. Inline Styles for Complex Properties

Properties that cannot be expressed in Tailwind must use React inline styles:

```typescript
// Panel gradient background
const panelStyle: React.CSSProperties = {
  background: `
    radial-gradient(120% 140% at 0% 0%, oklch(0.25 0.05 265 / 0.25), transparent 45%),
    linear-gradient(180deg, oklch(0.18 0.02 260), oklch(0.14 0.02 260))
  `,
  borderLeft: "1px solid oklch(1 0 0 / 0.08)",
  boxShadow:
    "0 24px 60px oklch(0 0 0 / 0.6), 0 1px 0 oklch(1 0 0 / 0.04) inset",
};

// Trigger button gradient
const triggerStyle: React.CSSProperties = {
  background: "linear-gradient(180deg, oklch(0.23 0.03 260) 0%, oklch(0.16 0.02 260) 100%)",
  boxShadow: "0 16px 32px oklch(0 0 0 / 0.45), 0 0 0 1px oklch(1 0 0 / 0.04) inset",
};
```

### 3. Animations

Animations are optional and use only standard Tailwind utilities (`transition`, `duration`, `ease`, `transform`) to avoid any `tailwind.config` changes.

### 4. Tailwind Configuration

No `tailwind.config` updates are required. The implementation relies only on built-in utility classes and inline styles.

---

## Example: Converted trigger.tsx

```typescript
"use client";

type TriggerProps = {
  onClick: () => void;
};

function PaletteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

export function Trigger({ onClick }: TriggerProps) {
  return (
    <button
      onClick={onClick}
      className="previewcn-trigger fixed bottom-4 right-4 z-[99999] inline-flex items-center justify-center size-12 rounded-full border border-[oklch(1_0_0/0.18)] text-white transition-all duration-[180ms] hover:border-[oklch(1_0_0/0.28)]"
      style={{
        background: "linear-gradient(180deg, oklch(0.23 0.03 260) 0%, oklch(0.16 0.02 260) 100%)",
        boxShadow: "0 16px 32px oklch(0 0 0 / 0.45), 0 0 0 1px oklch(1 0 0 / 0.04) inset",
      }}
      aria-label="Open PreviewCN theme editor"
      title="PreviewCN Theme Editor"
    >
      <PaletteIcon />
    </button>
  );
}
```

---

## CLI Modifications

### Files to Modify

| File | Changes |
|------|---------|
| `packages/cli/src/commands/init.ts` | Remove npm install, add file generation |
| `packages/cli/src/utils/modify-layout.ts` | Use `@/components/ui/previewcn` import, remove CSS import |

### New Files to Create

| File | Purpose |
|------|---------|
| `packages/cli/src/utils/file-generator.ts` | Core file generation logic |
| `packages/cli/src/utils/path-resolver.ts` | Import path resolution (alias-based) |
| `packages/cli/src/templates/*.ts` | Component templates (multiple files) |

### Template Directory Structure

```
packages/cli/src/templates/
├── index.ts                    # Barrel export
├── index.template.ts
├── devtools.template.ts
├── trigger.template.ts
├── panel.template.ts
├── color-picker.template.ts
├── preset-selector.template.ts
├── radius-selector.template.ts
├── font-selector.template.ts
├── mode-toggle.template.ts
├── css-export-button.template.ts
├── theme-applier.template.ts
├── use-theme-state.template.ts
├── css-export.template.ts
└── presets/
    ├── index.template.ts
    ├── colors.template.ts
    ├── color-preset-specs.template.ts
    ├── radius.template.ts
    ├── fonts.template.ts
    └── theme-presets.template.ts
```

### Layout Modification Changes

**Before (npm package):**
```typescript
import "@previewcn/devtools/styles.css";
import { PreviewcnDevtools } from "@previewcn/devtools";
```

**After (shadcn-style):**
```typescript
import { PreviewcnDevtools } from "@/components/ui/previewcn";
```

### Alias Resolution Rules

The CLI resolves the import alias and target directory in this order:

1. Read `components.json` and use `aliases.ui` if present (e.g. `@/components/ui`).
2. If `aliases.ui` is missing but `aliases.components` exists, use `${aliases.components}/ui`.
3. Fallback to `@/components/ui`.

The final target directory is `${uiAlias}/previewcn`.

### file-generator.ts Example

```typescript
import * as fs from "fs/promises";
import * as path from "path";

export type GeneratedFile = {
  path: string;      // Relative path from target directory
  content: string;   // File content
};

export async function generateComponentFiles(): Promise<GeneratedFile[]> {
  return [
    { path: "index.ts", content: generateIndexTemplate() },
    { path: "devtools.tsx", content: generateDevtoolsTemplate() },
    { path: "trigger.tsx", content: generateTriggerTemplate() },
    { path: "panel.tsx", content: generatePanelTemplate() },
    // ... etc
  ];
}

export async function writeComponentFiles(
  targetDir: string,
  files: GeneratedFile[]
): Promise<void> {
  await fs.mkdir(targetDir, { recursive: true });

  for (const file of files) {
    const fullPath = path.join(targetDir, file.path);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, file.content, "utf-8");
  }
}
```

---

## Implementation Order

### Phase 1: Template Infrastructure
1. Create `packages/cli/src/templates/` directory
2. Create `file-generator.ts` utility

### Phase 2: Convert Presets & Utilities (No CSS changes)
1. `presets/*.template.ts` - Pure data files
2. `theme-applier.template.ts`
3. `css-export.template.ts`
4. `use-theme-state.template.ts`

### Phase 3: Convert Components (CSS → Tailwind)
1. `trigger.template.ts` - Simple, good starting point
2. `mode-toggle.template.ts` - Simple button states
3. `radius-selector.template.ts`
4. `color-picker.template.ts`
5. `preset-selector.template.ts`
6. `font-selector.template.ts` - Dropdown complexity
7. `panel.template.ts` - Most complex, do last
8. `devtools.template.ts` - Wrapper
9. `index.template.ts` - Exports

### Phase 4: CLI Integration
1. Modify `init.ts` command
2. Modify `modify-layout.ts` utility
3. Update `doctor.ts` for new structure
4. Test on fresh Next.js project

---

## Critical Source Files

### Conversion Sources (devtools package)
| File | Notes |
|------|-------|
| `packages/devtools/src/styles.css` | CSS source for conversion |
| `packages/devtools/src/panel/index.tsx` | Most complex component |
| `packages/devtools/src/trigger.tsx` | Simple component example |
| `packages/devtools/src/presets/theme-presets.ts` | Pure data (no CSS) |
| `packages/devtools/src/hooks/use-theme-state.ts` | State logic (no CSS) |
| `packages/devtools/src/theme-applier.ts` | DOM manipulation (no CSS) |

### CLI Files to Modify
| File | Notes |
|------|-------|
| `packages/cli/src/commands/init.ts` | Main entry point |
| `packages/cli/src/utils/modify-layout.ts` | Layout modification |

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Path alias detection failures | Read components.json + fallback to `@/components/ui/previewcn` |
| User modifications break updates | Document "no update support" - users own the code |
| Tailwind class drift | Keep UI-specific utility classes in place; avoid removing previewcn-* hooks |

---

## Trade-offs

| Aspect | npm Package | shadcn-style |
|--------|-------------|--------------|
| Updates | Automatic via npm | Manual re-generation |
| Customization | Limited | Full source access |
| Setup friction | Lower (one command) | Same (one command, more files) |
| Debugging | Harder (node_modules) | Easier (source in project) |
| Style isolation | External CSS file | Inline Tailwind only |

---

## Checklist

- [x] Phase 1: Template infrastructure
  - [x] Create templates directory
  - [x] Create file-generator.ts
  - [x] Create path-resolver.ts
- [x] Phase 2: Presets & utilities
  - [x] colors.template.ts
  - [x] color-preset-specs.template.ts
  - [x] radius.template.ts
  - [x] fonts.template.ts
  - [x] theme-presets.template.ts
  - [x] theme-applier.template.ts
  - [x] css-export.template.ts
  - [x] use-theme-state.template.ts
- [x] Phase 3: Components
  - [x] trigger.template.ts
  - [x] mode-toggle.template.ts
  - [x] radius-selector.template.ts
  - [x] color-picker.template.ts
  - [x] preset-selector.template.ts
  - [x] font-selector.template.ts
  - [x] css-export-button.template.ts
  - [x] panel.template.ts
  - [x] devtools.template.ts
  - [x] index.template.ts
- [x] Phase 4: CLI integration
  - [x] Modify init.ts
  - [x] Modify modify-layout.ts
  - [x] Update doctor.ts
  - [x] Test on fresh project
