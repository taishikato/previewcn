"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ColorPresetSelector } from "@/components/color-preset-selector";
import { RadiusSelector } from "@/components/radius-selector";
import { UrlInput } from "@/components/url-input";
import {
  ThemeConfig,
  defaultThemeConfig,
  generateCssVars,
  generateThemeCss,
} from "@/lib/theme-presets";
import { getStoredUrl, setStoredUrl, isValidUrl } from "@/lib/url-storage";
import { Sun, Moon, Copy, Check, Loader2, AlertCircle } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

type ThemeEditorProps = {
  initialUrl?: string;
  onThemeChange?: (config: ThemeConfig) => void;
};

export function ThemeEditor({ initialUrl, onThemeChange }: ThemeEditorProps) {
  const [config, setConfig] = useState<ThemeConfig>(defaultThemeConfig);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // URL state
  const [targetUrl, setTargetUrl] = useState<string>("");
  const [inputUrl, setInputUrl] = useState<string>("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState<string | null>(null);

  // Initialize URL from localStorage on mount
  useEffect(() => {
    const stored = initialUrl || getStoredUrl();

    // Defer state updates to avoid sync setState inside an effect body.
    // We only need this on mount / initialUrl change to hydrate URL from localStorage.
    queueMicrotask(() => {
      setTargetUrl(stored);
      setInputUrl(stored);
    });
  }, [initialUrl]);

  // Send theme to iframe
  const sendThemeToIframe = useCallback((themeConfig: ThemeConfig) => {
    const cssVars = generateCssVars(themeConfig);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "APPLY_THEME", cssVars, darkMode: themeConfig.darkMode },
        "*"
      );
    }
  }, []);

  // Update config and notify
  const updateConfig = useCallback(
    (updates: Partial<ThemeConfig>) => {
      setConfig((prev) => {
        const newConfig = { ...prev, ...updates };
        sendThemeToIframe(newConfig);
        onThemeChange?.(newConfig);
        return newConfig;
      });
    },
    [sendThemeToIframe, onThemeChange]
  );

  // Handle iframe load - send initial theme
  const handleIframeLoad = useCallback(() => {
    setIsIframeLoading(false);
    setIframeError(null);
    sendThemeToIframe(config);
  }, [config, sendThemeToIframe]);

  // Handle iframe error
  const handleIframeError = useCallback(() => {
    setIsIframeLoading(false);
    setIframeError(
      "Failed to load the target URL. Make sure the app is running."
    );
  }, []);

  // Apply new URL
  const handleApplyUrl = useCallback(() => {
    const validation = isValidUrl(inputUrl);
    if (!validation.valid) {
      setUrlError(validation.error || "Invalid URL");
      return;
    }

    setUrlError(null);
    setIframeError(null);
    setIsIframeLoading(true);
    setTargetUrl(inputUrl);
    setStoredUrl(inputUrl);
  }, [inputUrl]);

  // Copy CSS to clipboard
  const handleCopyCss = useCallback(async () => {
    const css = generateThemeCss(config);
    await navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [config]);

  return (
    <div className="flex h-screen">
      {/* Left panel - Editor */}
      <div className="w-80 shrink-0 overflow-y-auto border-r bg-background p-4">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">previewcn</h1>
            <ModeToggle />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Preview shadcn/ui themes on your actual app
          </p>
        </div>

        <div className="space-y-6">
          {/* Color Preset */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Theme Color</CardTitle>
            </CardHeader>
            <CardContent>
              <ColorPresetSelector
                value={config.colorPreset}
                onChange={(colorPreset) => updateConfig({ colorPreset })}
                showLabels
              />
            </CardContent>
          </Card>

          {/* Radius */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Radius</CardTitle>
            </CardHeader>
            <CardContent>
              <RadiusSelector
                value={config.radius}
                onChange={(radius) => updateConfig({ radius })}
              />
            </CardContent>
          </Card>

          {/* Dark Mode Toggle */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant={!config.darkMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateConfig({ darkMode: false })}
                  className="flex-1"
                >
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={config.darkMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateConfig({ darkMode: true })}
                  className="flex-1"
                >
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Export */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Export</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCss}
                className="w-full"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy CSS Variables
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Target URL Input */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Target URL</CardTitle>
            </CardHeader>
            <CardContent>
              <UrlInput
                value={inputUrl}
                appliedUrl={targetUrl}
                onChange={setInputUrl}
                onApply={handleApplyUrl}
                isLoading={isIframeLoading}
                error={urlError}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right panel - Preview */}
      <div className="flex-1 bg-muted/30">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b bg-background px-4 py-2">
            <span className="text-sm text-muted-foreground">Preview</span>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive" />
                <div className="h-3 w-3 rounded-full bg-muted-foreground/60" />
                <div className="h-3 w-3 rounded-full bg-primary" />
              </div>
            </div>
          </div>
          <div className="relative flex-1 p-4">
            {/* Loading overlay */}
            {isIframeLoading && targetUrl && (
              <div className="absolute inset-4 z-10 flex items-center justify-center rounded-lg bg-background/80">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Loading preview...
                  </span>
                </div>
              </div>
            )}

            {/* Error state */}
            {iframeError ? (
              <div className="flex h-full flex-col items-center justify-center rounded-lg border bg-background p-8 text-center shadow-lg">
                <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
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
                className="h-full w-full rounded-lg border bg-background shadow-lg"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
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
    </div>
  );
}
