"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

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

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "mr-auto inline-flex min-h-[30px] cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border px-2.5 py-1.5 text-xs font-medium tracking-[0.01em] transition-all",
        copied
          ? "border-emerald-500 text-emerald-500"
          : isDisabled
            ? "cursor-not-allowed border-neutral-50/10 bg-neutral-800/90 text-neutral-50 opacity-50"
            : "border-neutral-50/10 bg-neutral-800/90 text-neutral-50 hover:border-neutral-50/20 hover:bg-neutral-800/95"
      )}
      disabled={isDisabled}
      aria-label={label}
      title={isDisabled ? "Select a theme first" : "Copy CSS to clipboard"}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      <span>{label}</span>
    </button>
  );
}
