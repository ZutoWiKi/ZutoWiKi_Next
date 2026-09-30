"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { CATEGORY_LIST } from "@/config/categories";
import { categoryPath } from "@/lib/writeLink";

export default function CategoryMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [currentType, setCurrentType] = useState<string>("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // pathname에서 type 추출 (예: /post/novel → novel)
    const pathSegments = pathname.split("/");
    const typeFromPath = pathSegments[pathSegments.length - 1];

    // post 페이지에 있고 type이 있는 경우에만 설정
    if (pathname.startsWith("/post/") && typeFromPath !== "post") {
      setCurrentType(typeFromPath.toLowerCase());
    } else {
      setCurrentType("");
    }
  }, [pathname]);

  // 외부 클릭시 메뉴 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCategoryClick = (type: string) => {
    setCurrentType(type);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 text-sm sm:text-base"
      >
        <span>글 쓰기</span>
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 sm:w-56 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/30 z-50 overflow-hidden">
          <div className="py-2">
            {CATEGORY_LIST.map((category) => {
              const isActive = currentType === category.type;

              // 진짜 링크로 둔다(새 탭으로 열기 가능). 누르면 메뉴만 닫고 이동은 링크가 한다.
              return (
                <Link
                  key={category.type}
                  href={categoryPath(category.type)}
                  prefetch={false}
                  onClick={() => handleCategoryClick(category.type)}
                  className={`w-full text-left px-4 py-3 transition-all duration-200 flex items-center justify-between ${
                    isActive
                      ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700"
                  }`}
                >
                  <span className="font-medium text-sm sm:text-base">
                    {category.name}
                  </span>
                  <span className="text-xs text-gray-400 hidden sm:inline">
                    {category.english}
                  </span>
                  {isActive && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
