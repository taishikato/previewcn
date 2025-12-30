// Radius presets for border-radius customization

export type RadiusPreset = {
  name: string;
  label: string;
  value: string;
};

export const radiusPresets: RadiusPreset[] = [
  { name: "none", label: "None", value: "0rem" },
  { name: "sm", label: "SM", value: "0.25rem" },
  { name: "md", label: "MD", value: "0.375rem" },
  { name: "lg", label: "LG", value: "0.5rem" },
  { name: "xl", label: "XL", value: "0.75rem" },
];

export function getRadiusPreset(name: string): RadiusPreset | undefined {
  return radiusPresets.find((p) => p.name === name);
}
