import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColorPresetSelector } from "@/components/color-preset-selector";
import { RadiusSelector } from "@/components/radius-selector";
import { ThemeEditorHeader } from "@/components/theme-editor/theme-editor-header";
import { UrlInput } from "@/components/url-input";
import { Moon, Sun, Copy, Check } from "lucide-react";
import type { ThemeConfig } from "@/lib/theme-presets";

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
};

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
}: ThemeEditorSidebarProps) {
  return (
    <div className="w-80 shrink-0 overflow-y-auto border-r bg-background p-4">
      <ThemeEditorHeader />

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Target URL</CardTitle>
          </CardHeader>
          <CardContent>
            <UrlInput
              value={inputUrl}
              appliedUrl={targetUrl}
              onChange={onInputUrlChange}
              onApply={onApplyUrl}
              isLoading={isIframeLoading}
              error={urlError}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Theme Color</CardTitle>
          </CardHeader>
          <CardContent>
            <ColorPresetSelector
              value={config.colorPreset}
              onChange={(colorPreset) => updateConfig({ colorPreset })}
              darkMode={config.darkMode}
            />
          </CardContent>
        </Card>

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
                <Sun className="mr-2 size-4" />
                Light
              </Button>
              <Button
                variant={config.darkMode ? "default" : "outline"}
                size="sm"
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
              size="sm"
              onClick={onCopyCss}
              className="w-full"
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
