import React, { ReactNode } from "react";
import Link from "next/link";
import AuthButtons from "./Auth";

interface PageLayoutProps {
  children: ReactNode;
  floatingMenu?: ReactNode;
  headerTitle?: string;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity cursor-pointer"
          >
            Yoonseul
          </Link>
          <AuthButtons />
        </div>
      </header>

      {children}
    </div>
  );
}
