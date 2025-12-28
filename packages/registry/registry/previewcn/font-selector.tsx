"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

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
    <div className="absolute top-[calc(100%+6px)] left-0 z-50 max-h-[220px] w-full animate-[previewcn-pop_0.14s_ease] overflow-y-auto rounded-xl border border-neutral-50/10 bg-neutral-900 p-1.5 shadow-lg">
      {fontPresets.map((font) => {
        const isSelected = value === font.value;
        return (
          <button
            key={font.value}
            onClick={() => onSelect(font.value)}
            className={cn(
              "flex w-full cursor-pointer items-center rounded-lg border border-transparent px-2 py-1.5 text-left text-xs text-neutral-50 transition-all duration-140 hover:bg-neutral-800/95 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-violet-400",
              isSelected && "border-violet-400 bg-violet-400/20"
            )}
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

  const handleToggle = () => setIsOpen((open) => !open);

  const handleSelect = (fontValue: string) => {
    onChange(fontValue);
    setIsOpen(false);
  };

  return (
    <div
      className={cn(
        "relative grid gap-2.5 rounded-xl border border-neutral-50/10 bg-neutral-800/90 p-3",
        isOpen ? "z-50" : "z-0"
      )}
    >
      <label className="block text-xs font-semibold text-neutral-300">
        Font
      </label>
      <div className="relative z-50">
        <button
          onClick={handleToggle}
          className="inline-flex min-h-[30px] w-full cursor-pointer items-center justify-between gap-1.5 rounded-[10px] border border-neutral-50/10 bg-neutral-800/90 px-2.5 py-1.5 text-xs font-medium tracking-[0.01em] text-neutral-50 transition-all duration-160 hover:border-neutral-50/20 hover:bg-neutral-800/95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
          aria-expanded={isOpen}
        >
          <span>{displayLabel}</span>
          <ChevronDownIcon />
        </button>

        {isOpen && <FontMenu value={value} onSelect={handleSelect} />}
      </div>
    </div>
  );
}
