"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import {
  defaultThemeConfig,
  generateBothModeColorVars,
  generateCssVars,
  generateThemeCss,
} from "@/lib/theme-presets";
import type { ThemeConfig } from "@/lib/theme-presets";
import { defaultFont, getFontPreset } from "@/lib/font-presets";
import type { ThemeMessage } from "@/lib/theme-messages";
import { getStoredUrl, isValidUrl, setStoredUrl } from "@/lib/url-storage";

type UseThemeEditorOptions = {
  initialUrl?: string;
  onThemeChange?: (config: ThemeConfig) => void;
};

type UseThemeEditorReturn = {
  config: ThemeConfig;
  updateConfig: (updates: Partial<ThemeConfig>) => void;

  copied: boolean;
  handleCopyCss: () => Promise<void>;

  iframeRef: RefObject<HTMLIFrameElement | null>;
  isIframeLoading: boolean;
  iframeError: string | null;
  handleIframeLoad: () => void;
  handleIframeError: () => void;

  targetUrl: string;
  inputUrl: string;
  setInputUrl: (url: string) => void;
  urlError: string | null;
  handleApplyUrl: () => void;
};

export function useThemeEditor({
  initialUrl,
  onThemeChange,
}: UseThemeEditorOptions): UseThemeEditorReturn {
  const [config, setConfig] = useState<ThemeConfig>(defaultThemeConfig);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [copied, setCopied] = useState(false);
  const copiedResetTimeoutId = useRef<number | null>(null);

  const [targetUrl, setTargetUrl] = useState<string>("");
  const [inputUrl, setInputUrl] = useState<string>("");
  const [urlError, setUrlError] = useState<string | null>(null);

  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState<string | null>(null);

  useEffect(() => {
    const stored = initialUrl || getStoredUrl();
    queueMicrotask(() => {
      setTargetUrl(stored);
      setInputUrl(stored);
    });
  }, [initialUrl]);

  useEffect(() => {
    return () => {
      if (copiedResetTimeoutId.current !== null) {
        window.clearTimeout(copiedResetTimeoutId.current);
      }
    };
  }, []);

  const postToIframe = useCallback((message: ThemeMessage) => {
    iframeRef.current?.contentWindow?.postMessage(message, "*");
  }, []);

  const sendThemeToIframe = useCallback(
    (themeConfig: ThemeConfig) => {
      const cssVars = generateCssVars(themeConfig);
      postToIframe({
        type: "APPLY_THEME",
        cssVars,
        // Convert null to undefined for the message protocol
        darkMode: themeConfig.darkMode ?? undefined,
      });
    },
    [postToIframe]
  );

  const sendDarkModeToIframe = useCallback(
    (darkMode: boolean) => {
      postToIframe({ type: "TOGGLE_DARK_MODE", darkMode });
    },
    [postToIframe]
  );

  const sendRadiusToIframe = useCallback(
    (radius: string) => {
      postToIframe({ type: "UPDATE_RADIUS", radius });
    },
    [postToIframe]
  );

  const sendColorsToIframe = useCallback(
    (themeConfig: ThemeConfig) => {
      const cssVars = generateBothModeColorVars(themeConfig);
      postToIframe({ type: "UPDATE_COLORS", cssVars });
    },
    [postToIframe]
  );

  const sendFontToIframe = useCallback(
    (font: string) => {
      let preset = getFontPreset(font);

      // Fallback to default font if preset not found
      if (!preset) {
        console.warn(
          `[PreviewCN] Unknown font "${font}", falling back to "${defaultFont}"`
        );
        preset = getFontPreset(defaultFont);
        if (!preset) return;
      }

      postToIframe({
        type: "UPDATE_FONT",
        fontId: preset.value,
        fontFamily: preset.fontFamily,
        googleFontsUrl: preset.googleFontsUrl,
      });
    },
    [postToIframe]
  );

  const updateConfig = useCallback(
    (updates: Partial<ThemeConfig>) => {
      setConfig((prev) => {
        const newConfig = { ...prev, ...updates };

        const keys = Object.keys(updates) as (keyof ThemeConfig)[];

        // Prefer granular messages for single-field updates.
        if (keys.length === 1) {
          const key = keys[0];
          if (key === "darkMode") {
            if (newConfig.darkMode !== null) {
              sendDarkModeToIframe(newConfig.darkMode);
            }
          } else if (key === "radius") {
            if (newConfig.radius !== null) {
              sendRadiusToIframe(newConfig.radius);
            }
          } else if (key === "colorPreset") {
            if (newConfig.colorPreset !== null) {
              sendColorsToIframe(newConfig);
            }
          } else if (key === "font") {
            if (newConfig.font !== null) {
              sendFontToIframe(newConfig.font);
            }
          } else {
            sendThemeToIframe(newConfig);
          }
        } else {
          sendThemeToIframe(newConfig);
        }

        onThemeChange?.(newConfig);
        return newConfig;
      });
    },
    [
      onThemeChange,
      sendThemeToIframe,
      sendDarkModeToIframe,
      sendRadiusToIframe,
      sendColorsToIframe,
      sendFontToIframe,
    ]
  );

  const handleIframeLoad = useCallback(() => {
    setIsIframeLoading(false);
    setIframeError(null);
  }, []);

  const handleIframeError = useCallback(() => {
    setIsIframeLoading(false);
    setIframeError(
      "Failed to load the target URL. Make sure the app is running."
    );
  }, []);

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

  const handleCopyCss = useCallback(async () => {
    const css = generateThemeCss(config);
    if (!css.trim()) {
      // No-op when there's nothing to export yet.
      return;
    }
    await navigator.clipboard.writeText(css);

    if (copiedResetTimeoutId.current !== null) {
      window.clearTimeout(copiedResetTimeoutId.current);
    }

    setCopied(true);
    copiedResetTimeoutId.current = window.setTimeout(() => {
      setCopied(false);
      copiedResetTimeoutId.current = null;
    }, 2000);
  }, [config]);

  return {
    config,
    updateConfig,
    copied,
    handleCopyCss,
    iframeRef,
    isIframeLoading,
    iframeError,
    handleIframeLoad,
    handleIframeError,
    targetUrl,
    inputUrl,
    setInputUrl,
    urlError,
    handleApplyUrl,
  };
}
