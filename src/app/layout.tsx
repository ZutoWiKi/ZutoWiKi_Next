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
  description:
    "햇빛이나 달빛이 바다나 파도에 비치어 반짝이는 잔물결인 윤슬처럼,\n같은 파도와 물결에 다양한 윤슬이 생길 수 있는 것처럼,\n같은 문학작품에서 당신만의 시선과 해석을 모두와 공유하세요!\n경계가 없는 파도처럼, 문학의 경계를 없애보세요!",
  openGraph: {
    type: "website",
    url: "https://yoonseul.site/",
    siteName: "Yoonseul",
    title: {
      default: "🌊 [모든 문학 경계의 파괴] - 문학 소통의 장, 윤슬",
      template: "%s | Yoonseul",
    },
    description:
      "햇빛이나 달빛이 바다나 파도에 비치어 반짝이는 잔물결인 윤슬처럼,\n같은 파도와 물결에 다양한 윤슬이 생길 수 있는 것처럼,\n같은 문학작품에서 당신만의 시선과 해석을 모두와 공유하세요!\n경계가 없는 파도처럼, 문학의 경계를 없애보세요!",
    images: ["https://yoonseul.site/yoonseul_logo2.png"],
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
