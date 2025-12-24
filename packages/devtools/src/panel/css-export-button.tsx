"use client";

import { useState } from "react";

import type { ThemeConfig } from "../theme-applier";
import { copyToClipboard, generateExportCss } from "../utils/css-export";

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

  const exportCss = generateExportCss(config);
  const isDisabled = !exportCss;
  const label = copied ? "Copied!" : "Copy CSS";

  const handleCopy = async () => {
    if (!exportCss) return;

    const success = await copyToClipboard(exportCss);

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const buttonClass = `previewcn-control previewcn-copy-btn${copied ? " previewcn-copy-btn--success" : ""}${isDisabled ? " previewcn-copy-btn--disabled" : ""}`;

  return (
    <button
      onClick={handleCopy}
      className={buttonClass}
      disabled={isDisabled}
      aria-label={label}
      title={isDisabled ? "Select a theme first" : "Copy CSS to clipboard"}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      <span>{label}</span>
    </button>
  );
}
