"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import {
  defaultThemeConfig,
  generateCssVars,
  generateThemeCss,
} from "@/lib/theme-presets";
import type { ThemeConfig } from "@/lib/theme-presets";
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

  const sendThemeToIframe = useCallback((themeConfig: ThemeConfig) => {
    const cssVars = generateCssVars(themeConfig);
    iframeRef.current?.contentWindow?.postMessage(
      { type: "APPLY_THEME", cssVars, darkMode: themeConfig.darkMode },
      "*"
    );
  }, []);

  const updateConfig = useCallback(
    (updates: Partial<ThemeConfig>) => {
      setConfig((prev) => {
        const newConfig = { ...prev, ...updates };
        sendThemeToIframe(newConfig);
        onThemeChange?.(newConfig);
        return newConfig;
      });
    },
    [onThemeChange, sendThemeToIframe]
  );

  const handleIframeLoad = useCallback(() => {
    setIsIframeLoading(false);
    setIframeError(null);
    sendThemeToIframe(config);
  }, [config, sendThemeToIframe]);

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
