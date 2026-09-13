import React from "react";
import PageLayout from "@/components/PageLayout";
import RecommendedWorks from "@/components/RecommendedWorks";
import PurposeSection from "@/components/MainPurpose";
import AllWorksSection from "@/components/AllWorksSection";
import AllWritesSection from "@/components/AllWritesSection";
import { HOME_WRITES_PAGE_SIZE } from "@/config/lists";
import {
  fetchAllWorks,
  fetchLatestWrites,
  fetchPopularWorks,
} from "@/lib/serverApi";

export default async function HomePage() {
  // 첫 HTML 에 작품·글 목록과 링크가 들어가도록 서버에서 먼저 받는다.
  // 하나라도 실패하면 그 섹션만 예전처럼 브라우저에서 받는다.
  const [works, latestWrites, popularByWrites, popularByLikes] =
    await Promise.all([
      fetchAllWorks(),
      fetchLatestWrites(HOME_WRITES_PAGE_SIZE),
      fetchPopularWorks("writes"),
      fetchPopularWorks("likes"),
    ]);

  // 인기 작품은 모바일·데스크톱용으로 두 번 그리므로 한 번 받아 같이 넘긴다.
  const popular =
    popularByWrites && popularByLikes
      ? { byWrites: popularByWrites, byLikes: popularByLikes }
      : undefined;

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* 오른쪽 메인 콘텐츠 */}
          <main className="w-full lg:w-[74%] lg:order-2">
            <div className="space-y-6 sm:space-y-8">
              {/* 소개 섹션 */}
              <div className="text-center text-gray-600">
                <PurposeSection />
              </div>

              {/* 모바일에서만 보이는 사이드바 - 소개와 전체 작품 사이에 위치 */}
              <div className="block lg:hidden">
                <RecommendedWorks initial={popular} />
              </div>

              {/* 전체 작품 가로 스크롤 섹션 */}
              <AllWorksSection initialWorks={works ?? undefined} />

              {/* 전체 글 목록 섹션 */}
              <AllWritesSection initialPage={latestWrites ?? undefined} />
            </div>
          </main>

          {/* 왼쪽 사이드바: 인기 작품 - 데스크톱에서만 표시 */}
          <div className="hidden lg:block lg:w-[26%] lg:order-1">
            <RecommendedWorks initial={popular} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
