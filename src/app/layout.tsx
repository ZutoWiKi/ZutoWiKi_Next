import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import FloatingMenu from "@/components/FloatingMenu";

export const metadata: Metadata = {
  metadataBase: new URL("https://yoonseul.site/"),
  title: {
    default: "윤슬 | Yoonseul",
    template: "%s | Yoonseul",
  },
  icons: {
    icon: "/yoonseul_logo.svg",
  },
  openGraph: {
    type: "website",
    url: "https://yoonseul.site/",
    siteName: "Yoonseul",
    title: {
      default: "🌊 [모든 문학 경계의 파괴] - 문학 소통의 장, 윤슬",
      template: "%s | Yoonseul",
    },
    description: "이거 왜이럼?",
    images: "/yoonseul_logo.svg",
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
