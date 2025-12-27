"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

export function Hero() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText("npx previewcn");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-8 px-4 py-20 text-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
          previewcn
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg sm:text-xl">
          Real-time theme editor for shadcn/ui.
          <br className="hidden sm:block" />
          Preview changes directly on your Next.js app.
        </p>
      </div>

      <button
        onClick={handleCopy}
        className={cn(
          "group hover:border-foreground/50 flex items-center gap-3 rounded-lg border px-5 py-3 font-mono text-sm transition-all",
          copied && "border-green-500"
        )}
      >
        <span className="text-muted-foreground">$</span>
        <span>npx previewcn</span>
        <span
          className={cn(
            "text-muted-foreground group-hover:text-foreground ml-2 transition-colors",
            copied && "text-green-500"
          )}
        >
          {copied ? (
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
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
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
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
          )}
        </span>
      </button>
    </section>
  );
}
