import FloatingMenuWebsite from "@/components/FloatingMenu";
import React from "react";
import FloatingMenu from "@/components/FloatingMenu";

export default function MyAPP() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* 상단 헤더 */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ✨ 웹사이트
          </div>

          <div className="flex gap-3">
            <button className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition-all duration-200 hover:bg-gray-100 rounded-lg">
              로그인
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              회원가입
            </button>
          </div>
        </div>
      </header>

      <FloatingMenu />

      {/* 메인 콘텐츠 영역 (빈 공간) */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center text-gray-600">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ✨ 메인 콘텐츠 영역
          </h1>
          <p className="text-lg mb-2">
            카테고리 메뉴를 드래그하여 자유롭게 이동시킬 수 있습니다.
          </p>
          <p className="text-sm text-gray-500">
            15개의 카테고리가 세로로 배치되어 있습니다.
          </p>
        </div>
      </main>
    </div>
  );
}
