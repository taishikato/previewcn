"use client";

import { cn } from "@/lib/utils";

import { colorPresets } from "./presets/colors";

type ColorPickerProps = {
  value: string | null;
  onChange: (colorPreset: string) => void;
};

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="relative grid gap-2.5 rounded-lg border border-neutral-50/10 bg-neutral-900 p-3">
      <label className="block text-xs font-semibold text-neutral-300">
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
                "aspect-square cursor-pointer rounded-md border transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400",
                isSelected
                  ? "border-violet-400 shadow-lg ring-1 ring-violet-400"
                  : "border-neutral-50/10 hover:border-neutral-50/20"
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
