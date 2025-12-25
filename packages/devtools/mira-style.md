# Mira Style Notes for PreviewCN Devtools

Goal: match the "Mira" look from the shadcn/create page with compact typography, low-contrast surfaces, and precise borders.

## Visual DNA
- Low-contrast dark surfaces with a subtle cool (blue) bias.
- Thin 1px borders and soft inset highlights instead of heavy shadows.
- Compact typography (12-13px) with uppercase, letter-spaced section labels.
- Small, confident radii (8-12px) and consistent spacing between controls.
- Hover and selected states rely on gentle lift, slight brightening, and a single accent ring.

## Devtools Tokens (scoped)
These variables live on `.previewcn-panel`/`.previewcn-trigger` in `packages/devtools/src/styles.css`.

- `--pcn-bg`: main panel background.
- `--pcn-bg-elevated`: header/footer + elevated layers.
- `--pcn-surface`: default card surface.
- `--pcn-surface-strong`: hover/selected surface.
- `--pcn-border`: hairline borders.
- `--pcn-border-strong`: emphasized borders.
- `--pcn-text`: primary text color.
- `--pcn-muted`: secondary text color.
- `--pcn-accent`: selection/active border.
- `--pcn-accent-soft`: selection background.
- `--pcn-shadow`: panel shadow.
- `--pcn-shadow-sm`: popover shadow.
- `--pcn-inset`: subtle inset highlight.
- `--pcn-radius`, `--pcn-radius-sm`, `--pcn-radius-xs`: consistent rounding.

## Typography
- Use the app font if provided: `var(--font-sans, ...)`.
- Base size around 12.5px with relaxed line height.
- Labels: 10-11px, uppercase, 0.12-0.16em tracking, medium weight.

## Surfaces and Borders
- Panels use layered gradients for depth instead of flat fills.
- Cards (`.previewcn-surface`) use a single 1px border plus a faint inset highlight.
- Selected state adds a single accent ring and a soft glow, not a heavy outline.

## Controls
- Base control class: `.previewcn-control` (compact height, subtle border, soft hover).
- Selected state: `.previewcn-control--selected`.
- Option rows: `.previewcn-option`, `.previewcn-option--selected`.
- Icon-only buttons reuse `.previewcn-control` with `.previewcn-icon-btn`.

## Motion
- Panel slide-in: 250-300ms.
- Buttons and swatches: 140-180ms for hover/active.
- Dropdowns: quick pop (scale + fade).
- Disable motion for `prefers-reduced-motion`.
