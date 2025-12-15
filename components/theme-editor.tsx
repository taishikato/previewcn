"use client";

import { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ColorPresetSelector } from "@/components/color-preset-selector";
import { RadiusSelector } from "@/components/radius-selector";
import {
  ThemeConfig,
  defaultThemeConfig,
  generateCssVars,
  generateThemeCss,
} from "@/lib/theme-presets";
import { Sun, Moon, Copy, Check } from "lucide-react";

type ThemeEditorProps = {
  targetUrl?: string;
  onThemeChange?: (config: ThemeConfig) => void;
};

export function ThemeEditor({
  targetUrl = "http://localhost:3000",
  onThemeChange,
}: ThemeEditorProps) {
  const [config, setConfig] = useState<ThemeConfig>(defaultThemeConfig);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Send theme to iframe
  const sendThemeToIframe = useCallback((themeConfig: ThemeConfig) => {
    const cssVars = generateCssVars(themeConfig);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "APPLY_THEME", cssVars },
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

  // Send initial theme when iframe loads
  const handleIframeLoad = useCallback(() => {
    sendThemeToIframe(config);
  }, [config, sendThemeToIframe]);

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
      <div className="w-80 flex-shrink-0 overflow-y-auto border-r bg-background p-4">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Theme Editor</h1>
          <p className="text-sm text-muted-foreground">
            Customize your shadcn/ui theme
          </p>
        </div>

        <div className="space-y-6">
          {/* Color Preset */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Color</CardTitle>
            </CardHeader>
            <CardContent>
              <ColorPresetSelector
                value={config.colorPreset}
                onChange={(colorPreset) => updateConfig({ colorPreset })}
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
              <div className="text-xs text-muted-foreground">
                Preview shows: {targetUrl}
              </div>
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
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
            </div>
          </div>
          <div className="flex-1 p-4">
            <iframe
              ref={iframeRef}
              src={targetUrl}
              className="h-full w-full rounded-lg border bg-white shadow-lg"
              onLoad={handleIframeLoad}
              title="Theme Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
