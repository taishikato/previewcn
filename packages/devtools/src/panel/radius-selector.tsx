"use client";

import { radiusPresets } from "../presets/radius";

type RadiusSelectorProps = {
  value: string | null;
  onChange: (radius: string) => void;
};

export function RadiusSelector({ value, onChange }: RadiusSelectorProps) {
  return (
    <div className="previewcn-section previewcn-surface">
      <label className="previewcn-label">Radius</label>
      <div className="previewcn-radius-grid">
        {radiusPresets.map((preset) => {
          const isSelected = value === preset.value;

          return (
            <button
              key={preset.name}
              onClick={() => onChange(preset.value)}
              className={`previewcn-radius-btn previewcn-control ${isSelected ? "previewcn-control--selected" : ""}`}
              title={preset.label}
            >
              <span
                className="previewcn-radius-preview"
                style={{ borderRadius: preset.value }}
              />
              <span className="previewcn-radius-label">{preset.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
