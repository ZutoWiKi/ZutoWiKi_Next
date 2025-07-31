import React, { ReactNode } from "react";
import Link from "next/link";
import AuthButtons from "./Auth";
import CategoryMenu from "./CategoryMenu";

interface PageLayoutProps {
  children: ReactNode;
  floatingMenu?: ReactNode;
  headerTitle?: string;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 헤더 */}
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
      {children}
    </div>

    <div>
      <header className="bg-black/15 backdrop-blur-md shadow-lg border-b border-white/20 px-4 sm:px-6 sm:py-7.5">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity cursor-pointer"
            >
            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            Yoonseul
            </p>
            <img  src="/yoonseul_logo.svg" 
                  alt="윤슬 로고" 
                  className="w-6 h-6 sm:w-10 sm:h-10"
            />
            </Link>
            <Link
              href="https://github.com/ZutoWiKi"
              className="flex items-center gap-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity cursor-pointer"
            >
            <img  src="/github_logo.svg" 
                  alt="깃허브" 
                  className="w-6 h-6 px-1 py-1 sm:w-10 sm:h-10"
            />
            </Link>
            <Link
              href="https://www.instagram.com/yoonseul0617/"
              className="flex items-center gap-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity cursor-pointer"
            >
              <img  src="/insta_logo.svg" 
                  alt="인스타" 
                  className="w-6 h-6 px-1 py-1 sm:w-10 sm:h-10"
              />
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex justify-center items-center py-1 font-bold">
          <p>developed by&nbsp;</p> 
          <a href="https://github.com/berryprince30" className="flex items-center gap-2 font-bold bg-gradient-to-r from-pink-600 to-pink-400  bg-clip-text text-transparent hover:opacity-80 transition-opacity cursor-pointer">
          berryprince30</a> 
          <p>,&nbsp;</p> 
          <a href="https://github.com/LOOPARAM" className="flex items-center gap-2 font-bold bg-gradient-to-r from-blue-400 via-pink-400 to-orange-300 bg-clip-text text-transparent hover:opacity-80 transition-opacity cursor-pointer">
          LOOPARAM</a>
        </div>

      </header>
    </div>
  </div>
  );
}
