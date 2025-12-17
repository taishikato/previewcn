"use client";

import { ThemeEditorSidebar } from "@/components/theme-editor/theme-editor-sidebar";
import { ThemePreviewPanel } from "@/components/theme-editor/theme-preview-panel";
import { useThemeEditor } from "@/components/theme-editor/use-theme-editor";
import type { ThemeConfig } from "@/lib/theme-presets";

type ThemeEditorProps = {
  initialUrl?: string;
  onThemeChange?: (config: ThemeConfig) => void;
};

export function ThemeEditor({ initialUrl, onThemeChange }: ThemeEditorProps) {
  const editor = useThemeEditor({ initialUrl, onThemeChange });

  return (
    <div className="flex h-screen">
      <ThemeEditorSidebar
        config={editor.config}
        updateConfig={editor.updateConfig}
        copied={editor.copied}
        onCopyCss={editor.handleCopyCss}
        targetUrl={editor.targetUrl}
        inputUrl={editor.inputUrl}
        onInputUrlChange={editor.setInputUrl}
        onApplyUrl={editor.handleApplyUrl}
        isIframeLoading={editor.isIframeLoading}
        urlError={editor.urlError}
        connectionStatus={editor.connectionStatus}
      />

      <ThemePreviewPanel
        iframeRef={editor.iframeRef}
        targetUrl={editor.targetUrl}
        isIframeLoading={editor.isIframeLoading}
        iframeError={editor.iframeError}
        onIframeLoad={editor.handleIframeLoad}
        onIframeError={editor.handleIframeError}
      />
    </div>
  );
}
