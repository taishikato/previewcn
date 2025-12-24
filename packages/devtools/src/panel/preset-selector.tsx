"use client";

import { themePresets } from "../presets/theme-presets";

type PresetSelectorProps = {
  value: string | null;
  onChange: (preset: string) => void;
};

export function PresetSelector({ value, onChange }: PresetSelectorProps) {
  return (
    <div className="previewcn-section previewcn-surface">
      <span className="previewcn-label">Presets</span>
      <div className="previewcn-preset-grid">
        {themePresets.map((preset) => {
          const isSelected = value === preset.name;
          // Use light mode primary color for preview
          const primaryColor = preset.colors.light.primary;
          const bgColor = preset.colors.light.background;

          return (
            <button
              key={preset.name}
              onClick={() => onChange(preset.name)}
              className={`previewcn-preset-card ${
                isSelected ? "previewcn-preset-card--selected" : ""
              }`}
              aria-label={preset.label}
              aria-pressed={isSelected}
            >
              <div className="previewcn-preset-preview">
                <div
                  className="previewcn-preset-color previewcn-preset-color--bg"
                  style={{ backgroundColor: bgColor }}
                />
                <div
                  className="previewcn-preset-color previewcn-preset-color--primary"
                  style={{ backgroundColor: primaryColor }}
                />
              </div>
              <span className="previewcn-preset-label">{preset.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
