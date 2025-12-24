# CSS Export 機能の実装ドキュメント

## 概要

devtools パネルに「Copy CSS」ボタンを追加し、現在のテーマ設定から shadcn/ui 互換の CSS 変数をクリップボードにコピーできる機能を実装した。

## 目的

- ユーザーが previewcn でテーマをカスタマイズした後、そのテーマを自分の Next.js + shadcn/ui プロジェクトの `globals.css` にコピー＆ペーストできるようにする
- PRD Section 1.6 の要件を満たす

## 実装ファイル

### 新規作成

| ファイル | 説明 |
|---------|------|
| `src/utils/css-export.ts` | CSS生成・クリップボードコピーのユーティリティ関数 |
| `src/panel/css-export-button.tsx` | Copy CSS ボタンコンポーネント |

### 編集

| ファイル | 変更内容 |
|---------|---------|
| `src/panel/index.tsx` | CssExportButton をインポートしてフッターに配置 |
| `src/styles.css` | `.previewcn-copy-btn` 関連スタイルを追加 |

## 実装詳細

### 1. css-export.ts

主要な関数:

```typescript
// ThemeConfig から CSS 文字列を生成
export function generateExportCss(config: ThemeConfig): string | null

// クリップボードにコピー（フォールバック対応）
export async function copyToClipboard(text: string): Promise<boolean>
```

`generateExportCss()` が `null` を返す場合はテーマ未選択として扱い、ボタンを無効化する。

**カラー取得の優先順位:**
1. `config.colorPreset` → `getColorPreset()` で取得
2. `config.preset` → `getThemePreset()` で取得
3. 両方 null → `null` を返す（ボタン無効化）

**radius 取得の優先順位:**
1. `config.radius`
2. `preset.radius`（テーマプリセットから）
3. デフォルト `"0.5rem"`

### 2. css-export-button.tsx

- `useState` で `copied` 状態を管理
- テーマ未選択時は `disabled` 属性でボタンを無効化
- コピー成功時は 2秒間緑色で「Copied!」表示
- Copy/Check アイコンは Lucide スタイルの SVG

### 3. 出力形式

```css
:root {
  --radius: 0.5rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... all variables */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... all dark mode variables */
}
```

## 参照したコード

### theme-applier.ts

`serializeCssVars()` 関数を参考に `formatCssVars()` を実装。差異点:
- `theme-applier.ts`: 1行にまとめる（DOM 適用用）
- `css-export.ts`: インデント付きで整形（人間が読む用）

```typescript
// theme-applier.ts (参考)
function serializeCssVars(cssVars: Record<string, string>): string {
  return Object.entries(cssVars)
    .map(([key, value]) => `--${key}: ${value};`)
    .join(" ");
}

// css-export.ts (新実装)
function formatCssVars(cssVars: Record<string, string>, indent = "  "): string {
  return Object.entries(cssVars)
    .map(([key, value]) => `${indent}--${key}: ${value};`)
    .join("\n");
}
```

### applyTheme() の優先順位ロジック

`theme-applier.ts:169-192` の `applyTheme()` 関数のカラー取得ロジックを参考にした。

## tweakcn との関連

このプロジェクト自体が tweakcn を参照している（`src/presets/theme-presets.ts` のコメント参照）。CSS Export 機能は tweakcn の類似機能を参考にしつつ、previewcn の構造に合わせて実装。

tweakcn リポジトリ: https://github.com/jnsahaj/tweakcn

## スタイル

```css
.previewcn-copy-btn {
  gap: 6px;
  font-size: 12px;
  margin-right: auto; /* Reset ボタンと分離 */
}

.previewcn-copy-btn--success {
  border-color: oklch(0.72 0.17 142); /* 緑色 */
  color: oklch(0.72 0.17 142);
}

.previewcn-copy-btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## 将来の拡張案

1. **フォント情報の出力**: Google Fonts URL をコメントとして含める
2. **カスタムフォーマット**: CSS Variables 以外の形式（Tailwind config など）
3. **部分エクスポート**: カラーのみ、radius のみなど選択的エクスポート

## テスト方法

```bash
pnpm dev
```

1. devtools パネルを開く
2. テーマプリセットまたはカラーを選択
3. 「Copy CSS」ボタンをクリック
4. テキストエディタに貼り付けて CSS が正しく出力されていることを確認
