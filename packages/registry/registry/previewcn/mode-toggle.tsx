"use client";

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

const baseButtonClass =
  "inline-flex items-center justify-center gap-1.5 w-full min-h-[30px] px-2.5 py-1.5 rounded-[10px] border text-xs font-medium tracking-[0.01em] cursor-pointer transition-all duration-[160ms]";

const defaultButtonClass =
  "border-[oklch(1_0_0/0.08)] bg-[oklch(0.2_0.02_260/0.9)] text-[oklch(0.96_0_0)] hover:bg-[oklch(0.24_0.02_260/0.95)] hover:border-[oklch(1_0_0/0.18)]";

const selectedButtonClass =
  "bg-[oklch(0.24_0.02_260/0.95)] border-[oklch(0.72_0.15_265)] shadow-[0_0_0_1px_oklch(0.72_0.15_265),0_10px_24px_oklch(0_0_0/0.35)]";

export function ModeToggle({ value, onChange }: ModeToggleProps) {
  const isDark = value ?? false;

  return (
    <div
      className="relative grid gap-2.5 p-3 rounded-xl border border-[oklch(1_0_0/0.08)] bg-[oklch(0.2_0.02_260/0.9)]"
      style={{ boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.04)" }}
    >
      <label className="block text-[10.5px] font-semibold tracking-[0.16em] uppercase text-[oklch(0.72_0_0)]">
        Mode
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onChange(false)}
          className={`${baseButtonClass} ${!isDark ? selectedButtonClass : defaultButtonClass}`}
          style={!isDark ? undefined : { boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.04)" }}
          aria-label="Light mode"
        >
          <SunIcon />
          <span>Light</span>
        </button>
        <button
          onClick={() => onChange(true)}
          className={`${baseButtonClass} ${isDark ? selectedButtonClass : defaultButtonClass}`}
          style={isDark ? undefined : { boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.04)" }}
          aria-label="Dark mode"
        >
          <MoonIcon />
          <span>Dark</span>
        </button>
      </div>
    </div>
  );
}
