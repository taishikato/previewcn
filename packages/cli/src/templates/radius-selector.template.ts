export function generateRadiusSelectorTemplate(): string {
  return `"use client";

import { radiusPresets } from "./presets/radius";

type RadiusSelectorProps = {
  value: string | null;
  onChange: (radius: string) => void;
};

const baseButtonClass =
  "inline-flex flex-col items-center justify-center gap-1.5 w-full min-h-[52px] px-2.5 py-1.5 rounded-[10px] border text-xs font-medium tracking-[0.01em] cursor-pointer transition-all duration-[160ms]";

const defaultButtonClass =
  "border-[oklch(1_0_0/0.08)] bg-[oklch(0.2_0.02_260/0.9)] text-[oklch(0.96_0_0)] hover:bg-[oklch(0.24_0.02_260/0.95)] hover:border-[oklch(1_0_0/0.18)]";

const selectedButtonClass =
  "bg-[oklch(0.24_0.02_260/0.95)] border-[oklch(0.72_0.15_265)] shadow-[0_0_0_1px_oklch(0.72_0.15_265),0_10px_24px_oklch(0_0_0/0.35)]";

export function RadiusSelector({ value, onChange }: RadiusSelectorProps) {
  return (
    <div
      className="relative grid gap-2.5 p-3 rounded-xl border border-[oklch(1_0_0/0.08)] bg-[oklch(0.2_0.02_260/0.9)]"
      style={{ boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.04)" }}
    >
      <label className="block text-[10.5px] font-semibold tracking-[0.16em] uppercase text-[oklch(0.72_0_0)]">
        Radius
      </label>
      <div className="grid grid-cols-3 gap-2">
        {radiusPresets.map((preset) => {
          const isSelected = value === preset.value;

          return (
            <button
              key={preset.name}
              onClick={() => onChange(preset.value)}
              className={\`\${baseButtonClass} \${isSelected ? selectedButtonClass : defaultButtonClass}\`}
              style={isSelected ? undefined : { boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.04)" }}
              title={preset.label}
            >
              <span
                className="w-7 h-[18px] border border-[oklch(1_0_0/0.12)]"
                style={{
                  borderRadius: preset.value,
                  background:
                    "linear-gradient(180deg, oklch(0.8 0 0 / 0.45), oklch(0.6 0 0 / 0.2))",
                }}
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
`;
}
