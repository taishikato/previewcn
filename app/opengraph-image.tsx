import { ImageResponse } from "next/og";

import { SocialImage } from "@/lib/social-image";

export const runtime = "edge";
export const alt = "previewcn - Real-time Theme Editor for shadcn/ui";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(<SocialImage />, {
    ...size,
  });
}
