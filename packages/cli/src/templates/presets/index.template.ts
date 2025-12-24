export function generatePresetsIndexTemplate(): string {
  return `export * from "./colors";
export * from "./color-preset-specs";
export * from "./fonts";
export * from "./radius";
export * from "./theme-presets";
`;
}
