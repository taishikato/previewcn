import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColorPresetSelector } from "@/components/color-preset-selector";
import { FontSelector } from "@/components/font-selector";
import { RadiusSelector } from "@/components/radius-selector";
import { ThemeEditorHeader } from "@/components/theme-editor/theme-editor-header";
import { UrlInput } from "@/components/url-input";
import { Moon, Sun, Copy, Check, Wifi, WifiOff, ShieldX } from "lucide-react";
import type { ThemeConfig } from "@/lib/theme-presets";
import { generateThemeCss } from "@/lib/theme-presets";
import type { ConnectionStatus } from "@/lib/theme-messages";

type ThemeEditorSidebarProps = {
  config: ThemeConfig;
  updateConfig: (updates: Partial<ThemeConfig>) => void;

  copied: boolean;
  onCopyCss: () => void | Promise<void>;

  targetUrl: string;
  inputUrl: string;
  onInputUrlChange: (url: string) => void;
  onApplyUrl: () => void;
  isIframeLoading: boolean;
  urlError: string | null;
  connectionStatus: ConnectionStatus;
};

function ConnectionStatusIndicator({
  status,
  targetUrl,
}: {
  status: ConnectionStatus;
  targetUrl: string;
}) {
  if (!targetUrl) {
    return null;
  }

  if (status === "connected") {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label="Connection status: connected"
        className="flex items-center gap-2 rounded-md bg-green-500/10 px-3 py-2 text-green-600 dark:text-green-400"
      >
        <Wifi className="size-4" />
        <span className="text-xs font-medium">Connected</span>
      </div>
    );
  }

  if (status === "blocked") {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label="Connection status: blocked"
        className="space-y-2"
      >
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-destructive">
          <ShieldX className="size-4" />
          <span className="text-xs font-medium">Preview blocked</span>
        </div>
        <p className="text-xs text-muted-foreground">
          The target app blocks iframe embedding. Add CSP headers to allow
          PreviewCN.
        </p>
      </div>
    );
  }

  // disconnected
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Connection status: not connected"
      className="space-y-2"
    >
      <div className="flex items-center gap-2 rounded-md bg-amber-500/10 px-3 py-2 text-amber-600 dark:text-amber-400">
        <WifiOff className="size-4" />
        <span className="text-xs font-medium">Not connected</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Add <code className="rounded bg-muted px-1">ThemeReceiver</code> to your
        app to receive theme updates.
      </p>
    </div>
  );
}

export function ThemeEditorSidebar({
  config,
  updateConfig,
  copied,
  onCopyCss,
  targetUrl,
  inputUrl,
  onInputUrlChange,
  onApplyUrl,
  isIframeLoading,
  urlError,
  connectionStatus,
}: ThemeEditorSidebarProps) {
  const isExportDisabled = generateThemeCss(config).trim().length === 0;

  return (
    <div className="w-80 shrink-0 overflow-y-auto border-r bg-background p-4">
      <ThemeEditorHeader />

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Target URL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <UrlInput
              value={inputUrl}
              appliedUrl={targetUrl}
              onChange={onInputUrlChange}
              onApply={onApplyUrl}
              isLoading={isIframeLoading}
              error={urlError}
            />
            <ConnectionStatusIndicator
              status={connectionStatus}
              targetUrl={targetUrl}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Theme Color</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {config.colorPreset === null && (
              <p className="text-xs text-muted-foreground">
                Select a color preset to apply
              </p>
            )}
            <ColorPresetSelector
              value={config.colorPreset}
              onChange={(colorPreset) => updateConfig({ colorPreset })}
              darkMode={config.darkMode}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Font</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {config.font === null && (
              <p className="text-xs text-muted-foreground">
                Select a font to apply
              </p>
            )}
            <FontSelector
              value={config.font}
              onChange={(font) => updateConfig({ font })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Radius</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {config.radius === null && (
              <p className="text-xs text-muted-foreground">
                Select a radius to apply
              </p>
            )}
            <RadiusSelector
              value={config.radius}
              onChange={(radius) => updateConfig({ radius })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {config.darkMode === null && (
              <p className="text-xs text-muted-foreground">
                Select a mode to apply
              </p>
            )}
            <div className="flex gap-2">
              <Button
                variant={config.darkMode === false ? "default" : "outline"}
                onClick={() => updateConfig({ darkMode: false })}
                className="flex-1"
              >
                <Sun className="mr-2 size-4" />
                Light
              </Button>
              <Button
                variant={config.darkMode === true ? "default" : "outline"}
                onClick={() => updateConfig({ darkMode: true })}
                className="flex-1"
              >
                <Moon className="mr-2 size-4" />
                Dark
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Export</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={onCopyCss}
              className="w-full"
              disabled={isExportDisabled}
            >
              {copied ? (
                <>
                  <Check className="mr-2 size-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 size-4" />
                  Copy CSS Variables
                </>
              )}
            </Button>
            {isExportDisabled && (
              <p className="mt-2 text-xs text-muted-foreground">
                Select at least one setting to export
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
