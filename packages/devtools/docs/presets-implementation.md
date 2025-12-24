# Presets Feature Implementation

## Overview

previewcnにプリセット機能を追加。プリセットは color, radius, font を一括で適用できるテーマセットです。

Tweakcn（Apache License 2.0）から Vercel, Supabase, Claude の3つのプリセットを移植しました。

## Source Reference

### Tweakcn Repository
- **Repository**: https://github.com/jnsahaj/tweakcn
- **License**: Apache License 2.0
- **Preset Data Location**: `utils/theme-presets.ts`
- **Type Definitions**: `types/theme.ts`

### How to Get Preset Data from Tweakcn

```bash
# Get all preset labels
curl -s "https://raw.githubusercontent.com/jnsahaj/tweakcn/main/utils/theme-presets.ts" | grep -i "label"

# Get specific preset data (e.g., "Supabase")
curl -s "https://raw.githubusercontent.com/jnsahaj/tweakcn/main/utils/theme-presets.ts" | grep -A 100 '"Supabase"'
```

## Implementation Details

### Files Created

| File | Purpose |
|------|---------|
| `src/presets/theme-presets.ts` | プリセット定義（colors, radius, font） |
| `src/panel/preset-selector.tsx` | プリセット選択UIコンポーネント |

### Files Modified

| File | Changes |
|------|---------|
| `src/theme-applier.ts` | `applyPreset`, `applyPresetColors`, `applyPresetFont` 追加。`applyTheme` が `preset` に対応 |
| `src/hooks/use-theme-state.ts` | `setPresetTheme` 関数を追加、`ThemeConfig` に `preset` フィールド追加 |
| `src/panel/index.tsx` | `PresetSelector` をパネルに追加 |
| `src/styles.css` | プリセットカードのスタイルを追加 |

## Data Structure

### ThemePreset Type

```typescript
type ThemePreset = {
  name: string;           // Internal identifier (e.g., "vercel")
  label: string;          // Display name (e.g., "Vercel")
  colors: {
    light: Record<string, string>;  // CSS variables for light mode
    dark: Record<string, string>;   // CSS variables for dark mode
  };
  radius: string;         // Border radius value (e.g., "0.5rem")
  font?: {                // Optional font configuration
    value: string;        // Font preset ID (e.g., "inter")
    fontFamily: string;   // CSS font-family value
    googleFontsUrl: string;
  };
};
```

### Required CSS Variables

Each preset must define the following CSS variables for both light and dark modes:

**Core Colors:**
- `background`, `foreground`
- `card`, `card-foreground`
- `popover`, `popover-foreground`
- `primary`, `primary-foreground`
- `secondary`, `secondary-foreground`
- `muted`, `muted-foreground`
- `accent`, `accent-foreground`
- `destructive`, `destructive-foreground`
- `border`, `input`, `ring`

**Chart Colors:**
- `chart-1`, `chart-2`, `chart-3`, `chart-4`, `chart-5`

**Sidebar Colors:**
- `sidebar`, `sidebar-foreground`
- `sidebar-primary`, `sidebar-primary-foreground`
- `sidebar-accent`, `sidebar-accent-foreground`
- `sidebar-border`, `sidebar-ring`

## Adding New Presets

### Step 1: Get Preset Data from Tweakcn

```bash
# Find available presets
curl -s "https://raw.githubusercontent.com/jnsahaj/tweakcn/main/utils/theme-presets.ts" | grep -i "label"

# Get specific preset (replace "PresetName" with actual name)
curl -s "https://raw.githubusercontent.com/jnsahaj/tweakcn/main/utils/theme-presets.ts" | grep -A 100 '"PresetName"'
```

### Step 2: Add to theme-presets.ts

```typescript
// In src/presets/theme-presets.ts
export const themePresets: ThemePreset[] = [
  // ... existing presets
  {
    name: "new-preset",
    label: "New Preset",
    colors: {
      light: {
        // Copy all CSS variables from Tweakcn
        background: "#ffffff",
        foreground: "#000000",
        // ... all other variables
      },
      dark: {
        // Copy all CSS variables from Tweakcn
        background: "#000000",
        foreground: "#ffffff",
        // ... all other variables
      },
    },
    radius: "0.5rem",
    font: {
      value: "font-id",
      fontFamily: '"Font Name", sans-serif',
      googleFontsUrl: "https://fonts.googleapis.com/css2?family=...",
    },
  },
];
```

### Step 3: Build and Test

```bash
pnpm build
pnpm dev
```

## Color Format

- **OKLCH**: Tweakcnの一部プリセット（Vercel等）はOKLCH形式
- **HEX**: 他の多くのプリセットはHEX形式

previewcnは両方の形式をサポートしています。Tweakcnのオリジナル形式をそのまま使用することを推奨します。

## UI Behavior

- プリセット選択時: `color`, `radius`, `font` を一括適用
- `darkMode`: 現在の設定を維持（変更しない）
- 個別設定変更時: プリセットの選択状態は維持
- 再読み込み/パネル再オープン時: `colorPreset` が `null` の場合は保存済み `preset` を適用
- `font` が未定義のプリセットは既存フォント設定を維持

## License Compliance

Tweakcnは Apache License 2.0 で公開されています。使用にあたり：
- ソースコードに帰属表示コメントを追加（`theme-presets.ts` の冒頭）
- 詳細: https://github.com/jnsahaj/tweakcn/blob/main/LICENSE
