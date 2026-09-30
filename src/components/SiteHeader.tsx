import React from "react";
import Link from "next/link";
import AuthButtons from "./Auth";
import CategoryMenu from "./CategoryMenu";

/**
 * 페이지 맨 위 머리줄(로고 홈 버튼 · 글 쓰기 메뉴 · 로그인).
 *
 * 예전에는 홈(PageLayout)에만 있어서 갈래 목록·작품·글 페이지로 들어가면 로고 홈 버튼이
 * 사라졌다. 어느 페이지에서든 같은 자리에 보이도록 공통 부품으로 뺐다.
 */
export default function SiteHeader() {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 px-4 sm:px-6 py-3 sm:py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity cursor-pointer"
          >
            <img
              src="/yoonseul_logo.svg"
              alt="윤슬 로고"
              className="w-6 h-6 sm:w-8 sm:h-8"
            />
            Yoonseul
          </Link>
          <CategoryMenu />
        </div>
        <AuthButtons />
      </div>
    </header>
  );
}
