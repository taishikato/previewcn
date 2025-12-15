import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";

export function ThemeEditorHeader() {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="previewcn logo"
            width={20}
            height={20}
            className="dark:invert"
          />
          <h1 className="text-xl font-bold">previewcn</h1>
        </div>
        <ModeToggle />
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Preview shadcn/ui themes on your actual app
      </p>
    </div>
  );
}

