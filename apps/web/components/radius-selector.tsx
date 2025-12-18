"use client";

import { radiusPresets } from "@/lib/theme-presets";
import { Button } from "@/components/ui/button";

type RadiusSelectorProps = {
  value: string | null;
  onChange: (value: string) => void;
};

export function RadiusSelector({ value, onChange }: RadiusSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {radiusPresets.map((preset) => {
        const isSelected = value === preset.value;

        return (
          <Button
            key={preset.name}
            onClick={() => onChange(preset.value)}
            variant={isSelected ? "default" : "outline"}
            size="lg"
            style={{ borderRadius: preset.value }}
          >
            {preset.label}
          </Button>
        );
      })}
    </div>
  );
}
