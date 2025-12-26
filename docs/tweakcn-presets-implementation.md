# Tweakcn Presets Implementation

## Overview

This document describes the implementation of theme presets imported from [Tweakcn](https://github.com/jnsahaj/tweakcn) into previewcn.

## Purpose

To expand previewcn's theme preset library by importing all available presets from Tweakcn, giving users more design options out of the box.

## Reference

- **Source Repository**: https://github.com/jnsahaj/tweakcn
- **License**: Apache License 2.0
- **Presets File**: https://github.com/jnsahaj/tweakcn/blob/main/utils/theme-presets.ts

## Changes Made

### 1. Theme Presets (`packages/cli/src/templates/presets/theme-presets.template.ts`)

Added 39 new theme presets from Tweakcn:

| # | Name | Label |
|---|------|-------|
| 1 | modern-minimal | Modern Minimal |
| 2 | violet-bloom | Violet Bloom |
| 3 | t3-chat | T3 Chat |
| 4 | twitter | Twitter |
| 5 | mocha-mousse | Mocha Mousse |
| 6 | bubblegum | Bubblegum |
| 7 | amethyst-haze | Amethyst Haze |
| 8 | notebook | Notebook |
| 9 | doom-64 | Doom 64 |
| 10 | catppuccin | Catppuccin |
| 11 | graphite | Graphite |
| 12 | perpetuity | Perpetuity |
| 13 | kodama-grove | Kodama Grove |
| 14 | cosmic-night | Cosmic Night |
| 15 | tangerine | Tangerine |
| 16 | quantum-rose | Quantum Rose |
| 17 | nature | Nature |
| 18 | bold-tech | Bold Tech |
| 19 | elegant-luxury | Elegant Luxury |
| 20 | amber-minimal | Amber Minimal |
| 21 | neo-brutalism | Neo Brutalism |
| 22 | solar-dusk | Solar Dusk |
| 23 | claymorphism | Claymorphism |
| 24 | cyberpunk | Cyberpunk |
| 25 | pastel-dreams | Pastel Dreams |
| 26 | clean-slate | Clean Slate |
| 27 | caffeine | Caffeine |
| 28 | ocean-breeze | Ocean Breeze |
| 29 | retro-arcade | Retro Arcade |
| 30 | midnight-bloom | Midnight Bloom |
| 31 | candyland | Candyland |
| 32 | northern-lights | Northern Lights |
| 33 | vintage-paper | Vintage Paper |
| 34 | sunset-horizon | Sunset Horizon |
| 35 | starry-night | Starry Night |
| 36 | darkmatter | Darkmatter |
| 37 | mono | Mono |
| 38 | soft-pop | Soft Pop |
| 39 | sage-garden | Sage Garden |

**Total presets**: 42 (3 previously implemented + 39 new)

Previously implemented presets:
- vercel
- supabase
- claude

### 2. Font Presets (`packages/cli/src/templates/presets/fonts.template.ts`)

Added 9 new Google Fonts to support the new theme presets:

| Font | Value | Type |
|------|-------|------|
| Plus Jakarta Sans | plus-jakarta-sans | sans-serif |
| Poppins | poppins | sans-serif |
| Open Sans | open-sans | sans-serif |
| Montserrat | montserrat | sans-serif |
| Oxanium | oxanium | sans-serif |
| Libre Baskerville | libre-baskerville | serif |
| Merriweather | merriweather | serif |
| Architects Daughter | architects-daughter | cursive |
| Antic | antic | sans-serif |

**Total fonts**: 19 (10 previously implemented + 9 new)

## Implementation Details

### CSS Variables Preserved

All CSS variables from Tweakcn presets are preserved, including:

- **Color variables**: background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring
- **Chart variables**: chart-1 through chart-5
- **Sidebar variables**: sidebar, sidebar-foreground, sidebar-primary, sidebar-accent, sidebar-border, sidebar-ring
- **Typography variables**: font-sans, font-serif, font-mono
- **Shadow variables**: shadow-color, shadow-opacity, shadow-blur, shadow-spread, shadow-offset-x, shadow-offset-y
- **Layout variables**: letter-spacing, spacing

### Color Format Preservation

Color values are preserved in their original format from Tweakcn:
- OKLCH colors remain as OKLCH (e.g., `oklch(0.985 0.002 247.839)`)
- HEX colors remain as HEX (e.g., `#ffffff`)

### Type Conversion

Tweakcn uses `styles.light/dark` while previewcn uses `colors.light/dark`. The conversion maps:

```
Tweakcn                    → previewcn
─────────────────────────────────────────
preset.styles.light        → preset.colors.light
preset.styles.dark         → preset.colors.dark
preset.styles.light.radius → preset.radius (top-level)
```

### Font Mapping

Tweakcn references fonts via CSS `font-sans` variable. These are mapped to Google Fonts URLs:

```typescript
// Example mapping
"Plus Jakarta Sans" → {
  value: "plus-jakarta-sans",
  fontFamily: '"Plus Jakarta Sans", sans-serif',
  googleFontsUrl: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
}
```

### Font Consistency Note

In previewcn, the canonical source of truth for font metadata is `packages/cli/src/templates/presets/fonts.template.ts`.

When a theme preset also includes an explicit `font` object (e.g. `{ value, fontFamily, googleFontsUrl }`), keep its `fontFamily` consistent with the corresponding entry in `fontPresets`. This prevents mismatches where a serif font might be labeled as `sans-serif` in one place and `serif` in another.

As part of this update, we fixed the following preset font metadata to use `serif`:
- Merriweather (`merriweather`)
- Libre Baskerville (`libre-baskerville`)

### Skipped Fonts

Geist fonts (Geist Sans, Geist Mono) are not available on Google Fonts and were skipped. Presets using Geist fonts fall back to the default font.

## How to Add More Presets

To add additional presets from Tweakcn in the future:

1. Check the latest presets at https://github.com/jnsahaj/tweakcn/blob/main/utils/theme-presets.ts
2. Convert the preset format:
   - `styles.light/dark` → `colors.light/dark`
   - Extract `radius` to top-level property
3. Add any new fonts to `fonts.template.ts` with Google Fonts URLs
4. Add the preset to the `themePresets` array in `theme-presets.template.ts`
5. Run `pnpm build` to verify

## Testing

After adding presets:

```bash
pnpm build
pnpm dev
```

Then verify the new presets appear in the theme selector UI.
