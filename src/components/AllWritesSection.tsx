"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { GetAllWrites, AllWrite } from "@/components/API/GetAllWrites";
import { motion, useInView } from "framer-motion";

interface AnimatedWriteProps {
  write: AllWrite;
  onClick: () => void;
}

const AnimatedWrite: React.FC<AnimatedWriteProps> = ({ write, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.05, ease: "circIn" }}
      onClick={onClick}
      className="bg-white rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100 mx-1"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
        <h3 className="font-bold text-gray-800 text-lg sm:text-xl line-clamp-2 leading-tight flex-1">
          {write.title}
        </h3>
        <div className="flex items-center gap-3 sm:gap-4 text-sm text-gray-500 sm:ml-4 sm:mt-1">
          <span className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            {write.views}
          </span>
          <span className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {write.likes}
          </span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <p className="text-xs sm:text-sm text-blue-600 font-medium">
            ← {write.work_title}
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            by {write.work_author}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
          <span className="text-gray-700 font-medium">{write.user_name}</span>
          <span>•</span>
          <span>{new Date(write.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );
};

// 빈 카드 컴포넌트 (공간 확보용)
const EmptyCard: React.FC = () => (
  <div className="bg-transparent rounded-xl p-3 sm:p-4 mx-1 invisible">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
      <h3 className="font-bold text-gray-800 text-lg sm:text-xl line-clamp-2 leading-tight flex-1">
        임시 제목
      </h3>
      <div className="flex items-center gap-3 sm:gap-4 text-sm text-gray-500 sm:ml-4 sm:mt-1">
        <span className="flex items-center gap-1">0</span>
        <span className="flex items-center gap-1">0</span>
      </div>
    </div>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <p className="text-xs sm:text-sm text-blue-600 font-medium">← 임시</p>
        <p className="text-xs sm:text-sm text-gray-500">by 임시</p>
      </div>
      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
        <span className="text-gray-700 font-medium">임시</span>
        <span>•</span>
        <span>2024.01.01</span>
      </div>
    </div>
  </div>
);

export default function AllWritesSection() {
  const [writes, setWrites] = useState<AllWrite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"time" | "time_old" | "views" | "likes">(
    "time",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const itemsPerPage = 15;
  const router = useRouter();

  // 컨테이너 높이 추적을 위한 ref
  const contentRef = useRef<HTMLDivElement>(null);
  const [minHeight, setMinHeight] = useState<number>(0);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const writesList = await GetAllWrites(token);
        setWrites(writesList);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "데이터를 불러오는데 실패했습니다.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 페이지 변경 후 높이 업데이트
  useEffect(() => {
    if (contentRef.current && !isAnimating) {
      const currentHeight = contentRef.current.scrollHeight;
      if (currentHeight > minHeight) {
        setMinHeight(currentHeight);
      }
    }
  }, [currentPage, isAnimating]);

  const sortedWrites = [...writes].sort((a, b) => {
    switch (sortBy) {
      case "views":
        return b.views - a.views;
      case "likes":
        return b.likes - a.likes;
      case "time_old":
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case "time":
      default:
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
  });

  const totalPages = Math.ceil(sortedWrites.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedWrites = sortedWrites.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // 빈 카드로 최소 높이 확보
  const renderContent = () => {
    const content = displayedWrites.map((write) => (
      <AnimatedWrite
        key={write.id}
        write={write}
        onClick={() =>
          router.push(`/post/${write.type_index}/${write.work_id}`)
        }
      />
    ));

    // 현재 페이지의 아이템이 최대 개수보다 적으면 빈 카드로 채움
    const emptySlots = itemsPerPage - displayedWrites.length;
    if (emptySlots > 0) {
      for (let i = 0; i < emptySlots; i++) {
        content.push(<EmptyCard key={`empty-${i}`} />);
      }
    }

    return content;
  };

  const handlePageChange = (page: number) => {
    if (page === currentPage || isAnimating) return;

    // 현재 스크롤 위치 저장
    const scrollY = window.scrollY;

    setIsAnimating(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsAnimating(false);

      // 스크롤 위치 복원 (약간의 지연 후)
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
    }, 150);
  };

  const handleSortChange = (
    newSort: "time" | "time_old" | "views" | "likes",
  ) => {
    setSortBy(newSort);
    setCurrentPage(1);
    setMinHeight(0); // 정렬 변경 시 높이 초기화
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (loading) {
    return (
      <section className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">전체 해석글</h2>
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">전체 해석글</h2>
        <div className="text-center text-red-500 py-8">{error}</div>
      </section>
    );
  }

  return (
    <section className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-4 sm:p-6">
      <div className="px-1 sm:px-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            전체 해석글
          </h2>
          <select
            value={sortBy}
            onChange={(e) =>
              handleSortChange(
                e.target.value as "time" | "time_old" | "views" | "likes",
              )
            }
            className="px-1 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent self-end sm:self-auto"
          >
            <option value="time">최신순</option>
            <option value="time_old">오래된순</option>
            <option value="views">조회수순</option>
            <option value="likes">좋아요순</option>
          </select>
        </div>

        <div className="overflow-visible py-2 px-1">
          <div
            ref={contentRef}
            className="space-y-6 transition-all duration-300"
            style={{
              minHeight: minHeight > 0 ? `${minHeight}px` : "auto",
            }}
          >
            {renderContent()}
          </div>
        </div>

        {writes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✨</div>
            <p className="text-gray-500">아직 작성된 해석이 없습니다.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1 || isAnimating}
              className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isAnimating}
              className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                disabled={isAnimating}
                className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none ${
                  currentPage === pageNum
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white border border-gray-200"
                }`}
              >
                {pageNum}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isAnimating}
              className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || isAnimating}
              className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="text-center mt-4 text-sm text-gray-500">
            {currentPage} / {totalPages} 페이지
          </div>
        )}

        <style jsx>{`
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
    </section>
  );
}
