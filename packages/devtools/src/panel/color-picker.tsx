"use client";

import { colorPresets } from "../presets/colors";

type ColorPickerProps = {
  value: string | null;
  onChange: (colorPreset: string) => void;
};

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="previewcn-section previewcn-surface">
      <label className="previewcn-label">Color</label>
      <div className="previewcn-color-grid">
        {colorPresets.map((preset) => {
          const isSelected = value === preset.name;
          const primaryColor = preset.colors.light.primary;

          return (
            <button
              key={preset.name}
              onClick={() => onChange(preset.name)}
              className={`previewcn-color-swatch ${isSelected ? "previewcn-color-swatch--selected" : ""}`}
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
