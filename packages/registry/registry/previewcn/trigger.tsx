"use client";

type TriggerProps = {
  onClick: () => void;
};

function PaletteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

export function Trigger({ onClick }: TriggerProps) {
  return (
    <button
      onClick={onClick}
      className="fixed right-4 bottom-4 z-99999 inline-flex size-12 cursor-pointer items-center justify-center rounded-full border border-[oklch(1_0_0/0.18)] bg-[linear-gradient(180deg,oklch(0.23_0.03_260)_0%,oklch(0.16_0.02_260)_100%)] text-[oklch(0.96_0_0)] transition-all duration-180 hover:border-[oklch(1_0_0/0.28)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[oklch(0.72_0.15_265)]"
      aria-label="Open previewcn theme editor"
      title="previewcn Theme Editor"
    >
      <PaletteIcon />
    </button>
  );
}
