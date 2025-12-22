# @previewcn/devtools

Embedded devtools for PreviewCN - real-time shadcn/ui theme preview inside your app.

## Features

- 🎨 **In-app theme editor** - No iframe, no separate server
- 🎯 **DevTools-style UI** - Click the palette icon to open
- 💾 **Persistent settings** - Theme choices saved in localStorage
- 🚀 **Production-safe** - Automatically excluded in production builds
- ⚡ **Lazy-loaded** - Panel only loads when opened

## Installation

```bash
# Using pnpm
pnpm add -D @previewcn/devtools

# Using npm
npm install -D @previewcn/devtools

# Using yarn
yarn add -D @previewcn/devtools
```

Or use the CLI:

```bash
npx previewcn init --devtools
```

## Usage

Add to your `app/layout.tsx`:

```tsx
import "@previewcn/devtools/styles.css";
import { PreviewcnDevtools } from "@previewcn/devtools";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {process.env.NODE_ENV === "development" && <PreviewcnDevtools />}
        {children}
      </body>
    </html>
  );
}
```

## How It Works

1. A small palette icon appears in the bottom-right corner of your app
2. Click it to open the theme editor panel
3. The theme is applied only after user interaction (opening the panel / changing settings)
4. Changes are applied directly to your app in real-time
5. Settings are persisted in localStorage

## License

MIT

