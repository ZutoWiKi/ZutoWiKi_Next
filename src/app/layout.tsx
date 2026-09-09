import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import FloatingMenu from "@/components/FloatingMenu";
import { SITE_URL } from "@/config/site";

// 검색엔진 소유확인 코드. 어차피 페이지 소스에 그대로 노출되는 공개값이라
// 네이버 코드는 기본값으로 코드에 둔다. Vercel 환경변수가 있으면 그쪽이 우선한다.
// 값이 없으면 해당 meta 태그는 아예 렌더되지 않는다.
const NAVER_VERIFICATION_FALLBACK = "2c5c6643fcffedc68d8ddc987f78706799e4427f";
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const naverVerification =
  process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION ?? NAVER_VERIFICATION_FALLBACK;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "윤슬 | Yoonseul",
    template: "%s | Yoonseul",
  },
  // 홈 기준 정본 주소. 하위 페이지는 각자 generateMetadata 에서 덮어쓴다.
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": `${SITE_URL}/rss.xml`,
    },
  },
  verification: {
    google: googleVerification,
    other: naverVerification
      ? { "naver-site-verification": naverVerification }
      : {},
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/yoonseul_logo.svg",
  },
  description:
    "같은 파도에도 윤슬은 저마다 다르게 반짝입니다. 같은 작품에 대한 당신만의 시선을 나누고, 문학의 경계를 지워보세요.",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Yoonseul",
    locale: "ko_KR",
    title: {
      default: "🌊 [모든 문학 경계의 파괴] - 문학 소통의 장, 윤슬",
      template: "%s | Yoonseul",
    },
    description:
      "같은 파도에도 윤슬은 저마다 다르게 반짝입니다. 같은 작품에 대한 당신만의 시선을 나누고, 문학의 경계를 지워보세요.",
    images: ["/yoonseul_logo2.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <FloatingMenu />
        {children}
      </body>
    </html>
  );
}
