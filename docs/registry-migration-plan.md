# Plan: previewcn を shadcn Registry に移行

## 概要

`npx previewcn` コマンドの内部で `npx shadcn add https://previewcn.com/r/devtools.json` を呼び出し、shadcn registry経由でコンポーネントを配布する。

## 現状

- CLI (`packages/cli/`) がテンプレート文字列を直接生成してユーザープロジェクトにファイルを書き込む
- 24個のテンプレートファイル（`.template.ts`）が存在
- layout.tsxを修正してPreviewcnDevtoolsを注入

## 目標アーキテクチャ

```
previewcn/
├── apps/web/                      # Next.js app (docs + registry hosting)
│   ├── public/r/                  # Built registry JSON (output)
│   └── ...
├── packages/cli/                  # Simplified CLI
│   └── src/
│       ├── commands/init.ts       # Calls `npx shadcn add`
│       └── utils/modify-layout.ts # Kept: layout modification
└── packages/registry/             # NEW: Registry source + build
    ├── registry.json              # Registry definition
    └── registry/previewcn/        # Source components (actual TSX files)
```

---

## 実装ステップ

### Step 1: apps/web の作成（ホスティング）

Next.js + shadcn のWebアプリを作成:

```bash
mkdir -p apps/web
cd apps/web
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir=false
npx shadcn@latest init
```

**目的:**
- ドキュメントページの提供
- `public/r/` 配下の静的ファイルとして registry JSON を配信（例: `https://previewcn.com/r/devtools.json`）

**必要なファイル:**
- `apps/web/app/page.tsx` - ドキュメントページ

### Step 2: packages/registry の作成（registryソース）

registry の「ソース（TS/TSX）」と「registry.json」を Web アプリから分離して管理する:

```bash
mkdir -p packages/registry/registry/previewcn
```

**必要なファイル:**
- `packages/registry/registry.json` - registry定義
- `packages/registry/registry/previewcn/*.tsx` - ソースコンポーネント

### Step 3: テンプレートをソースファイルに変換

`packages/cli/src/templates/*.template.ts` の文字列を実際のTSX/TSファイルに変換:

| Template | Output |
|----------|--------|
| `devtools.template.ts` | `packages/registry/registry/previewcn/devtools.tsx` |
| `trigger.template.ts` | `packages/registry/registry/previewcn/trigger.tsx` |
| `panel.template.ts` | `packages/registry/registry/previewcn/panel.tsx` |
| `color-picker.template.ts` | `packages/registry/registry/previewcn/color-picker.tsx` |
| `preset-selector.template.ts` | `packages/registry/registry/previewcn/preset-selector.tsx` |
| `radius-selector.template.ts` | `packages/registry/registry/previewcn/radius-selector.tsx` |
| `font-selector.template.ts` | `packages/registry/registry/previewcn/font-selector.tsx` |
| `mode-toggle.template.ts` | `packages/registry/registry/previewcn/mode-toggle.tsx` |
| `css-export-button.template.ts` | `packages/registry/registry/previewcn/css-export-button.tsx` |
| `theme-applier.template.ts` | `packages/registry/registry/previewcn/theme-applier.ts` |
| `use-theme-state.template.ts` | `packages/registry/registry/previewcn/use-theme-state.ts` |
| `css-export.template.ts` | `packages/registry/registry/previewcn/css-export.ts` |
| `presets/*.template.ts` | `packages/registry/registry/previewcn/presets/*.ts` |
| `index.template.ts` | `packages/registry/registry/previewcn/index.ts` |

### Step 4: registry.json の作成

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "previewcn",
  "homepage": "https://previewcn.com",
  "items": [
    {
      "name": "devtools",
      "type": "registry:component",
      "title": "PreviewCN Devtools",
      "description": "Real-time shadcn/ui theme editor",
      "files": [
        { "path": "registry/previewcn/index.ts", "type": "registry:lib", "target": "components/ui/previewcn/index.ts" },
        { "path": "registry/previewcn/devtools.tsx", "type": "registry:component", "target": "components/ui/previewcn/devtools.tsx" },
        { "path": "registry/previewcn/panel.tsx", "type": "registry:component", "target": "components/ui/previewcn/panel.tsx" },
        { "path": "registry/previewcn/trigger.tsx", "type": "registry:component", "target": "components/ui/previewcn/trigger.tsx" },
        { "path": "registry/previewcn/color-picker.tsx", "type": "registry:component", "target": "components/ui/previewcn/color-picker.tsx" },
        { "path": "registry/previewcn/preset-selector.tsx", "type": "registry:component", "target": "components/ui/previewcn/preset-selector.tsx" },
        { "path": "registry/previewcn/radius-selector.tsx", "type": "registry:component", "target": "components/ui/previewcn/radius-selector.tsx" },
        { "path": "registry/previewcn/font-selector.tsx", "type": "registry:component", "target": "components/ui/previewcn/font-selector.tsx" },
        { "path": "registry/previewcn/mode-toggle.tsx", "type": "registry:component", "target": "components/ui/previewcn/mode-toggle.tsx" },
        { "path": "registry/previewcn/css-export-button.tsx", "type": "registry:component", "target": "components/ui/previewcn/css-export-button.tsx" },
        { "path": "registry/previewcn/theme-applier.ts", "type": "registry:lib", "target": "components/ui/previewcn/theme-applier.ts" },
        { "path": "registry/previewcn/use-theme-state.ts", "type": "registry:lib", "target": "components/ui/previewcn/use-theme-state.ts" },
        { "path": "registry/previewcn/css-export.ts", "type": "registry:lib", "target": "components/ui/previewcn/css-export.ts" },
        { "path": "registry/previewcn/presets/index.ts", "type": "registry:lib", "target": "components/ui/previewcn/presets/index.ts" },
        { "path": "registry/previewcn/presets/colors.ts", "type": "registry:lib", "target": "components/ui/previewcn/presets/colors.ts" },
        { "path": "registry/previewcn/presets/color-preset-specs.ts", "type": "registry:lib", "target": "components/ui/previewcn/presets/color-preset-specs.ts" },
        { "path": "registry/previewcn/presets/radius.ts", "type": "registry:lib", "target": "components/ui/previewcn/presets/radius.ts" },
        { "path": "registry/previewcn/presets/fonts.ts", "type": "registry:lib", "target": "components/ui/previewcn/presets/fonts.ts" },
        { "path": "registry/previewcn/presets/theme-presets.ts", "type": "registry:lib", "target": "components/ui/previewcn/presets/theme-presets.ts" }
      ]
    }
  ]
}
```

**重要**:
- `target` プロパティで `components/ui/previewcn/` にファイルを配置
- tsx/ts ファイルは分割して管理しつつ、配布単位は `devtools` 1つにまとめられる（`files` に複数ファイルを列挙する）
- `registryDependencies` は「別registry item」に依存させる時だけ使う（今回のように同一パッケージ内の分割ファイルには不要）

### Step 5: ビルドスクリプトの設定（生成物は apps/web/public/r/ へ）

`packages/registry/package.json`（例）:
```json
{
  "scripts": {
    "registry:build": "shadcn build"
  }
}
```

Output: `packages/registry/public/r/*.json`（shadcn build のデフォルト）

次に `apps/web/public/r/` にコピーしてホスティングする（turbo の pipeline or 簡単なコピーコマンドでOK）:

```bash
rm -rf apps/web/public/r
mkdir -p apps/web/public
cp -R packages/registry/public/r apps/web/public/r
```

### Step 6: CLI の修正

**`packages/cli/src/commands/init.ts`** を修正:

```typescript
import { execa } from "execa";

const REGISTRY_URL = "https://previewcn.com/r";

export async function initCommand(options: InitOptions) {
  // Step 1-3: Detect project (unchanged)

  // Step 4: Install via shadcn (NEW)
  await execa("npx", [
    "-y",
    "shadcn@latest", "add",
    "-y",
    `${REGISTRY_URL}/devtools.json`,
    "--overwrite"
  ], { cwd, stdio: "inherit" });

  // Step 5: Modify layout (unchanged - shadcn doesn't do this)
  await addDevtoolsToLayout(layoutPath, importPath);
}
```

**削除するファイル:**
- `packages/cli/src/templates/` (全て)
- `packages/cli/src/utils/file-generator.ts`

**維持するファイル:**
- `packages/cli/src/utils/modify-layout.ts`
- `packages/cli/src/utils/detect-project.ts`
- `packages/cli/src/utils/path-resolver.ts`

### Step 7: Vercelデプロイ設定

`apps/web/vercel.json`:
```json
{
  "buildCommand": "pnpm -C packages/registry registry:build && rm -rf apps/web/public/r && mkdir -p apps/web/public && cp -R packages/registry/public/r apps/web/public/r && pnpm -C apps/web build"
}
```

ドメイン: `previewcn.com` を設定

---

## Critical Files

### 修正するファイル
- `packages/cli/src/commands/init.ts` - shadcn add を呼び出すように変更
- `packages/cli/package.json` - 不要な依存を削除

### 新規作成するファイル
- `apps/web/` - Next.js webアプリ全体
- `apps/web/registry.json` - registry定義
- `apps/web/registry/previewcn/*.tsx` - ソースコンポーネント (14ファイル)
- `apps/web/registry/previewcn/presets/*.ts` - プリセット (6ファイル)

### 削除するファイル
- `packages/cli/src/templates/` - 全テンプレートファイル (15ファイル)
- `packages/cli/src/utils/file-generator.ts`

---

## ユーザー体験

### Before
```bash
npx previewcn
# → CLIがテンプレートを直接生成
```

### After
```bash
npx previewcn
# → 内部で `npx shadcn add https://previewcn.com/r/devtools.json` を実行
# → shadcnがコンポーネントを生成
# → CLIがlayout.tsxを修正
```

### Alternative (直接shadcn経由)
```bash
npx shadcn add https://previewcn.com/r/devtools.json
# → コンポーネントのみインストール（layout修正なし）
```
