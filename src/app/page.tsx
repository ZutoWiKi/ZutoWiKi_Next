import React from "react";
import PageLayout from "@/components/PageLayout";
import RecommendedWorks from "@/components/RecommendedWorks";
import PurposeSection from "@/components/MainPurpose";
import AllWorksSection from "@/components/AllWorksSection";
import AllWritesSection from "@/components/AllWritesSection";

export default function HomePage() {
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-10">
          {/* 왼쪽 사이드바: 인기 작품 */}
          <div className="w-[26%]  hidden lg:block">
            <RecommendedWorks />
          </div>

          {/* 오른쪽 메인 콘텐츠 */}
          <main className="w-full lg:w-[74%] ">
            <div className="space-y-8">
              {/* 소개 섹션 */}
              <div className="text-center text-gray-600">
                <PurposeSection />
              </div>

              {/* 전체 작품 가로 스크롤 섹션 */}
              <AllWorksSection />

              {/* 전체 글 목록 섹션 */}
              <AllWritesSection />
            </div>
          </main>
        </div>
      </div>
    </PageLayout>
  );
}
