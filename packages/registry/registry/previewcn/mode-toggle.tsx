"use client";

import { cn } from "@/lib/utils";

type ModeToggleProps = {
  value: boolean | null;
  onChange: (darkMode: boolean) => void;
};

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export function ModeToggle({ value, onChange }: ModeToggleProps) {
  const isDark = value ?? false;

  return (
    <div className="relative grid gap-2.5 rounded-xl border border-[oklch(1_0_0/0.08)] bg-[oklch(0.2_0.02_260/0.9)] p-3 shadow-[inset_0_1px_0_oklch(1_0_0/0.04)]">
      <label className="block text-[10.5px] font-semibold tracking-[0.16em] text-[oklch(0.72_0_0)]">
        Mode
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onChange(false)}
          className={cn(
            "inline-flex min-h-[30px] w-full cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border px-2.5 py-1.5 text-xs font-medium tracking-[0.01em] transition-all duration-160",
            !isDark
              ? "border-[oklch(0.72_0.15_265)] bg-[oklch(0.24_0.02_260/0.95)] shadow-[0_0_0_1px_oklch(0.72_0.15_265),0_10px_24px_oklch(0_0_0/0.35)]"
              : "border-[oklch(1_0_0/0.08)] bg-[oklch(0.2_0.02_260/0.9)] text-[oklch(0.96_0_0)] hover:border-[oklch(1_0_0/0.18)] hover:bg-[oklch(0.24_0.02_260/0.95)]"
          )}
          style={
            !isDark
              ? undefined
              : { boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.04)" }
          }
          aria-label="Light mode"
        >
          <SunIcon />
          <span>Light</span>
        </button>
        <button
          onClick={() => onChange(true)}
          className={cn(
            "inline-flex min-h-[30px] w-full cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border px-2.5 py-1.5 text-xs font-medium tracking-[0.01em] transition-all duration-160",
            isDark
              ? "border-[oklch(0.72_0.15_265)] bg-[oklch(0.24_0.02_260/0.95)] shadow-[0_0_0_1px_oklch(0.72_0.15_265),0_10px_24px_oklch(0_0_0/0.35)]"
              : "border-[oklch(1_0_0/0.08)] bg-[oklch(0.2_0.02_260/0.9)] text-[oklch(0.96_0_0)] shadow-[inset_0_1px_0_oklch(1_0_0/0.04)] hover:border-[oklch(1_0_0/0.18)] hover:bg-[oklch(0.24_0.02_260/0.95)]"
          )}
          aria-label="Dark mode"
        >
          <MoonIcon />
          <span>Dark</span>
        </button>
      </div>
    </div>
  );
}
