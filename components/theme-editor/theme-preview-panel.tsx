import type { RefObject } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

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
    <div className="bg-muted/30 flex-1">
      <div className="flex h-full flex-col">
        <div className="bg-background flex items-center justify-between border-b px-4 py-2">
          <span className="text-muted-foreground text-sm">Preview</span>
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
            <div className="bg-background/80 absolute inset-4 z-10 flex items-center justify-center rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="text-muted-foreground size-8 animate-spin" />
                <span className="text-muted-foreground text-sm">
                  Loading preview...
                </span>
              </div>
            </div>
          )}

          {iframeError ? (
            <div className="bg-background flex h-full flex-col items-center justify-center rounded-lg border p-8 text-center shadow-lg">
              <AlertCircle className="text-destructive mb-4 size-12" />
              <p className="text-lg font-medium">Unable to load preview</p>
              <p className="text-muted-foreground mt-2 text-sm">
                {iframeError}
              </p>
              <div className="bg-muted mt-6 max-w-md rounded-lg p-4 text-left">
                <p className="text-sm font-medium">Setup Required</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Your target app needs to allow iframe embedding. Add this to
                  your Next.js config:
                </p>
                <pre className="bg-background mt-2 overflow-x-auto rounded p-2 text-xs">
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
                <p className="text-muted-foreground mt-2 text-xs">
                  Also add{" "}
                  <code className="bg-background rounded px-1">
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
              className="bg-background size-full rounded-lg border shadow-lg"
              onLoad={onIframeLoad}
              onError={onIframeError}
              title="Theme Preview"
            />
          ) : (
            <div className="bg-background flex h-full flex-col items-center justify-center rounded-lg border p-8 text-center shadow-lg">
              <p className="text-lg font-medium">No URL configured</p>
              <p className="text-muted-foreground mt-2 text-sm">
                Enter a target URL to preview your theme
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
