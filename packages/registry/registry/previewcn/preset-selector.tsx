"use client";

import { cn } from "@/lib/utils";

import { themePresets } from "./presets/theme-presets";

type PresetSelectorProps = {
  value: string | null;
  onChange: (preset: string) => void;
};

export function PresetSelector({ value, onChange }: PresetSelectorProps) {
  return (
    <div className="relative grid gap-2.5 rounded-xl border border-neutral-50/10 bg-neutral-900 p-3">
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
                "flex min-h-[56px] w-full cursor-pointer flex-col items-center gap-1.5 rounded-[10px] border p-2 text-[11px] font-medium transition-all duration-160 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400",
                isSelected
                  ? "border-violet-400 bg-neutral-800/95 shadow-lg ring-1 ring-violet-400"
                  : "border-neutral-50/10 bg-neutral-800/90 text-neutral-50 hover:border-neutral-50/20 hover:bg-neutral-800/95"
              )}
              aria-label={preset.label}
              aria-pressed={isSelected}
            >
              <div className="flex h-[18px] w-full overflow-hidden rounded border border-neutral-50/10">
                <div
                  className="flex-1 border-r border-neutral-950/10"
                  style={{ backgroundColor: bgColor }}
                />
                <div
                  className="flex-1"
                  style={{ backgroundColor: primaryColor }}
                />
              </div>
              <span className="text-neutral-400">{preset.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
