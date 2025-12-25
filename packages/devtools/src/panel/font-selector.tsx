"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";

import { fontPresets } from "../presets/fonts";

type FontSelectorProps = {
  value: string | null;
  onChange: (font: string) => void;
};

function ChevronDownIcon() {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function FontSelector({ value, onChange }: FontSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedFont = fontPresets.find((f) => f.value === value);
  const displayLabel = selectedFont?.label ?? "Select font...";

  return (
    <div
      className={cn(
        "previewcn-section previewcn-surface",
        isOpen && "previewcn-section--overlay"
      )}
    >
      <label className="previewcn-label">Font</label>
      <div className="previewcn-select-wrapper">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="previewcn-select-trigger previewcn-control"
          aria-expanded={isOpen}
        >
          <span>{displayLabel}</span>
          <ChevronDownIcon />
        </button>

        {isOpen && (
          <div className="previewcn-select-dropdown">
            {fontPresets.map((font) => (
              <button
                key={font.value}
                onClick={() => {
                  onChange(font.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "previewcn-select-option previewcn-option",
                  value === font.value && "previewcn-option--selected"
                )}
              >
                {font.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
