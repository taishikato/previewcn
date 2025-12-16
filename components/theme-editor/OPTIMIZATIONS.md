# Theme Editor Optimizations

## Optimized CSS Variable Updates

### Problem

Previously, any theme change (color preset, radius, or dark mode) would send all CSS variables to the iframe via `postMessage`. This was inefficient since each type of change only affects a subset of variables.

### Solution

Implemented targeted message types for specific property changes:

| Change Type | Message Type | Payload |
|-------------|--------------|---------|
| Multiple changes | `APPLY_THEME` | All CSS variables + darkMode |
| Dark mode only | `TOGGLE_DARK_MODE` | `darkMode: boolean` |
| Radius only | `UPDATE_RADIUS` | `radius: string` |
| Color preset only | `UPDATE_COLORS` | Limited color variables (see below) |

**Color variables sent on theme color change** (matching shadcn/create behavior):
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--chart-1` through `--chart-5`
- `--sidebar-primary`, `--sidebar-primary-foreground`

### Benefits

- **Reduced payload size**: Each change type sends only the necessary variables
- **Cleaner separation**: Each type of change has its own optimized code path
- **Consistent pattern**: All single-property changes are optimized

### Files Changed

- `lib/theme-presets.ts` - Added `generateColorVars` function
- `components/theme-receiver.tsx` - Added message handlers for each type
- `components/theme-editor/use-theme-editor.ts` - Added optimized send functions and detection logic
