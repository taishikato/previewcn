"use client";

import { colorPresets } from "@/lib/theme-presets";
import { cn } from "@/lib/utils";

type ColorPresetSelectorProps = {
  value: string;
  onChange: (value: string) => void;
  showLabels?: boolean;
  darkMode?: boolean;
};

export function ColorPresetSelector({
  value,
  onChange,
  showLabels = false,
  darkMode = false,
}: ColorPresetSelectorProps) {
  const mode = darkMode ? "dark" : "light";

  if (showLabels) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {colorPresets.map((preset) => {
          // Use OKLCH directly - modern browsers support it natively
          const displayColor = preset.colors[mode].primary;
          const isSelected = value === preset.name;

          return (
            <button
              key={preset.name}
              type="button"
              onClick={() => onChange(preset.name)}
              aria-label={preset.label}
              aria-pressed={isSelected}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all",
                isSelected
                  ? "bg-accent ring-2 ring-primary"
                  : "hover:bg-accent/50"
              )}
              title={preset.label}
            >
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full",
                  isSelected && "ring-2 ring-offset-1 ring-foreground"
                )}
                style={{ backgroundColor: displayColor }}
              >
                {isSelected && (
                  <svg
                    className="size-3 text-white drop-shadow-md"
                    aria-hidden="true"
                    focusable="false"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </span>
              <span className="font-medium">{preset.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {colorPresets.map((preset) => {
        // Use OKLCH directly - modern browsers support it natively
        const displayColor = preset.colors[mode].primary;
        const isSelected = value === preset.name;

        return (
          <button
            key={preset.name}
            type="button"
            onClick={() => onChange(preset.name)}
            aria-label={preset.label}
            aria-pressed={isSelected}
            className={cn(
              "flex size-10 items-center justify-center rounded-full border-2 transition-all",
              isSelected
                ? "border-foreground ring-2 ring-foreground ring-offset-2"
                : "border-transparent hover:border-muted-foreground/50"
            )}
            style={{ backgroundColor: displayColor }}
            title={preset.label}
          >
            {isSelected && (
              <svg
                className="size-5 text-white drop-shadow-md"
                aria-hidden="true"
                focusable="false"
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
