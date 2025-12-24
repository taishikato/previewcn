"use client";

import { useEffect } from "react";

import { useThemeState } from "../hooks/use-theme-state";
import { applyTheme } from "../theme-applier";
import { ColorPicker } from "./color-picker";
import { CssExportButton } from "./css-export-button";
import { FontSelector } from "./font-selector";
import { ModeToggle } from "./mode-toggle";
import { PresetSelector } from "./preset-selector";
import { RadiusSelector } from "./radius-selector";

type PanelProps = {
  onClose: () => void;
};

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function RotateCcwIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

export default function Panel({ onClose }: PanelProps) {
  const {
    config,
    setColorPreset,
    setRadius,
    setDarkMode,
    setFont,
    setPresetTheme,
    resetTheme,
  } = useThemeState();

  // Apply stored theme only when the panel opens
  useEffect(() => {
    applyTheme(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="previewcn-panel">
      {/* Header */}
      <div className="previewcn-header">
        <div className="previewcn-title">
          <span className="previewcn-logo">previewcn</span>
        </div>
        <button
          onClick={onClose}
          className="previewcn-control previewcn-control--ghost previewcn-icon-btn previewcn-close-btn"
          aria-label="Close"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Content */}
      <div className="previewcn-content">
        <PresetSelector value={config.preset} onChange={setPresetTheme} />
        <ColorPicker value={config.colorPreset} onChange={setColorPreset} />
        <RadiusSelector value={config.radius} onChange={setRadius} />
        <FontSelector value={config.font} onChange={setFont} />
        <ModeToggle value={config.darkMode} onChange={setDarkMode} />
      </div>

      {/* Footer */}
      <div className="previewcn-footer">
        <CssExportButton config={config} />
        <button
          onClick={resetTheme}
          className="previewcn-control previewcn-control--ghost previewcn-reset-btn"
        >
          <RotateCcwIcon />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
