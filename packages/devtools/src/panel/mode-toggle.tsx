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

export function ModeToggle({ value, onChange }: ModeToggleProps) {
  const isDark = value ?? false;

  return (
    <div className="previewcn-section previewcn-surface">
      <label className="previewcn-label">Mode</label>
      <div className="previewcn-mode-toggle">
        <button
          onClick={() => onChange(false)}
          className={`previewcn-mode-btn previewcn-control ${!isDark ? "previewcn-control--selected" : ""}`}
          aria-label="Light mode"
        >
          <SunIcon />
          <span>Light</span>
        </button>
        <button
          onClick={() => onChange(true)}
          className={`previewcn-mode-btn previewcn-control ${isDark ? "previewcn-control--selected" : ""}`}
          aria-label="Dark mode"
        >
          <MoonIcon />
          <span>Dark</span>
        </button>
      </div>
    </div>
  );
}
