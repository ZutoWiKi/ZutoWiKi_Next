import FloatingMenu from "@/components/FloatingMenu";
import React from "react";
import PageLayout from "@/components/PageLayout";

export default function MyAPP() {
  return (
    <PageLayout>
      <FloatingMenu />

      {/* 메인 콘텐츠 영역 (빈 공간) */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center text-gray-600">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ✨ 메인 콘텐츠 영역
          </h1>
          <p className="text-lg mb-2">안녕하세여~</p>
          <p className="text-sm text-gray-500">안녕히가세여~</p>
        </div>
      </main>
    </PageLayout>
  );
}
