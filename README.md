<img width="1200" alt="previewcn" src="https://github.com/user-attachments/assets/b2d7b49e-82ef-4b1b-8fe4-9cca5c30c226" />

# previewcn

previewcn lets you preview different shadcn/ui themes **directly in your app** - not on pre-built demo components.

https://github.com/user-attachments/assets/e7da81b9-bfbb-4fce-b249-faf45e9f870a



## Quick Start

```bash
# Run in your Next.js app directory:
# - plain Next.js: project root
# - Next.js with `src/`: run inside `src/`
# - monorepo: `cd` into the Next.js app package first
npx previewcn init

# Start your dev server
pnpm dev
```

That's it! A floating palette icon will appear in the bottom-right corner of your app.

## Requirements

- Next.js with App Router
- shadcn/ui configured in your project
- Tailwind CSS v4

## Features

- **Theme Presets** - One-click application of complete themes (Vercel, Supabase, Claude)
- **Color Presets** - 18 beautiful color palettes using OKLCH color space
- **Border Radius** - From sharp corners to fully rounded
- **Font Selection** - 10 Google Fonts presets
- **Light/Dark Mode** - Toggle and preview both modes
- **CSS Export** - Copy generated CSS variables for your `globals.css`
- **Development Only** - Automatically tree-shaken in production builds

## How It Works

previewcn follows the [shadcn/ui](https://ui.shadcn.com) philosophy - instead of installing an npm package, it installs component files into your project via the shadcn registry:

```
components/ui/previewcn/
├── index.ts              # Main export
├── devtools.tsx          # Dev-only wrapper
├── trigger.tsx           # Floating action button
├── panel.tsx             # Theme editor panel
├── color-picker.tsx      # Color preset selector
├── preset-selector.tsx   # Theme preset selector
├── radius-selector.tsx   # Border radius selector
├── font-selector.tsx     # Font selector
├── mode-toggle.tsx       # Light/Dark toggle
├── css-export-button.tsx # CSS export button
├── theme-applier.ts      # DOM manipulation logic
├── use-theme-state.ts    # State management hook
├── css-export.ts         # CSS generation utility
└── presets/              # Theme data
    ├── index.ts
    ├── colors.ts
    ├── color-preset-specs.ts
    ├── theme-presets.ts
    ├── fonts.ts
    └── radius.ts
```

The CLI also adds the devtools component to your `layout.tsx`:

```tsx
import { PreviewcnDevtools } from "@/components/ui/previewcn";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        {process.env.NODE_ENV === "development" && <PreviewcnDevtools />}
      </body>
    </html>
  );
}
```

The component only renders in development mode and is completely removed from production builds.

Under the hood, init runs:

```bash
npx -y shadcn@latest add -y https://www.previewcn.com/r/devtools.json --overwrite
```

## CLI Commands

```bash
# Initialize previewcn (default command)
npx previewcn

# Or explicitly
npx previewcn init

# Check setup status
npx previewcn doctor
```

## Usage

1. **Pick a preset** - Apply a complete theme (colors + radius + font) with one click
2. **Customize colors** - Choose from 18 color presets
3. **Adjust radius** - From none to full rounded corners
4. **Select font** - Pick from 10 Google Fonts
5. **Toggle mode** - Preview light and dark themes
6. **Export CSS** - Copy the generated CSS and paste into your `globals.css`

## Troubleshooting

### Theme editor not appearing?

```bash
npx previewcn doctor
```

This checks:
- Next.js App Router detection
- previewcn component files exist
- `layout.tsx` references `PreviewcnDevtools` (import and/or JSX)

### Theme changes not applying?

1. Check browser DevTools console for errors
2. Verify you're in development mode (`pnpm dev`)
3. Check if CSS variables are being set on `:root`

## Contributing

PRs are welcome! This is a monorepo using pnpm workspaces and Turborepo.

```bash
# Install dependencies
pnpm install

# Build the CLI
pnpm build

# Run linting
pnpm lint
```

## Credits

- Theme presets adapted from [tweakcn](https://github.com/jnsahaj/tweakcn) (Apache 2.0)
