import type { GeneratedFile } from "../utils/file-generator";
import { generateColorPickerTemplate } from "./color-picker.template";
import { generateCssExportButtonTemplate } from "./css-export-button.template";
import { generateCssExportTemplate } from "./css-export.template";
import { generateDevtoolsTemplate } from "./devtools.template";
import { generateFontSelectorTemplate } from "./font-selector.template";
import { generateModeToggleTemplate } from "./mode-toggle.template";
import { generatePanelTemplate } from "./panel.template";
import { generatePresetSelectorTemplate } from "./preset-selector.template";
import { generateColorPresetSpecsTemplate } from "./presets/color-preset-specs.template";
import { generateColorsTemplate } from "./presets/colors.template";
import { generateFontsTemplate } from "./presets/fonts.template";
import { generatePresetsIndexTemplate } from "./presets/index.template";
import { generateRadiusTemplate } from "./presets/radius.template";
import { generateThemePresetsTemplate } from "./presets/theme-presets.template";
import { generateRadiusSelectorTemplate } from "./radius-selector.template";
import { generateThemeApplierTemplate } from "./theme-applier.template";
import { generateTriggerTemplate } from "./trigger.template";
import { generateUseThemeStateTemplate } from "./use-theme-state.template";

function generateMainIndexTemplate(): string {
  return `export { PreviewcnDevtools } from "./devtools";
`;
}

export function generateComponentFiles(): GeneratedFile[] {
  return [
    // Main exports
    { path: "index.ts", content: generateMainIndexTemplate() },
    { path: "devtools.tsx", content: generateDevtoolsTemplate() },
    { path: "trigger.tsx", content: generateTriggerTemplate() },
    { path: "panel.tsx", content: generatePanelTemplate() },

    // UI Components
    { path: "color-picker.tsx", content: generateColorPickerTemplate() },
    { path: "preset-selector.tsx", content: generatePresetSelectorTemplate() },
    { path: "radius-selector.tsx", content: generateRadiusSelectorTemplate() },
    { path: "font-selector.tsx", content: generateFontSelectorTemplate() },
    { path: "mode-toggle.tsx", content: generateModeToggleTemplate() },
    {
      path: "css-export-button.tsx",
      content: generateCssExportButtonTemplate(),
    },

    // Core logic
    { path: "theme-applier.ts", content: generateThemeApplierTemplate() },
    { path: "use-theme-state.ts", content: generateUseThemeStateTemplate() },
    { path: "css-export.ts", content: generateCssExportTemplate() },

    // Presets
    { path: "presets/index.ts", content: generatePresetsIndexTemplate() },
    { path: "presets/colors.ts", content: generateColorsTemplate() },
    {
      path: "presets/color-preset-specs.ts",
      content: generateColorPresetSpecsTemplate(),
    },
    { path: "presets/radius.ts", content: generateRadiusTemplate() },
    { path: "presets/fonts.ts", content: generateFontsTemplate() },
    {
      path: "presets/theme-presets.ts",
      content: generateThemePresetsTemplate(),
    },
  ];
}

// Re-export individual template generators for flexibility
export { generateColorPresetSpecsTemplate } from "./presets/color-preset-specs.template";
export { generateColorsTemplate } from "./presets/colors.template";
export { generateFontsTemplate } from "./presets/fonts.template";
export { generatePresetsIndexTemplate } from "./presets/index.template";
export { generateRadiusTemplate } from "./presets/radius.template";
export { generateThemePresetsTemplate } from "./presets/theme-presets.template";
export { generateThemeApplierTemplate } from "./theme-applier.template";
export { generateCssExportTemplate } from "./css-export.template";
export { generateUseThemeStateTemplate } from "./use-theme-state.template";
export { generateTriggerTemplate } from "./trigger.template";
export { generateModeToggleTemplate } from "./mode-toggle.template";
export { generateRadiusSelectorTemplate } from "./radius-selector.template";
export { generateColorPickerTemplate } from "./color-picker.template";
export { generatePresetSelectorTemplate } from "./preset-selector.template";
export { generateFontSelectorTemplate } from "./font-selector.template";
export { generateCssExportButtonTemplate } from "./css-export-button.template";
export { generatePanelTemplate } from "./panel.template";
export { generateDevtoolsTemplate } from "./devtools.template";
