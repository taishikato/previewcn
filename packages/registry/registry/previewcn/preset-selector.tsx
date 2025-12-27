"use client";

import { themePresets } from "./presets/theme-presets";

type PresetSelectorProps = {
  value: string | null;
  onChange: (preset: string) => void;
};

const baseCardClass =
  "flex flex-col items-center gap-1.5 w-full min-h-[56px] p-2 rounded-[10px] border text-[11px] font-medium cursor-pointer transition-all duration-[160ms] focus-visible:outline-2 focus-visible:outline-[oklch(0.72_0.15_265)] focus-visible:outline-offset-2";

const defaultCardClass =
  "border-[oklch(1_0_0/0.08)] bg-[oklch(0.2_0.02_260/0.9)] text-[oklch(0.96_0_0)] hover:bg-[oklch(0.24_0.02_260/0.95)] hover:border-[oklch(1_0_0/0.18)]";

const selectedCardClass =
  "bg-[oklch(0.24_0.02_260/0.95)] border-[oklch(0.72_0.15_265)] shadow-[0_0_0_1px_oklch(0.72_0.15_265),0_10px_24px_oklch(0_0_0/0.35)]";

export function PresetSelector({ value, onChange }: PresetSelectorProps) {
  return (
    <div
      className="relative grid gap-2.5 rounded-xl border border-[oklch(1_0_0/0.08)] bg-[oklch(0.2_0.02_260/0.9)] p-3"
      style={{ boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.04)" }}
    >
      <span className="block text-[10.5px] font-semibold tracking-[0.16em] text-[oklch(0.72_0_0)] uppercase">
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
              className={`${baseCardClass} ${isSelected ? selectedCardClass : defaultCardClass}`}
              style={
                isSelected
                  ? undefined
                  : { boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.04)" }
              }
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
