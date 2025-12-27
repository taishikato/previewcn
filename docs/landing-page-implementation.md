# Landing Page Implementation Plan for previewcn

## Overview
Create a dark, minimal landing page for previewcn at `apps/web/app/page.tsx`.

## Design Requirements
- **Style**: Dark + Minimal (Vercel-inspired)
- **Video**: Simple rounded corners
- **Theme**: Dark by default

## Page Structure

```
┌─────────────────────────────────────────────────────┐
│                    HERO SECTION                      │
│  ┌───────────────────────────────────────────────┐  │
│  │  Logo/Title: previewcn                        │  │
│  │  Tagline: Real-time theme editor for shadcn/ui│  │
│  │                                               │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │  $ npx previewcn                   [📋] │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────┤
│                   DEMO VIDEO                         │
│  ┌───────────────────────────────────────────────┐  │
│  │                                               │  │
│  │         previewcn-demo.mp4                    │  │
│  │         (autoplay, loop, muted)               │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────┤
│                 SOCIAL PROOF                         │
│                                                     │
│   ┌──────────────────┐  ┌──────────────────┐       │
│   │ Tweet: @shadcn   │  │ Tweet: @aidenybai│       │
│   │ ID: 200133...    │  │ ID: 200106...    │       │
│   └──────────────────┘  └──────────────────┘       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Implementation Steps

### Step 1: Install Dependencies
```bash
# Install react-tweet (core dependency)
pnpm add react-tweet --filter web
```

### Step 2: Create Landing Page Components

#### 2.1 Hero Section (`apps/web/components/hero.tsx`)
- Large title: "previewcn"
- Subtitle: "Real-time theme editor for shadcn/ui"
- Description: Brief value proposition
- Command box with copy functionality: `npx previewcn`
- GitHub link button (using shadcn Button component)

#### 2.2 Demo Video Section (`apps/web/components/demo-video.tsx`)
- Video player with rounded corners
- Autoplay, loop, muted
- Uses `/previewcn-demo.mp4`

#### 2.3 Social Proof Section (`apps/web/components/social-proof.tsx`)
- Two Tweet Cards side by side (client-side fetch)
- Tweet IDs:
  - @shadcn: `2001339628746662345`
  - @aidenybai: `2001066897912279419`

### Step 3: Update Main Page (`apps/web/app/page.tsx`)
- Replace current ComponentExample with landing page sections
- Compose Hero, DemoVideo, and SocialProof components

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `apps/web/components/hero.tsx` | Create | Hero section with command |
| `apps/web/components/demo-video.tsx` | Create | Video player component |
| `apps/web/components/social-proof.tsx` | Create | Tweet cards section |
| `apps/web/app/page.tsx` | Modify | Compose landing page |
| `apps/web/components/ui/tweet-card.tsx` | Create | Shared tweet UI building blocks |
| `apps/web/components/ui/client-tweet-card.tsx` | Create | Client-side tweet fetch/render |

## Technical Notes

### Tweet Card Usage
```tsx
import { ClientTweetCard } from "@/components/ui/client-tweet-card"

// Client component (recommended to avoid build-time fetch)
<ClientTweetCard id="2001339628746662345" />
```

### Command Copy Component
```tsx
// Use existing Button component with onClick handler
// Copy to clipboard: navigator.clipboard.writeText("npx previewcn")
```

### Video Element
```tsx
<video
  autoPlay
  loop
  muted
  playsInline
  className="w-full max-w-4xl rounded-2xl border border-border"
>
  <source src="/previewcn-demo.mp4" type="video/mp4" />
</video>
```

## Design Tokens (from existing globals.css)
- Background: `oklch(0.145 0 0)` (dark)
- Border: `oklch(0.269 0 0)`
- Muted foreground: `oklch(0.708 0 0)`
- Radius: `0.625rem` (base)
