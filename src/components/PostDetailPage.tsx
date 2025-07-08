"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AnimatedList from "./AnimatedList";
import { useCallback } from "react";
import { GetWorkDetail } from "@/components/API/GetWorkDetail";
import { GetWritesList } from "@/components/API/GetWriteList";
import { UpdateWriteLike } from "@/components/API/UpdateWriteLikes";
import { UpdateWriteViews } from "@/components/API/UpdateWriteViews";
import Counter from "./Counter"; // Counter 컴포넌트 import

interface PostDetailPageProps {
  workId: string;
  type: string;
}

interface Write {
  id: number;
  title: string;
  user_name: string;
  content: string;
  work_title: string;
  work_author: string;
  created_at: string;
  views: number;
  likes: number;
  parentID: number;
}

interface Work {
  id: number;
  title: string;
  author: string;
  coverImage?: string;
  description: string;
}

export default function PostDetailPage({ workId, type }: PostDetailPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [writes, setWrites] = useState<Write[]>([]);
  const [selectedWrite, setSelectedWrite] = useState<Write | null>(null);
  const [workInfo, setWorkInfo] = useState<Work | null>(null);
  const [sortBy, setSortBy] = useState<"time" | "views" | "likes">("time");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 데이터 로딩 함수
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 작품 정보와 해석글 목록을 병렬로 가져오기
      const [workData, writesData] = await Promise.all([
        GetWorkDetail(workId),
        GetWritesList(workId),
      ]);

      setWorkInfo(workData);
      setWrites(writesData);

      // 첫 번째 해석글을 기본 선택
      if (writesData.length > 0) {
        setSelectedWrite(writesData[0]);
      }
    } catch (err) {
      console.error("데이터 로딩 에러:", err);
      setError(
        err instanceof Error
          ? err.message
          : "데이터를 불러오는데 실패했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }, [workId]);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, [loadData]);

  const goToWirte = useCallback(() => {
    router.push(`${pathname}/write`);
  }, [router, pathname]);

  // 해석글 선택 시 조회수 증가
  const handleWriteSelect = useCallback(
    async (item: string, index: number) => {
      const selectedWrite = sortedWrites[index];
      setSelectedWrite(selectedWrite);

      try {
        // 조회수 증가
        const updatedWrite = await UpdateWriteViews(selectedWrite.id);

        // 상태 업데이트
        setWrites((prev) =>
          prev.map((write) =>
            write.id === selectedWrite.id
              ? { ...write, views: updatedWrite.views }
              : write,
          ),
        );

        setSelectedWrite((prev) =>
          prev ? { ...prev, views: updatedWrite.views } : null,
        );
      } catch (error) {
        console.error("조회수 업데이트 실패:", error);
      }
    },
    [writes, sortBy],
  );

  // 좋아요 처리
  const handleLike = useCallback(async () => {
    if (!selectedWrite) return;

    try {
      const updatedWrite = await UpdateWriteLike(selectedWrite.id, "increase");

      // 상태 업데이트
      setWrites((prev) =>
        prev.map((write) =>
          write.id === selectedWrite.id
            ? { ...write, likes: updatedWrite.likes }
            : write,
        ),
      );

      setSelectedWrite((prev) =>
        prev ? { ...prev, likes: updatedWrite.likes } : null,
      );
    } catch (error) {
      console.error("좋아요 업데이트 실패:", error);
    }
  }, [selectedWrite]);

  // 정렬된 해석글 목록
  const sortedWrites = [...writes].sort((a, b) => {
    switch (sortBy) {
      case "views":
        return b.views - a.views;
      case "likes":
        return b.likes - a.likes;
      case "time":
      default:
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
  });

  // AnimatedList를 위한 아이템 문자열 배열 생성
  const listItems = sortedWrites.map((write) => write.title);

  // 숫자의 자릿수에 따라 places 배열 생성
  const getPlacesArray = (num: number) => {
    if (num === 0) return [1];
    const places = [];
    let temp = num;
    let place = 1;
    while (temp > 0) {
      places.unshift(place);
      temp = Math.floor(temp / 10);
      place *= 10;
    }
    return places;
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="text-xl text-gray-600">데이터를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button
            onClick={() => loadData()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!workInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">
          작품 정보를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  const selectedIndex = selectedWrite
    ? sortedWrites.findIndex((w) => w.id === selectedWrite.id)
    : -1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* 작품 정보 헤더 */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
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
            <div className="flex items-center gap-4">
              {workInfo.coverImage && (
                <img
                  src={workInfo.coverImage}
                  alt={workInfo.title}
                  className="w-16 h-20 object-cover rounded-lg shadow-md"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {workInfo.title}
                </h1>
                <p className="text-gray-600">작가: {workInfo.author}</p>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Counter
                    value={writes.length}
                    fontSize={14}
                    places={getPlacesArray(writes.length)}
                    textColor="#6B7280"
                    fontWeight="normal"
                    gap={1}
                    horizontalPadding={0}
                    gradientHeight={0}
                  />
                  <span>개의 해석이 있습니다</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 min-h-[calc(100vh-140px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* 왼쪽: 선택된 해석 상세 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
            {selectedWrite ? (
              <div className="h-full flex flex-col">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 leading-relaxed">
                    {selectedWrite.title}
                  </h3>
                  <div className="flex items-center justify-between text-gray-600 text-sm mb-4">
                    <span>{selectedWrite.user_name}</span>
                    <span>
                      {new Date(selectedWrite.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
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
                      <Counter
                        value={selectedWrite.views}
                        fontSize={14}
                        places={getPlacesArray(selectedWrite.views)}
                        textColor="#6B7280"
                        fontWeight="normal"
                        gap={2}
                        horizontalPadding={0}
                        gradientHeight={0}
                      />
                    </div>
                    <div className="flex items-center gap-2">
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
                      <Counter
                        value={selectedWrite.likes}
                        fontSize={14}
                        places={getPlacesArray(selectedWrite.likes)}
                        textColor="#6B7280"
                        fontWeight="normal"
                        gap={2}
                        horizontalPadding={0}
                        gradientHeight={0}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedWrite.content}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex gap-3">
                    <button
                      onClick={handleLike}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300"
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
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      좋아요
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300">
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
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                        />
                      </svg>
                      공유
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-lg">
                    해석을 선택해서 읽어보세요
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    왼쪽 목록에서 관심있는 해석을 클릭하세요
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 오른쪽: 해석 목록 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6 flex flex-col h-[calc(100vh-200px)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">해석 목록</h2>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "time" | "views" | "likes")
                }
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="time">최신순</option>
                <option value="views">조회수순</option>
                <option value="likes">좋아요순</option>
              </select>
            </div>

            {writes.length > 0 ? (
              <AnimatedList
                items={listItems}
                onItemSelect={handleWriteSelect}
                showGradients={true}
                enableArrowNavigation={true}
                className="w-full"
                itemClassName="hover:bg-blue-50 transition-all duration-300"
                displayScrollbar={false}
                initialSelectedIndex={selectedIndex}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-lg">아직 해석이 없습니다</p>
                  <p className="text-gray-400 text-sm mt-2">
                    첫 번째 해석을 작성해보세요!
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={goToWirte}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                새 해석 작성
              </button>
              {selectedWrite && (
                <button
                  onClick={goToWirte}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border border-gray-200 font-medium transition-all duration-300 transform hover:-translate-y-1"
                >
                  파생 해석
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 플로팅 네비게이션 */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40">
        <button
          onClick={goToWirte}
          className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
        >
          <svg
            className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
