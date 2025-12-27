"use client";

import { cn } from "@/lib/utils";

import { colorPresets } from "./presets/colors";

type ColorPickerProps = {
  value: string | null;
  onChange: (colorPreset: string) => void;
};

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="relative grid gap-2.5 rounded-xl border border-[oklch(1_0_0/0.08)] bg-[oklch(0.2_0.02_260/0.9)] p-3 shadow-[inset_0_1px_0_oklch(1_0_0/0.04)]">
      <label className="block text-[10.5px] font-semibold tracking-[0.16em] text-[oklch(0.72_0_0)]">
        Theme
      </label>
      <div className="grid grid-cols-6 gap-2">
        {colorPresets.map((preset) => {
          const isSelected = value === preset.name;
          const primaryColor = preset.colors.light.primary;

          return (
            <button
              key={preset.name}
              onClick={() => onChange(preset.name)}
              className={cn(
                "aspect-square cursor-pointer rounded-lg border transition-all duration-160 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[oklch(0.72_0.15_265)]",
                isSelected
                  ? "border-[oklch(0.72_0.15_265)] shadow-[0_0_0_1px_oklch(0.72_0.15_265),0_10px_20px_oklch(0_0_0/0.35)]"
                  : "border-[oklch(1_0_0/0.08)] shadow-[inset_0_1px_0_oklch(1_0_0/0.04)] hover:border-[oklch(1_0_0/0.18)]"
              )}
              style={{ backgroundColor: primaryColor }}
              aria-label={preset.label}
              title={preset.label}
            />
          );
        })}
      </div>
    </div>
  );
}
