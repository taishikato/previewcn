"use client";

import { fontPresets } from "@/lib/font-presets";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type FontSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function FontSelector({ value, onChange }: FontSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {fontPresets.map((preset) => {
        const isSelected = value === preset.value;

        return (
          <Button
            key={preset.value}
            onClick={() => onChange(preset.value)}
            aria-label={preset.label}
            aria-pressed={isSelected}
            className={cn("justify-start gap-x-2", isSelected && "bg-accent")}
            variant="ghost"
            title={preset.label}
            size="lg"
          >
            <span
              className="truncate font-medium"
              style={{ fontFamily: preset.fontFamily }}
            >
              {preset.label}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
