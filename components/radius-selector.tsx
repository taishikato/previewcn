"use client";

import { radiusPresets } from "@/lib/theme-presets";
import { cn } from "@/lib/utils";

type RadiusSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function RadiusSelector({ value, onChange }: RadiusSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {radiusPresets.map((preset) => {
        const isSelected = value === preset.value;

        return (
          <button
            key={preset.name}
            onClick={() => onChange(preset.value)}
            className={cn(
              "flex h-10 min-w-[60px] items-center justify-center border px-3 text-sm transition-all",
              isSelected
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background hover:bg-muted"
            )}
            style={{ borderRadius: preset.value }}
          >
            {preset.label}
          </button>
        );
      })}
    </div>
  );
}
