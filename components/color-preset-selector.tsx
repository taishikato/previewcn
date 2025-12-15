"use client";

import { colorPresets } from "@/lib/theme-presets";
import { cn } from "@/lib/utils";

type ColorPresetSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

// Convert OKLCH to a display-friendly hex approximation
function oklchToDisplayColor(oklch: string): string {
  // Extract values from oklch string
  const match = oklch.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (!match) return "#888888";

  const [, l, c, h] = match.map(Number);

  // Simple approximation for display
  // This is not a perfect conversion but good enough for preview
  const lightness = Math.round(l * 100);
  const chroma = c;
  const hue = h;

  // Convert to HSL-like values for CSS
  const s = Math.min(100, chroma * 200);

  return `hsl(${hue}, ${s}%, ${lightness}%)`;
}

export function ColorPresetSelector({
  value,
  onChange,
}: ColorPresetSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {colorPresets.map((preset) => {
        const primaryColor = preset.colors.light.primary;
        const displayColor = oklchToDisplayColor(primaryColor);
        const isSelected = value === preset.name;

        return (
          <button
            key={preset.name}
            onClick={() => onChange(preset.name)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
              isSelected
                ? "border-foreground ring-2 ring-foreground ring-offset-2"
                : "border-transparent hover:border-muted-foreground/50"
            )}
            style={{ backgroundColor: displayColor }}
            title={preset.label}
          >
            {isSelected && (
              <svg
                className="h-5 w-5 text-white drop-shadow-md"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
