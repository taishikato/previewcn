# previewcn

previewcn lets you preview different shadcn/ui themes **directly in your app** - not on pre-built demo components.

<div align="left">
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/taishikato/previewcn?style=for-the-badge&logo=github">
  <a href="https://x.com/taishik_">
    <img alt="X (formerly Twitter) URL" src="https://img.shields.io/twitter/url?url=https%3A%2F%2Fx.com%2Ftaishik_&style=for-the-badge&logo=x&label=%40taishik_&color=%2300000000" />
  </a>
</div>


https://github.com/user-attachments/assets/e7da81b9-bfbb-4fce-b249-faf45e9f870a

## Quick Start

```bash
# Run in your Next.js app directory:
# - plain Next.js: project root
# - Next.js with `src/`: run inside `src/`
# - monorepo: `cd` into the Next.js app package first
npx previewcn@latest

# Start your dev server
pnpm dev
```

That's it! A floating palette icon will appear in the bottom-right corner of your app.

### Manual Installation

If `npx previewcn@latest` doesn't work for your project (complex monorepo structure, custom configurations, etc.), sorry!

But hey - you can install it manually:

**1. Run the shadcn add command:**

```bash
npx -y shadcn@latest add -y https://www.previewcn.com/r/devtools.json --overwrite
```

**2. Add the devtools to your layout:**

Open your `layout.tsx` (usually `app/layout.tsx` or `src/app/layout.tsx`) and add:

```tsx
import { PreviewcnDevtools } from "@/components/ui/previewcn"; // add this line

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        {process.env.NODE_ENV === "development" && <PreviewcnDevtools />} {/* add this line too! */}
      </body>
    </html>
  );
}
```

## Requirements

- Next.js with App Router
- shadcn/ui configured in your project
- Tailwind CSS v4

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
