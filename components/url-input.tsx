"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { KeyboardEvent } from "react";

type UrlInputProps = {
  value: string;
  appliedUrl: string;
  onChange: (url: string) => void;
  onApply: () => void;
  isLoading: boolean;
  error: string | null;
};

export function UrlInput({
  value,
  appliedUrl,
  onChange,
  onApply,
  isLoading,
  error,
}: UrlInputProps) {
  const isUnchanged = value === appliedUrl;
  const isDisabled = isLoading || isUnchanged || !value.trim();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isDisabled) {
      onApply();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="http://localhost:3001"
          className={cn(
            "flex-1 text-xs",
            error && "border-destructive focus-visible:ring-destructive/50"
          )}
          aria-invalid={!!error}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={onApply}
          disabled={isDisabled}
          className="shrink-0"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
