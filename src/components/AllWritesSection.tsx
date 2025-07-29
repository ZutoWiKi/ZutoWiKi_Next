"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GetAllWrites, AllWrite } from "@/components/API/GetAllWrites";

export default function AllWritesSection() {
  const [writes, setWrites] = useState<AllWrite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"time" | "time_old" | "views" | "likes">(
    "time",
  );
  const [displayCount, setDisplayCount] = useState(6);
  const router = useRouter();

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

  // 정렬된 글 목록
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

  const displayedWrites = sortedWrites.slice(0, displayCount);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">전체 해석글</h2>
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as "time" | "time_old" | "views" | "likes")
          }
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent self-end sm:self-auto"
        >
          <option value="time">최신순</option>
          <option value="time_old">오래된순</option>
          <option value="views">조회수순</option>
          <option value="likes">좋아요순</option>
        </select>
      </div>

      <div className="space-y-4">
        {displayedWrites.map((write) => (
          <div
            key={write.id}
            onClick={() =>
              router.push(`/post/${write.type_index}/${write.work_id}`)
            }
            className="bg-white rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
              <h3 className="font-bold text-gray-800 text-lg sm:text-xl line-clamp-2 leading-tight flex-1">
                {write.title}
              </h3>
              <div className="flex items-center gap-3 sm:gap-4 text-sm text-gray-500 sm:ml-4 sm:mt-1">
                <span className="flex items-center gap-1">
                  👁️ {write.views}
                </span>
                <span className="flex items-center gap-1">
                  ❤️ {write.likes}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <p className="text-xs sm:text-sm text-blue-600 font-medium">
                  ← {write.work_title}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">by {write.work_author}</p>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <span className="text-gray-700 font-medium">
                  {write.user_name}
                </span>
                <span>•</span>
                <span>{new Date(write.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {writes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✨</div>
          <p className="text-gray-500">아직 작성된 해석이 없습니다.</p>
        </div>
      )}

      {/* 더보기 버튼 */}
      {displayCount < sortedWrites.length && (
        <div className="text-center mt-8">
          <button
            onClick={() => setDisplayCount((prev) => prev + 6)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            더 많은 해석 보기 ({sortedWrites.length - displayCount}개 더)
          </button>
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
    </section>
  );
}
