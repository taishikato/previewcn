"use client";

import { useEffect, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { ColorPicker } from "./color-picker";
import { CssExportButton } from "./css-export-button";
import { FontSelector } from "./font-selector";
import { ModeToggle } from "./mode-toggle";
import { PresetSelector } from "./preset-selector";
import { RadiusSelector } from "./radius-selector";
import { applyTheme } from "./theme-applier";
import { useThemeState } from "./use-theme-state";

type PanelProps = {
  onClose: () => void;
};

type PanelHeaderProps = PanelProps;

type PanelState = ReturnType<typeof useThemeState>;

type PanelSectionProps = {
  delay: number;
  children: ReactNode;
  className?: string;
};

type PanelContentProps = Omit<PanelState, "resetTheme">;

type PanelFooterProps = {
  config: PanelState["config"];
  onReset: () => void;
};

const keyframesStyle = `
@keyframes previewcn-slide-in-right {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
@keyframes previewcn-rise {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes previewcn-pop {
  from { opacity: 0; transform: translateY(-4px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
`;

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

function usePanelKeyframes() {
  useEffect(() => {
    const styleId = "previewcn-keyframes";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = keyframesStyle;
      document.head.appendChild(style);
    }
  }, []);
}

function PanelSection({ delay, children, className }: PanelSectionProps) {
  return (
    <div
      className={cn("relative", className)}
      style={{
        animation: "previewcn-rise 0.32s ease both",
        animationDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function PanelHeader({ onClose }: PanelHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-[oklch(1_0_0/0.08)] bg-linear-to-b from-[oklch(0.18_0.02_260)] to-transparent px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-semibold tracking-[0.02em]">
          previewcn
        </span>
      </div>
      <button
        onClick={onClose}
        className="inline-flex size-7 cursor-pointer items-center justify-center rounded-[10px] border border-transparent bg-transparent text-[oklch(0.72_0_0)] transition-all duration-160 hover:border-[oklch(1_0_0/0.08)] hover:bg-[oklch(0.2_0.02_260/0.9)] hover:text-[oklch(0.96_0_0)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[oklch(0.72_0.15_265)]"
        aria-label="Close"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

function PanelContent({
  config,
  setColorPreset,
  setRadius,
  setDarkMode,
  setFont,
  setPresetTheme,
}: PanelContentProps) {
  const sections = [
    {
      key: "preset",
      delay: 0.02,
      content: (
        <PresetSelector value={config.preset} onChange={setPresetTheme} />
      ),
    },
    {
      key: "color",
      delay: 0.05,
      content: (
        <ColorPicker value={config.colorPreset} onChange={setColorPreset} />
      ),
    },
    {
      key: "radius",
      delay: 0.08,
      content: <RadiusSelector value={config.radius} onChange={setRadius} />,
    },
    {
      key: "font",
      delay: 0.11,
      className: "z-20",
      content: <FontSelector value={config.font} onChange={setFont} />,
    },
    {
      key: "mode",
      delay: 0.14,
      content: <ModeToggle value={config.darkMode} onChange={setDarkMode} />,
    },
  ];

  return (
    <div className="grid flex-1 gap-4 overflow-y-auto p-4 [scrollbar-color:oklch(1_0_0/0.2)_transparent] [scrollbar-width:thin]">
      {sections.map((section) => (
        <PanelSection
          key={section.key}
          delay={section.delay}
          className={section.className}
        >
          {section.content}
        </PanelSection>
      ))}
    </div>
  );
}

function PanelFooter({ config, onReset }: PanelFooterProps) {
  return (
    <div className="flex items-center justify-end border-t border-[oklch(1_0_0/0.08)] bg-linear-to-t from-[oklch(0.18_0.02_260)] to-transparent px-4 py-3">
      <CssExportButton config={config} />
      <button
        onClick={onReset}
        className="inline-flex min-h-[30px] cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border border-transparent bg-transparent px-2.5 py-1.5 text-xs font-medium tracking-[0.01em] text-[oklch(0.72_0_0)] transition-all duration-160 hover:border-[oklch(1_0_0/0.08)] hover:bg-[oklch(0.2_0.02_260/0.9)] hover:text-[oklch(0.96_0_0)]"
      >
        <RotateCcwIcon />
        <span>Reset</span>
      </button>
    </div>
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
  }, []);

  usePanelKeyframes();

  return (
    <div className="fixed top-0 right-0 z-99998 flex h-dvh w-80 animate-[previewcn-slide-in-right_0.3s_ease-out] flex-col overflow-hidden border-l border-[oklch(1_0_0/0.08)] bg-[radial-gradient(120%_140%_at_0%_0%,oklch(0.25_0.05_265/0.25),transparent_45%),linear-gradient(180deg,oklch(0.18_0.02_260),oklch(0.14_0.02_260))] font-sans text-[12.5px] leading-[1.55] tracking-[0.01em] text-[oklch(0.96_0_0)] shadow-[0_24px_60px_oklch(0_0_0/0.6),0_1px_0_oklch(1_0_0/0.04)_inset]">
      <PanelHeader onClose={onClose} />
      <PanelContent
        config={config}
        setColorPreset={setColorPreset}
        setRadius={setRadius}
        setDarkMode={setDarkMode}
        setFont={setFont}
        setPresetTheme={setPresetTheme}
      />
      <PanelFooter config={config} onReset={resetTheme} />
    </div>
  );
}
