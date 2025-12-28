"use client";

import { cn } from "@/lib/utils";

import { themePresets } from "./presets/theme-presets";

type PresetSelectorProps = {
  value: string | null;
  onChange: (preset: string) => void;
};

export function PresetSelector({ value, onChange }: PresetSelectorProps) {
  return (
    <div className="relative grid gap-2.5 rounded-xl border border-[oklch(1_0_0/0.08)] bg-[oklch(0.2_0.02_260/0.9)] p-3 shadow-[inset_0_1px_0_oklch(1_0_0/0.04)]">
      <span className="block text-xs font-semibold text-neutral-300">
        Presets
      </span>
      <div className="grid grid-cols-3 gap-2">
        {themePresets.map((preset) => {
          const isSelected = value === preset.name;
          // Use light mode primary color for preview
          const primaryColor = preset.colors.light.primary;
          const bgColor = preset.colors.light.background;

          return (
            <button
              key={preset.name}
              onClick={() => onChange(preset.name)}
              className={cn(
                "flex min-h-[56px] w-full cursor-pointer flex-col items-center gap-1.5 rounded-[10px] border p-2 text-[11px] font-medium transition-all duration-160 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[oklch(0.72_0.15_265)]",
                isSelected
                  ? "border-[oklch(0.72_0.15_265)] bg-[oklch(0.24_0.02_260/0.95)] shadow-[0_0_0_1px_oklch(0.72_0.15_265),0_10px_24px_oklch(0_0_0/0.35)]"
                  : "border-[oklch(1_0_0/0.08)] bg-[oklch(0.2_0.02_260/0.9)] text-[oklch(0.96_0_0)] shadow-[inset_0_1px_0_oklch(1_0_0/0.04)] hover:border-[oklch(1_0_0/0.18)] hover:bg-[oklch(0.24_0.02_260/0.95)]"
              )}
              aria-label={preset.label}
              aria-pressed={isSelected}
            >
              <div className="flex h-[18px] w-full overflow-hidden rounded border border-[oklch(1_0_0/0.08)]">
                <div
                  className="flex-1 border-r border-[oklch(0_0_0/0.1)]"
                  style={{ backgroundColor: bgColor }}
                />
                <div
                  className="flex-1"
                  style={{ backgroundColor: primaryColor }}
                />
              </div>
              <span className="text-[oklch(0.72_0_0)]">{preset.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
