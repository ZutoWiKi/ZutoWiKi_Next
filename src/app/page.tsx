import React from 'react';
import PageLayout from '@/components/PageLayout';
import RecommendedWorks from '@/components/RecommendedWorks';
import PurposeSection from '@/components/MainPurpose';

export default function HomePage() {
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-6 py-12 flex gap-10">
        {/* 왼쪽 사이드바: 인기 작품 */}
        <div className="w-1/4 hidden lg:block">
          <RecommendedWorks />
        </div>

        {/* 오른쪽 메인 콘텐츠 */}
        <main className="w-full lg:w-3/4">
          <div className="text-center text-gray-600">
            <PurposeSection />
            {/* <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ✨ 메인 콘텐츠 영역
            </h1>
            <p className="text-lg mb-2">안녕하세여~</p>
            <p className="text-sm text-gray-500">안녕히가세여~</p> */}
          </div>
        </main>
      </div>
    </PageLayout>
  );
}