import { AlertCircle, Loader2 } from "lucide-react";
import type { RefObject } from "react";

type ThemePreviewPanelProps = {
  iframeRef: RefObject<HTMLIFrameElement | null>;
  targetUrl: string;
  isIframeLoading: boolean;
  iframeError: string | null;
  onIframeLoad: () => void;
  onIframeError: () => void;
};

export function ThemePreviewPanel({
  iframeRef,
  targetUrl,
  isIframeLoading,
  iframeError,
  onIframeLoad,
  onIframeError,
}: ThemePreviewPanelProps) {
  return (
    <div className="flex-1 bg-muted/30">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b bg-background px-4 py-2">
          <span className="text-sm text-muted-foreground">Preview</span>
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="size-3 rounded-full bg-[#ff5f57]" />
              <div className="size-3 rounded-full bg-[#febc2e]" />
              <div className="size-3 rounded-full bg-[#28c840]" />
            </div>
          </div>
        </div>

        <div className="relative flex-1 p-4">
          {isIframeLoading && targetUrl && (
            <div className="absolute inset-4 z-10 flex items-center justify-center rounded-lg bg-background/80">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Loading preview...
                </span>
              </div>
            </div>
          )}

          {iframeError ? (
            <div className="flex h-full flex-col items-center justify-center rounded-lg border bg-background p-8 text-center shadow-lg">
              <AlertCircle className="mb-4 size-12 text-destructive" />
              <p className="text-lg font-medium">Unable to load preview</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {iframeError}
              </p>
              <div className="mt-6 max-w-md rounded-lg bg-muted p-4 text-left">
                <p className="text-sm font-medium">Setup Required</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Your target app needs to allow iframe embedding. Add this to
                  your Next.js config:
                </p>
                <pre className="mt-2 overflow-x-auto rounded bg-background p-2 text-xs">
                  {`// next.config.js
async headers() {
  return [{
    source: '/:path*',
    headers: [
      {
        key: 'Content-Security-Policy',
        value: "frame-ancestors 'self' http://localhost:*"
      }
    ]
  }];
}`}
                </pre>
                <p className="mt-2 text-xs text-muted-foreground">
                  Also add{" "}
                  <code className="rounded bg-background px-1">
                    ThemeReceiver
                  </code>{" "}
                  component to receive theme updates.
                </p>
              </div>
            </div>
          ) : targetUrl ? (
            <iframe
              ref={iframeRef}
              src={targetUrl}
              className="size-full rounded-lg border bg-background shadow-lg"
              onLoad={onIframeLoad}
              onError={onIframeError}
              title="Theme Preview"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-lg border bg-background p-8 text-center shadow-lg">
              <p className="text-lg font-medium">No URL configured</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter a target URL to preview your theme
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
