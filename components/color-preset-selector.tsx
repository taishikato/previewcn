"use client";

import { colorPresets } from "@/lib/theme-presets";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ColorPresetSelectorProps = {
  value: string | null;
  onChange: (value: string) => void;
  darkMode?: boolean | null;
};

export function ColorPresetSelector({
  value,
  onChange,
  darkMode,
}: ColorPresetSelectorProps) {
  // Default to light mode when darkMode is null or undefined
  const mode = darkMode === true ? "dark" : "light";

  return (
    <div className="grid grid-cols-2 gap-2">
      {colorPresets.map((preset) => {
        const displayColor = preset.colors[mode].primary;
        const isSelected = value === preset.name;

        return (
          <Button
            key={preset.name}
            onClick={() => onChange(preset.name)}
            aria-label={preset.label}
            aria-pressed={isSelected}
            className={cn("justify-start gap-x-2", isSelected && "bg-accent")}
            variant="ghost"
            title={preset.label}
            size="lg"
          >
            <span
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-full"
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
          </Button>
        );
      })}
    </div>
  );
}
