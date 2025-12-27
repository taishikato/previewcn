"use client";

import { useState } from "react";

import { fontPresets } from "./presets/fonts";

type FontSelectorProps = {
  value: string | null;
  onChange: (font: string) => void;
};

type FontMenuProps = {
  value: string | null;
  onSelect: (fontValue: string) => void;
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

function FontMenu({ value, onSelect }: FontMenuProps) {
  return (
    <div
      className="absolute top-[calc(100%+6px)] left-0 z-20 w-full p-1.5 rounded-xl bg-[oklch(0.18_0.02_260)] border border-[oklch(1_0_0/0.08)] max-h-[220px] overflow-y-auto"
      style={{
        boxShadow: "0 10px 26px oklch(0 0 0 / 0.45)",
        animation: "previewcn-pop 0.14s ease",
      }}
    >
      {fontPresets.map((font) => {
        const isSelected = value === font.value;
        return (
          <button
            key={font.value}
            onClick={() => onSelect(font.value)}
            className={`flex w-full items-center rounded-lg border border-transparent px-2 py-1.5 text-xs text-left text-[oklch(0.96_0_0)] cursor-pointer transition-all duration-[140ms] hover:bg-[oklch(0.24_0.02_260/0.95)] focus-visible:outline-2 focus-visible:outline-[oklch(0.72_0.15_265)] focus-visible:outline-offset-1 ${
              isSelected
                ? "border-[oklch(0.72_0.15_265)] bg-[oklch(0.72_0.15_265/0.18)]"
                : ""
            }`}
          >
            {font.label}
          </button>
        );
      })}
    </div>
  );
}

export function FontSelector({ value, onChange }: FontSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedFont = fontPresets.find((f) => f.value === value);
  const displayLabel = selectedFont?.label ?? "Select font...";

  const handleToggle = () => {
    setIsOpen((open) => !open);
  };

  const handleSelect = (fontValue: string) => {
    onChange(fontValue);
    setIsOpen(false);
  };

  return (
    <div
      className={`relative grid gap-2.5 p-3 rounded-xl border border-[oklch(1_0_0/0.08)] bg-[oklch(0.2_0.02_260/0.9)] ${isOpen ? "z-30" : "z-0"}`}
      style={{ boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.04)" }}
    >
      <label className="block text-[10.5px] font-semibold tracking-[0.16em] uppercase text-[oklch(0.72_0_0)]">
        Font
      </label>
      <div className="relative z-[1]">
        <button
          onClick={handleToggle}
          className="inline-flex items-center justify-between gap-1.5 w-full min-h-[30px] px-2.5 py-1.5 rounded-[10px] border border-[oklch(1_0_0/0.08)] bg-[oklch(0.2_0.02_260/0.9)] text-[oklch(0.96_0_0)] text-xs font-medium tracking-[0.01em] cursor-pointer transition-all duration-[160ms] hover:bg-[oklch(0.24_0.02_260/0.95)] hover:border-[oklch(1_0_0/0.18)] focus-visible:outline-2 focus-visible:outline-[oklch(0.72_0.15_265)] focus-visible:outline-offset-2"
          style={{ boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.04)" }}
          aria-expanded={isOpen}
        >
          <span>{displayLabel}</span>
          <ChevronDownIcon />
        </button>

        {isOpen && (
          <FontMenu value={value} onSelect={handleSelect} />
        )}
      </div>
    </div>
  );
}
