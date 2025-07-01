"use client";
import React, { useState, useRef, useEffect } from "react";

export default function FloatingMenu() {
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
    <>
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
    </>
  );
}
