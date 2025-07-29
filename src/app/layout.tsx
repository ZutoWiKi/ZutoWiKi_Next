import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import FloatingMenu from "@/components/FloatingMenu";

export const metadata: Metadata = {
  title: "윤슬 | Yoonseul",
  description: "Developed by lgh, lhj",
  metadataBase: new URL("https://yoonseul.site/"),
  icons: {
    icon: "/yoonseul_logo.svg",
  },
  openGraph: {
    siteName: "yoonseul",
    title: "yoonseul",
    description: "문학 소통의 장",
    images: "/yoonseul_logo.svg",
    url: "https://yoonseul.site/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <FloatingMenu />
        {children}
      </body>
    </html>
  );
}
