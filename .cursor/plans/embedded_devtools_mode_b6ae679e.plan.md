---
name: Embedded Devtools Mode
overview: "`@previewcn/devtools` パッケージを作成し、ターゲットアプリ内にDevTools風のテーマエディターUIを埋め込む。iframeモードと並行してオプションとして提供する。"
todos:
  - id: devtools-pkg-setup
    content: Create packages/devtools/ with package.json, tsconfig, tsup config, postcss config
    status: pending
  - id: devtools-trigger
    content: Implement Trigger component (corner icon button)
    status: pending
  - id: devtools-panel
    content: Implement Panel component with color/font/radius/mode editors
    status: pending
    dependencies:
      - devtools-trigger
  - id: devtools-theme-applier
    content: Implement theme-applier.ts for direct DOM application
    status: pending
  - id: devtools-main-component
    content: Implement PreviewcnDevtools with lazy-load and dev guard
    status: pending
    dependencies:
      - devtools-trigger
      - devtools-panel
      - devtools-theme-applier
  - id: devtools-css-build
    content: Configure Tailwind + PostCSS to build styles.css
    status: pending
    dependencies:
      - devtools-pkg-setup
  - id: cli-init-devtools-flag
    content: Add --devtools flag to init command
    status: pending
    dependencies:
      - devtools-main-component
  - id: cli-install-devtools
    content: Implement auto-install of @previewcn/devtools as devDependency
    status: pending
    dependencies:
      - cli-init-devtools-flag
  - id: cli-layout-devtools
    content: Add devtools import and component to layout.tsx
    status: pending
    dependencies:
      - cli-install-devtools
  - id: turbo-devtools
    content: Add devtools package to turbo.json build pipeline
    status: pending
---

# Embedded Devtools Mode Implementation

## Goal

ターゲットアプリ内に DevTools 風のテーマエディターを埋め込み、iframe/2サーバー構成の摩擦を解消する。

- 画面端に小さなアイコン（DevTools風）
- クリックでオーバーレイ/パネルを開く
- iframeなし、CSP問題なし、単一devサーバー
- production-safe（dev-onlyガード）

## Key Decisions

| 決定事項 | 選択 ||---------|------|| 配布方式 | **npmパッケージ**（`@previewcn/devtools`）、ビルド済みCSS同梱 || ターゲット側編集 | `layout.tsx` のみ（globals.css / tailwind設定は**いじらない**） || 既存iframeモード | **残す**（devtoolsは追加オプション） || init連携 | `npx previewcn init --devtools` でインストール+セットアップ |

## Architecture

```mermaid
flowchart LR
    subgraph TargetApp[Target App]
        Layout[layout.tsx]
        Devtools[PreviewcnDevtools]
        Trigger[Trigger Icon]
        Panel[Editor Panel]
    end
    
    Layout --> Devtools
    Devtools --> Trigger
    Trigger -->|click| Panel
    Panel -->|apply theme| DOM[document.documentElement]
```



## Implementation

### 1) Create `packages/devtools/` package

```javascript
packages/devtools/
├── src/
│   ├── index.ts              # Export PreviewcnDevtools
│   ├── devtools.tsx          # Main component (lazy-loads panel)
│   ├── trigger.tsx           # Corner icon button
│   ├── panel/
│   │   ├── index.tsx         # Editor panel (color, font, radius, mode)
│   │   ├── color-picker.tsx
│   │   ├── font-selector.tsx
│   │   ├── radius-slider.tsx
│   │   └── mode-toggle.tsx
│   ├── theme-applier.ts      # Apply theme to DOM (no postMessage)
│   └── styles.css            # Tailwind source (built at package build time)
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── postcss.config.js         # For building CSS
```

**Key points:**

- `tsup` + `postcss` でビルド時にTailwindを処理 → `dist/styles.css` を生成
- CSS変数（`var(--primary)` 等）を使用してshadcnテーマと連携
- `PreviewcnDevtools` は `NODE_ENV === "development"` ガード付き

### 2) Devtools component structure

```tsx
// packages/devtools/src/devtools.tsx
"use client";

import { lazy, Suspense, useState } from "react";
import { Trigger } from "./trigger";

const Panel = lazy(() => import("./panel"));

export function PreviewcnDevtools() {
  // Production guard
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const [open, setOpen] = useState(false);

  return (
    <>
      <Trigger onClick={() => setOpen(true)} />
      {open && (
        <Suspense fallback={null}>
          <Panel onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
```



### 3) Update CLI `init` command

[`packages/cli/src/commands/init.ts`](packages/cli/src/commands/init.ts) に `--devtools` オプションを追加:

- `--devtools` フラグが指定された場合:

1. `@previewcn/devtools` を devDependency としてインストール
2. `layout.tsx` に import 2行 + コンポーネント1行を追加
```tsx
// Added to layout.tsx by init --devtools
import "@previewcn/devtools/styles.css";
import { PreviewcnDevtools } from "@previewcn/devtools";

// Inside body:
{process.env.NODE_ENV === "development" && <PreviewcnDevtools />}
```




### 4) Theme application (no postMessage)

現在のreceiver方式（postMessage）ではなく、**直接DOMに適用**:

```ts
// packages/devtools/src/theme-applier.ts
export function applyTheme(config: ThemeConfig) {
  const root = document.documentElement;
  
  // Apply CSS variables
  Object.entries(config.cssVars).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
  
  // Apply dark mode
  if (config.darkMode !== undefined) {
    root.classList.toggle("dark", config.darkMode);
  }
}
```



### 5) Build pipeline

- `packages/devtools/package.json`:
- `exports`: `./styles.css` と `.` (component) を分けてexport
- `build`: `tsup` (TSX) + `postcss` (CSS)
- Turborepo: `packages/devtools` を追加

## Files to Create/Modify

| File | Action ||------|--------|| `packages/devtools/` | **Create** - 新規パッケージ || `packages/cli/src/commands/init.ts` | **Modify** - `--devtools` オプション追加 || `packages/cli/src/utils/modify-layout.ts` | **Modify** - devtools追加ロジック || `pnpm-workspace.yaml` | Already includes `packages/*` || `turbo.json` | **Modify** - devtools build追加 |

## Migration Path

1. **Phase 1**: `@previewcn/devtools` パッケージ作成、基本UI実装