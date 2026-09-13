"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { GetAllWorks, AllWork } from "@/components/API/GetAllWorks";
import { workPath } from "@/lib/writeLink";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface AllWorksSectionProps {
  /**
   * 서버가 미리 받아온 목록. 있으면 첫 화면을 바로 그려서 검색엔진이 작품 링크를
   * 읽을 수 있고, 브라우저에서는 뒤에서 조용히 최신으로 맞춘다.
   */
  initialWorks?: AllWork[];
}

export default function AllWorksSection({
  initialWorks,
}: AllWorksSectionProps) {
  const [works, setWorks] = useState<AllWork[]>(initialWorks ?? []);
  const [loading, setLoading] = useState(!initialWorks);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInitial = Boolean(initialWorks);

  useEffect(() => {
    (async () => {
      try {
        const worksList = await GetAllWorks();
        setWorks(worksList);
      } catch (err) {
        // 서버가 준 목록이 이미 보이고 있으면 그대로 둔다.
        if (hasInitial) return;
        setError(
          err instanceof Error
            ? err.message
            : "데이터를 불러오는데 실패했습니다.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [hasInitial]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <section className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          모든 작품 둘러보기
        </h2>
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          모든 작품 둘러보기
        </h2>
        <div className="text-center text-red-500 py-8">{error}</div>
      </section>
    );
  }

  return (
    <section className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">모든 작품 둘러보기</h2>
        <div className="flex gap-2 self-end sm:self-auto">
          <button
            onClick={scrollLeft}
            className="p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
          <button
            onClick={scrollRight}
            className="p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {works.map((work) => (
          // 진짜 링크로 둔다. 클릭 핸들러로만 이동하면 검색엔진이 작품으로 가는 길을 못 찾는다.
          <Link
            key={work.id}
            href={workPath(work.type_index, work.id)}
            prefetch={false}
            className="flex-shrink-0 w-36 sm:w-48 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-100"
          >
            {/* 표지 이미지 */}
            <div className="h-48 sm:h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-t-xl flex items-center justify-center overflow-hidden">
              {work.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={work.coverImage}
                  alt={work.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-4xl sm:text-6xl">📖</div>
              )}
            </div>

            {/* 작품 정보 */}
            <div className="p-3 sm:p-4">
              <h3 className="font-bold text-gray-800 text-xs sm:text-sm mb-1 line-clamp-2 leading-tight">
                {work.title}
              </h3>
              <p className="text-xs text-gray-500">— {work.author}</p>
            </div>
          </Link>
        ))}
      </div>

      {works.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-gray-500">등록된 작품이 없습니다.</p>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
