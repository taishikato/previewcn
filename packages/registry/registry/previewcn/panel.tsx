"use client";

import { useEffect, type ReactNode } from "react";

import { useThemeState } from "./use-theme-state";
import { applyTheme } from "./theme-applier";
import { ColorPicker } from "./color-picker";
import { CssExportButton } from "./css-export-button";
import { FontSelector } from "./font-selector";
import { ModeToggle } from "./mode-toggle";
import { PresetSelector } from "./preset-selector";
import { RadiusSelector } from "./radius-selector";

type PanelProps = {
  onClose: () => void;
};

type PanelState = ReturnType<typeof useThemeState>;

type PanelSectionProps = {
  delay: number;
  children: ReactNode;
};

type PanelContentProps = Pick<
  PanelState,
  | "config"
  | "setColorPreset"
  | "setRadius"
  | "setDarkMode"
  | "setFont"
  | "setPresetTheme"
>;

type PanelHeaderProps = {
  onClose: () => void;
};

type PanelFooterProps = {
  config: PanelState["config"];
  onReset: () => void;
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

const panelClassName =
  "fixed top-0 right-0 z-[99998] flex flex-col w-80 h-dvh overflow-hidden text-[oklch(0.96_0_0)] text-[12.5px] leading-[1.55] tracking-[0.01em] border-l border-[oklch(1_0_0/0.08)]";

const panelStyle = {
  fontFamily:
    'var(--font-sans, "Inter", "Geist", "SF Pro Text", "Segoe UI", sans-serif)',
  background: `
    radial-gradient(120% 140% at 0% 0%, oklch(0.25 0.05 265 / 0.25), transparent 45%),
    linear-gradient(180deg, oklch(0.18 0.02 260), oklch(0.14 0.02 260))
  `,
  boxShadow:
    "0 24px 60px oklch(0 0 0 / 0.6), 0 1px 0 oklch(1 0 0 / 0.04) inset",
  animation: "previewcn-slide-in-right 0.3s ease-out",
};

const headerClassName =
  "flex items-center justify-between px-4 py-3 border-b border-[oklch(1_0_0/0.08)]";

const headerStyle = {
  background: "linear-gradient(180deg, oklch(0.18 0.02 260), transparent)",
};

const contentClassName = "flex-1 overflow-y-auto p-4 grid gap-4";

const contentStyle = {
  scrollbarWidth: "thin",
  scrollbarColor: "oklch(1 0 0 / 0.2) transparent",
};

const footerClassName =
  "flex items-center justify-end px-4 py-3 border-t border-[oklch(1_0_0/0.08)]";

const footerStyle = {
  background: "linear-gradient(0deg, oklch(0.18 0.02 260), transparent)",
};

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

function PanelSection({ delay, children }: PanelSectionProps) {
  return (
    <div
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
    <div className={headerClassName} style={headerStyle}>
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-semibold tracking-[0.02em]">
          previewcn
        </span>
      </div>
      <button
        onClick={onClose}
        className="inline-flex items-center justify-center size-7 rounded-[10px] border border-transparent bg-transparent text-[oklch(0.72_0_0)] cursor-pointer transition-all duration-[160ms] hover:bg-[oklch(0.2_0.02_260/0.9)] hover:border-[oklch(1_0_0/0.08)] hover:text-[oklch(0.96_0_0)] focus-visible:outline-2 focus-visible:outline-[oklch(0.72_0.15_265)] focus-visible:outline-offset-2"
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
      content: <PresetSelector value={config.preset} onChange={setPresetTheme} />,
    },
    {
      key: "color",
      delay: 0.05,
      content: <ColorPicker value={config.colorPreset} onChange={setColorPreset} />,
    },
    {
      key: "radius",
      delay: 0.08,
      content: <RadiusSelector value={config.radius} onChange={setRadius} />,
    },
    {
      key: "font",
      delay: 0.11,
      content: <FontSelector value={config.font} onChange={setFont} />,
    },
    {
      key: "mode",
      delay: 0.14,
      content: <ModeToggle value={config.darkMode} onChange={setDarkMode} />,
    },
  ];

  return (
    <div className={contentClassName} style={contentStyle}>
      {sections.map((section) => (
        <PanelSection key={section.key} delay={section.delay}>
          {section.content}
        </PanelSection>
      ))}
    </div>
  );
}

function PanelFooter({ config, onReset }: PanelFooterProps) {
  return (
    <div className={footerClassName} style={footerStyle}>
      <CssExportButton config={config} />
      <button
        onClick={onReset}
        className="inline-flex items-center justify-center gap-1.5 min-h-[30px] px-2.5 py-1.5 rounded-[10px] border border-transparent bg-transparent text-[oklch(0.72_0_0)] text-xs font-medium tracking-[0.01em] cursor-pointer transition-all duration-[160ms] hover:bg-[oklch(0.2_0.02_260/0.9)] hover:border-[oklch(1_0_0/0.08)] hover:text-[oklch(0.96_0_0)]"
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
    <div className={panelClassName} style={panelStyle}>
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
