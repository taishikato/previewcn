import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "previewcn - Real-time Theme Editor for shadcn/ui",
  description:
    "Preview and customize your shadcn/ui theme in real-time. Edit colors, radius, and modes with instant visual feedback on your actual application.",
  icons: {
    icon: "/logo.svg",
  },
  metadataBase: new URL("https://previewcn.vercel.app"),
  openGraph: {
    title: "previewcn - Real-time Theme Editor for shadcn/ui",
    description:
      "Preview and customize your shadcn/ui theme in real-time. Edit colors, radius, and modes with instant visual feedback on your actual application.",
    siteName: "previewcn",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "previewcn - Real-time Theme Editor for shadcn/ui",
    description:
      "Preview and customize your shadcn/ui theme in real-time. Edit colors, radius, and modes with instant visual feedback on your actual application.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
