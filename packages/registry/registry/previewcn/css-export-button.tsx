"use client";

import { useEffect, useRef, useState } from "react";

import { copyToClipboard, generateExportCss } from "./css-export";
import type { ThemeConfig } from "./theme-applier";

type CssExportButtonProps = {
  config: ThemeConfig;
};

function CopyIcon() {
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
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckIcon() {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function CssExportButton({ config }: CssExportButtonProps) {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const exportCss = generateExportCss(config);
  const isDisabled = !exportCss;
  const label = copied ? "Copied!" : "Copy CSS";

  const handleCopy = async () => {
    if (!exportCss) return;

    const success = await copyToClipboard(exportCss);

    if (success) {
      setCopied(true);
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
      resetTimerRef.current = setTimeout(() => setCopied(false), 2000);
    }
  };

  const baseClass =
    "inline-flex items-center justify-center gap-1.5 min-h-[30px] px-2.5 py-1.5 mr-auto rounded-[10px] border text-xs font-medium tracking-[0.01em] cursor-pointer transition-all duration-[160ms]";

  const stateClass = copied
    ? "border-[oklch(0.72_0.17_142)] text-[oklch(0.72_0.17_142)]"
    : isDisabled
      ? "opacity-50 cursor-not-allowed border-[oklch(1_0_0/0.08)] bg-[oklch(0.2_0.02_260/0.9)] text-[oklch(0.96_0_0)]"
      : "border-[oklch(1_0_0/0.08)] bg-[oklch(0.2_0.02_260/0.9)] text-[oklch(0.96_0_0)] hover:bg-[oklch(0.24_0.02_260/0.95)] hover:border-[oklch(1_0_0/0.18)]";

  return (
    <button
      onClick={handleCopy}
      className={`${baseClass} ${stateClass}`}
      style={{ boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.04)" }}
      disabled={isDisabled}
      aria-label={label}
      title={isDisabled ? "Select a theme first" : "Copy CSS to clipboard"}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      <span>{label}</span>
    </button>
  );
}
