import React, { ReactNode } from "react";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

interface PageLayoutProps {
  children: ReactNode;
  floatingMenu?: ReactNode;
  headerTitle?: string;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 헤더. 갈래 목록·작품·글 페이지도 같은 머리줄을 쓴다. */}
      <SiteHeader />
      {children}
    </div>

    {/* 바닥글. 홈에서만 배포 버전을 함께 보여준다. */}
    <SiteFooter showVersion />
  </div>
  );
}
