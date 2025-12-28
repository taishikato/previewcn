# カスタムoklchクラスを標準Tailwindクラスに置き換える

## 概要
`packages/registry/registry/previewcn/` 内のUIコンポーネント（.tsxファイル）で使用されているカスタムoklchクラスを、Tailwindの標準クラスに置き換える。

## 対象ファイル（8ファイル）
1. `panel.tsx`
2. `trigger.tsx`
3. `color-picker.tsx`
4. `radius-selector.tsx`
5. `mode-toggle.tsx`
6. `preset-selector.tsx`
7. `font-selector.tsx`
8. `css-export-button.tsx`

**除外**: `presets/*.ts` ファイル（テーマ色の定義なのでoklchのまま維持）

---

## oklch → Tailwind マッピング

### ✅ 置き換え可能なパターン

| カスタムクラス | Tailwindクラス | 説明 |
|---|---|---|
| `text-[oklch(0.96_0_0)]` | `text-neutral-50` | 既にpanel.tsxで実施済み |
| `text-[oklch(0.72_0_0)]` | `text-neutral-400` | 薄いグレーテキスト |
| `border-[oklch(1_0_0/0.08)]` | `border-neutral-50/10` | 8%は標準にないので10%を使用 |
| `border-[oklch(1_0_0/0.12)]` | `border-neutral-50/10` | 同上 |
| `border-[oklch(1_0_0/0.18)]` | `border-neutral-50/20` | 18%は標準にないので20%を使用 |
| `border-[oklch(0_0_0/0.1)]` | `border-neutral-950/10` | 黒の10% |
| `bg-[oklch(0.2_0.02_260/0.9)]` | `bg-neutral-800/90` | メインの背景色 |
| `bg-[oklch(0.18_0.02_260)]` | `bg-neutral-900` | より暗い背景色 |
| `bg-[oklch(0.24_0.02_260/0.95)]` | `bg-neutral-800/95` | ホバー時の背景 |
| `from-[oklch(0.18_0.02_260)]` | `from-neutral-900` | グラデーション開始 |
| `shadow-[inset_0_1px_0_oklch(1_0_0/0.04)]` | `shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]` | inset shadow |
| `scrollbar-color:oklch(...)` | `[scrollbar-color:rgb(255_255_255/0.2)_transparent]` | スクロールバー |

### ユーザー決定事項

1. **アクセントカラー: `oklch(0.72_0.15_265)`** → `violet-400` に置き換え
2. **成功カラー: `oklch(0.72_0.17_142)`** → `emerald-500` に置き換え
3. **複雑なグラデーション背景** → `bg-neutral-900` にシンプル化
4. **複雑なボックスシャドウ** → Tailwind標準クラス（`shadow-lg`, `shadow-2xl`等）にシンプル化
5. **Radius selectorのグラデーション** → `from-neutral-200/45 to-neutral-500/20` に置き換え

---

## 実装手順

### Step 1: panel.tsx
- `border-[oklch(1_0_0/0.08)]` → `border-neutral-50/10`
- `text-[oklch(0.72_0_0)]` → `text-neutral-400`
- `hover:text-[oklch(0.96_0_0)]` → `hover:text-neutral-50`
- `hover:border-[oklch(1_0_0/0.08)]` → `hover:border-neutral-50/10`
- `hover:bg-[oklch(0.2_0.02_260/0.9)]` → `hover:bg-neutral-800/90`
- `bg-[oklch(0.2_0.02_260/0.9)]` → `bg-neutral-800/90`
- `from-[oklch(0.18_0.02_260)]` → `from-neutral-900`
- `focus-visible:outline-[oklch(0.72_0.15_265)]` → `focus-visible:outline-violet-400`
- `[scrollbar-color:oklch(1_0_0/0.2)_transparent]` → `[scrollbar-color:rgb(255_255_255/0.2)_transparent]`
- 複雑なグラデーション背景 → `bg-neutral-900`
- 複雑なシャドウ → `shadow-2xl`

### Step 2: trigger.tsx
- `border-[oklch(1_0_0/0.18)]` → `border-neutral-50/20`
- `text-[oklch(0.96_0_0)]` → `text-neutral-50`
- `hover:border-[oklch(1_0_0/0.28)]` → `hover:border-neutral-50/30`
- `focus-visible:outline-[oklch(0.72_0.15_265)]` → `focus-visible:outline-violet-400`
- `bg-[linear-gradient(...)]` → `bg-neutral-900`

### Step 3: color-picker.tsx
- コンテナ: `border-[oklch(1_0_0/0.08)]` → `border-neutral-50/10`
- コンテナ: `bg-[oklch(0.2_0.02_260/0.9)]` → `bg-neutral-800/90`
- `shadow-[inset_0_1px_0_oklch(1_0_0/0.04)]` → 削除（シンプル化）
- selected: `border-[oklch(0.72_0.15_265)]` → `border-violet-400`
- selected shadow → `shadow-lg ring-1 ring-violet-400`

### Step 4: radius-selector.tsx
- 同様のパターンを置き換え
- グラデーション: `from-[oklch(0.8_0_0/0.45)] to-[oklch(0.6_0_0/0.2)]` → `from-neutral-200/45 to-neutral-500/20`

### Step 5: mode-toggle.tsx
- 同様のパターンを置き換え
- inline style の boxShadow → 削除

### Step 6: preset-selector.tsx
- 同様のパターンを置き換え

### Step 7: font-selector.tsx
- 同様のパターンを置き換え
- ドロップダウンメニューの背景: `bg-[oklch(0.18_0.02_260)]` → `bg-neutral-900`

### Step 8: css-export-button.tsx
- 成功状態の色: `oklch(0.72_0.17_142)` → `text-emerald-500 border-emerald-500`
- 他のパターンを同様に置き換え
- inline style の boxShadow → 削除

---

## カスタムクラスが残る箇所

以下は標準Tailwindでは再現できないため、カスタムクラスを維持：

**なし** - すべて標準Tailwindクラスに置き換え可能
