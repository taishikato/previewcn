import { ThemeEditor } from "@/components/theme-editor";

export default function Home() {
  // Priority: env var (from CLI) > localStorage > default (handled in useThemeEditor)
  const envTargetUrl = process.env.PREVIEWCN_TARGET_URL;

  return <ThemeEditor initialUrl={envTargetUrl} />;
}
