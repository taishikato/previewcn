"use client";

import { useCallback, useEffect, useRef } from "react";

import { useThemeState } from "../hooks/use-theme-state";
import { applyTheme } from "../theme-applier";
import { ColorPicker } from "./color-picker";
import { FontSelector } from "./font-selector";
import { ModeToggle } from "./mode-toggle";
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
    resetTheme,
  } = useThemeState();

  // Apply stored theme only when the panel is opened (user-initiated).
  const didApplyOnOpenRef = useRef(false);
  useEffect(() => {
    if (didApplyOnOpenRef.current) return;
    didApplyOnOpenRef.current = true;
    applyTheme(config);
  }, [config]);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Close when clicking outside the panel
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="previewcn-backdrop" onClick={handleBackdropClick}>
      <div className="previewcn-panel">
        {/* Header */}
        <div className="previewcn-header">
          <div className="previewcn-title">
            <span className="previewcn-logo">PreviewCN</span>
            <span className="previewcn-badge">DEV</span>
          </div>
          <button
            onClick={onClose}
            className="previewcn-close-btn"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="previewcn-content">
          <ColorPicker value={config.colorPreset} onChange={setColorPreset} />
          <RadiusSelector value={config.radius} onChange={setRadius} />
          <FontSelector value={config.font} onChange={setFont} />
          <ModeToggle value={config.darkMode} onChange={setDarkMode} />
        </div>

        {/* Footer */}
        <div className="previewcn-footer">
          <button onClick={resetTheme} className="previewcn-reset-btn">
            <RotateCcwIcon />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
