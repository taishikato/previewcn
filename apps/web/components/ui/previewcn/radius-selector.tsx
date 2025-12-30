"use client";

import { cn } from "@/lib/utils";

import { radiusPresets } from "./presets/radius";

type RadiusSelectorProps = {
  value: string | null;
  onChange: (radius: string) => void;
};

export function RadiusSelector({ value, onChange }: RadiusSelectorProps) {
  return (
    <div className="relative grid gap-2.5 rounded-lg border border-neutral-50/10 bg-neutral-900 p-3">
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
                "inline-flex min-h-[52px] w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium tracking-[0.01em] transition-all",
                isSelected
                  ? "border-violet-400 bg-neutral-800/95 ring-1 ring-violet-400"
                  : "border-neutral-50/10 bg-neutral-800/90 text-neutral-50 hover:border-neutral-50/20 hover:bg-neutral-800/95"
              )}
              title={preset.label}
            >
              <span
                className="h-[18px] w-7 border border-neutral-50/10 bg-linear-to-b from-neutral-200/45 to-neutral-500/20"
                style={{ borderRadius: preset.value }}
              />
              <span className="text-[11px] text-neutral-400">
                {preset.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
