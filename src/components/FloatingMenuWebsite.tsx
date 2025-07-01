"use client";
import React, { useState, useRef, useEffect } from "react";

export default function FloatingMenuWebsite() {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 100 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (
      e.target instanceof Element &&
      e.target.closest(".drag-handle") &&
      menuRef.current
    ) {
      setIsDragging(true);
      const rect = menuRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e: any) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const categories = [
    { name: "🏠 홈", desc: "Home" },
    { name: "📱 제품", desc: "Products" },
    { name: "⚙️ 서비스", desc: "Services" },
    { name: "🏢 회사소개", desc: "About Us" },
    { name: "📝 블로그", desc: "Blog" },
    { name: "💼 포트폴리오", desc: "Portfolio" },
    { name: "📊 분석", desc: "Analytics" },
    { name: "🛠️ 도구", desc: "Tools" },
    { name: "📚 리소스", desc: "Resources" },
    { name: "🎯 마케팅", desc: "Marketing" },
    { name: "👥 커뮤니티", desc: "Community" },
    { name: "📞 고객지원", desc: "Support" },
    { name: "💬 문의하기", desc: "Contact" },
    { name: "⚡ 업데이트", desc: "Updates" },
    { name: "🔒 보안", desc: "Security" },
  ];

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

      {/* 둥둥 떠다니는 카테고리 메뉴 윈도우 */}
      <div
        ref={menuRef}
        className="fixed bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/30 select-none z-50 transition-all duration-300"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          minWidth: "280px",
          maxHeight: "80vh",
        }}
        onMouseDown={handleMouseDown}
      >
        {/* 윈도우 타이틀바 */}
        <div className="drag-handle bg-gradient-to-r from-gray-100 to-gray-200 rounded-t-xl px-4 py-3 border-b border-gray-200/50 cursor-move flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">
              📋 카테고리 메뉴
            </span>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded p-1 transition-all duration-200"
          >
            {isCollapsed ? "▼" : "▲"}
          </button>
        </div>

        {/* 카테고리 메뉴 목록 */}
        {!isCollapsed && (
          <div className="py-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {categories.map((category, index) => (
              <button
                key={index}
                className="w-full px-5 py-3 text-left text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 transition-all duration-200 border-b border-gray-100/50 last:border-b-0 font-medium group flex items-center justify-between"
              >
                <span className="text-sm">{category.name}</span>
                <span className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors">
                  {category.desc}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* 윈도우 하단 */}
        <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-xl border-t border-gray-200/50">
          <div className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
            <span>🖱️</span>
            <span>드래그하여 이동 가능</span>
          </div>
        </div>
      </div>

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
