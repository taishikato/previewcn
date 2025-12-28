"use client";

import { cn } from "@/lib/utils";

import { radiusPresets } from "./presets/radius";

type RadiusSelectorProps = {
  value: string | null;
  onChange: (radius: string) => void;
};

export function RadiusSelector({ value, onChange }: RadiusSelectorProps) {
  return (
    <div className="relative grid gap-2.5 rounded-xl border border-[oklch(1_0_0/0.08)] bg-[oklch(0.2_0.02_260/0.9)] p-3 shadow-[inset_0_1px_0_oklch(1_0_0/0.04)]">
      <label className="block text-xs font-semibold text-neutral-300">
        Radius
      </label>
      <div className="grid grid-cols-3 gap-2">
        {radiusPresets.map((preset) => {
          const isSelected = value === preset.value;

          return (
            <button
              key={preset.name}
              onClick={() => onChange(preset.value)}
              className={cn(
                "inline-flex min-h-[52px] w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[10px] border px-2.5 py-1.5 text-xs font-medium tracking-[0.01em] transition-all duration-160",
                isSelected
                  ? "border-[oklch(0.72_0.15_265)] bg-[oklch(0.24_0.02_260/0.95)] shadow-[0_0_0_1px_oklch(0.72_0.15_265),0_10px_24px_oklch(0_0_0/0.35)]"
                  : "border-[oklch(1_0_0/0.08)] bg-[oklch(0.2_0.02_260/0.9)] text-[oklch(0.96_0_0)] shadow-[inset_0_1px_0_oklch(1_0_0/0.04)] hover:border-[oklch(1_0_0/0.18)] hover:bg-[oklch(0.24_0.02_260/0.95)]"
              )}
              title={preset.label}
            >
              <span
                className="h-[18px] w-7 border border-[oklch(1_0_0/0.12)] bg-linear-to-b from-[oklch(0.8_0_0/0.45)] to-[oklch(0.6_0_0/0.2)]"
                style={{ borderRadius: preset.value }}
              />
              <span className="text-[11px] text-[oklch(0.72_0_0)]">
                {preset.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
