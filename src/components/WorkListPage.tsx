"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { GetWorksList } from "@/components/API/GetWorksList";
import { PostWork } from "@/components/API/PostWork";
import { getToken } from "@/components/API/session";
import Breadcrumbs from "@/components/Breadcrumbs";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { CATEGORY_NAMES } from "@/config/categories";
import { workPath } from "@/lib/writeLink";

// 타입 인덱스 매핑
const typeIndexMap = {
  novel: 0,
  poem: 1,
  music: 2,
  game: 3,
  movie: 4,
  performance: 5,
  animation: 6,
  essay: 7,
  webtoon: 8,
};

export interface Work {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  /** 그 작품에 달린 해석글 수. 정렬과 "해석 N편" 표시에 쓴다. */
  write_count?: number;
  /** 그 작품의 해석글들이 받은 좋아요 총합 */
  total_likes?: number;
  /** 가장 최근 해석글 시각. 작품에는 등록 시각이 없어서 "최근" 의 기준으로 쓴다. */
  latest_write_at?: string | null;
  /** 지금 목록 맨 위에 고정된 작품인지. 기간이 지난 고정은 백엔드가 false 로 준다. */
  pinned?: boolean;
  /** 고정 배지에 쓸 문구. 관리자가 적지 않으면 백엔드가 기본 문구를 채워 준다. */
  pin_label?: string;
}

/** 배지 문구를 못 받았을 때 쓸 기본값. 백엔드 WORK_PIN_DEFAULT_LABEL 과 같다. */
const DEFAULT_PIN_LABEL = "이벤트 중";

/** 고정 중이면 배지에 쓸 문구, 아니면 빈 문자열. */
function pinBadge(work: Work): string {
  if (!work.pinned) return "";
  return work.pin_label?.trim() || DEFAULT_PIN_LABEL;
}

/** 정렬 기준. 값은 백엔드의 ?sort= 와 같은 이름을 쓴다. */
type WorkSort = "writes" | "updated" | "new" | "old" | "likes" | "title";

const SORT_LABELS: { value: WorkSort; label: string }[] = [
  { value: "writes", label: "해석 많은 순" },
  { value: "updated", label: "최근 해석순" },
  { value: "new", label: "최근 등록순" },
  { value: "old", label: "먼저 등록순" },
  { value: "likes", label: "좋아요순" },
  { value: "title", label: "가나다순" },
];

const num = (v: number | undefined) => v ?? 0;
const time = (v: string | null | undefined) =>
  v ? new Date(v).getTime() : Number.NEGATIVE_INFINITY;
const byTitle = (a: Work, b: Work) =>
  a.title.localeCompare(b.title, "ko") || a.id - b.id;

/**
 * 고정한 작품을 먼저. 보는 사람이 어떤 정렬을 고르든 맨 위에 남아야 한다
 * (백엔드도 같은 규칙으로 정렬해서 준다).
 */
const pinnedFirst = (a: Work, b: Work) =>
  Number(Boolean(b.pinned)) - Number(Boolean(a.pinned));

/** 고정 우선 규칙을 비교 함수 앞에 붙인다. */
const withPinned =
  (compare: (a: Work, b: Work) => number) => (a: Work, b: Work) =>
    pinnedFirst(a, b) || compare(a, b);

/**
 * 화면에서 다시 정렬할 때 쓰는 비교 함수.
 *
 * 기본값("writes")은 서버가 이미 그 순서로 주므로 목록을 건드리지 않는다.
 * 서버 정렬과 브라우저 정렬이 미세하게 달라 첫 화면이 어긋나는 걸 막는다.
 */
const SORT_COMPARATORS: Record<
  Exclude<WorkSort, "writes">,
  (a: Work, b: Work) => number
> = {
  updated: withPinned(
    (a, b) =>
      time(b.latest_write_at) - time(a.latest_write_at) ||
      num(b.write_count) - num(a.write_count) ||
      byTitle(a, b),
  ),
  new: withPinned((a, b) => b.id - a.id),
  old: withPinned((a, b) => a.id - b.id),
  likes: withPinned(
    (a, b) =>
      num(b.total_likes) - num(a.total_likes) ||
      num(b.write_count) - num(a.write_count) ||
      byTitle(a, b),
  ),
  title: withPinned(byTitle),
};

interface WorkListPageProps {
  type: string;
  /**
   * 서버가 미리 받아온 작품 목록. 있으면 첫 HTML 에 목록과 작품 링크가 들어가서
   * 검색엔진이 읽을 수 있다. 서버도 캐시 없이 방금 받은 값이라 브라우저에서 다시 받지 않는다.
   */
  initialWorks?: Work[];
}

export default function WorkListPage({
  type,
  initialWorks,
}: WorkListPageProps) {
  const [works, setWorks] = useState<Work[]>(initialWorks ?? []);
  const [sortBy, setSortBy] = useState<WorkSort>("writes");
  const [loading, setLoading] = useState(!initialWorks);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newWork, setNewWork] = useState({
    title: "",
    author: "",
    description: "",
    coverImage: "",
  });

  // Move fetchWorks outside of useEffect to avoid dependency warning
  const fetchWorks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await GetWorksList(type);
      setWorks(data.works || data || []);
    } catch (err) {
      console.error("작품 목록 로딩 에러:", err);
      setError(
        err instanceof Error
          ? err.message
          : "작품 목록을 불러오는데 실패했습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

  // 서버가 목록을 이미 줬으면 처음에는 다시 받지 않는다. 갈래가 바뀌면 페이지가
  // 컴포넌트를 새로 만들므로(key={type}) 이 판단은 처음 한 번만 필요하다.
  //
  // 예전에는 여기서 mounted 전이면 "Loading..." 만 그렸다. 그래서 서버가 보내는
  // 첫 HTML 에 목록이 없었다.
  const skipFirstFetch = useRef(Boolean(initialWorks));

  useEffect(() => {
    if (skipFirstFetch.current) {
      skipFirstFetch.current = false;
      return;
    }
    fetchWorks();
  }, [type]); // Remove fetchWorks from dependency array to avoid warning

  // 서버가 이미 "해석 많은 순"으로 주므로 기본값일 때는 그대로 둔다.
  const sortedWorks = useMemo(() => {
    if (sortBy === "writes") return works;
    return [...works].sort(SORT_COMPARATORS[sortBy]);
  }, [works, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">작품 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            오류가 발생했습니다
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchWorks}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 갈래 이름은 메타데이터와 같은 표를 쓴다. 표에 없는 갈래는 주소 조각을 그대로 보여준다.
  const categoryName = CATEGORY_NAMES[type] ?? type;

  const handleAddWork = async () => {
    if (!newWork.title || !newWork.author) {
      return;
    }

    const token = getToken();
    if (!token) {
      setError("작품을 추가하려면 로그인이 필요합니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      newWork.coverImage = newWork.coverImage
        ? newWork.coverImage
        : "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop";

      const workData = {
        typeindex: typeIndexMap[type as keyof typeof typeIndexMap],
        title: newWork.title,
        author: newWork.author,
        description: newWork.description,
        coverImage: newWork.coverImage,
      };

      await PostWork(workData, token);

      // 모달 닫기 및 폼 초기화
      setShowAddModal(false);
      setNewWork({ title: "", author: "", description: "", coverImage: "" });

      // 작품 목록 새로고침
      await fetchWorks();
    } catch (error) {
      console.error("작품 추가 실패:", error);
      setError(
        error instanceof Error ? error.message : "작품 추가에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlaceholderText = () => {
    switch (type) {
      case "novel":
        return { author: "작가", authorPlaceholder: "작가명을 입력하세요" };
      case "poem":
        return { author: "시인", authorPlaceholder: "시인명을 입력하세요" };
      case "music":
        return { author: "작곡가", authorPlaceholder: "작곡가명을 입력하세요" };
      case "movie":
        return { author: "감독", authorPlaceholder: "감독명을 입력하세요" };
      case "game":
        return { author: "제작사", authorPlaceholder: "제작사명을 입력하세요" };
      case "performance":
        return { author: "작곡가", authorPlaceholder: "작곡가명을 입력하세요" };
      case "animation":
        return { author: "감독", authorPlaceholder: "감독명을 입력하세요" };
      case "essay":
        return { author: "글쓴이", authorPlaceholder: "글쓴이를 입력하세요" };
      case "webtoon":
        return { author: "작가", authorPlaceholder: "글쓴이를 입력하세요" };
      default:
        return { author: "작가", authorPlaceholder: "작가명을 입력하세요" };
    }
  };

  const placeholderInfo = getPlaceholderText();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 홈과 같은 머리줄(로고 홈 버튼 · 글 쓰기 · 로그인) */}
      <SiteHeader />

      {/* 헤더 */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs
            className="mb-3"
            items={[{ label: "홈", href: "/" }, { label: categoryName }]}
          />
          <div className="flex items-center gap-4 mb-4">
            {/* 홈으로 가는 진짜 링크. 예전에는 버튼이라 검색엔진이 따라가지 못했다. */}
            <Link
              href="/"
              aria-label="홈으로"
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
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {categoryName} 작품 목록
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <p className="text-sm sm:text-base text-gray-600">
              {works.length}개의 {categoryName} 작품이 있습니다. 작품을 클릭하여
              다양한 해석과 관점을 탐색해보세요.
            </p>
            {works.length > 1 && (
              <label className="flex items-center gap-2 text-sm text-gray-600 shrink-0">
                <span className="sr-only sm:not-sr-only">정렬</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as WorkSort)}
                  className="px-2 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {SORT_LABELS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        </div>
      </div>

      {/* 작품 목록 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {works.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-24 h-24 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              아직 등록된 작품이 없습니다
            </h3>
            <p className="text-gray-500 mb-6">
              첫 번째 {categoryName} 작품을 추가해보세요!
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              첫 작품 추가하기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-8">
            {sortedWorks.map((work) => {
              // 관리자 화면에서 고정해 둔 작품이면 배지 문구가 있다.
              const badge = pinBadge(work);
              return (
                // 진짜 링크로 둔다. 클릭 핸들러로만 이동하면 검색엔진이 작품으로 가는 길을 못 찾는다.
                <Link
                  key={work.id}
                  href={workPath(type, work.id)}
                  prefetch={false}
                  className={`group relative block cursor-pointer bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/30 hover:border-white/50 transform hover:-translate-y-2 ${
                    badge ? "ring-2 ring-amber-400 ring-offset-1" : ""
                  }`}
                >
                  <div className="aspect-[2/3] sm:aspect-[3/4] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={work.coverImage}
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      width={200}
                      height={300}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop`;
                      }}
                    />
                    {/* 표지 위에 올리는 이벤트 배지. 사이트의 파란 계열과 달리 따뜻한
                      색으로 둬서 목록에서 바로 눈에 띄게 한다. */}
                    {badge && (
                      <span className="absolute left-2 top-2 z-10 max-w-[calc(100%-1rem)] truncate rounded-full bg-gradient-to-r from-amber-500 to-pink-500 px-2 py-0.5 text-[11px] font-semibold text-white shadow-md sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-xs">
                        {badge}
                      </span>
                    )}
                  </div>
                  <div className="p-3 sm:p-6">
                    <h3 className="font-bold text-sm sm:text-lg text-gray-800 mb-1 sm:mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                      {work.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 font-medium">
                      {placeholderInfo.author}: {work.author}
                    </p>
                    {typeof work.write_count === "number" && (
                      <p className="text-gray-500 text-xs mb-2 sm:mb-3">
                        {work.write_count > 0
                          ? `해석 ${work.write_count}편`
                          : "아직 해석이 없습니다"}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 hidden sm:block">
                      {work.description && work.description.length > 100
                        ? work.description.substring(0, 100) + "..."
                        : work.description}
                    </p>
                    <div className="mt-2 sm:mt-4 flex items-center text-blue-600 text-xs sm:text-sm font-medium group-hover:text-blue-700">
                      <span className="hidden sm:inline">해석 보기</span>
                      <span className="sm:hidden">보기</span>
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform"
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
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <SiteFooter clearFloatingButtons />

      {/* 플로팅 추가 버튼 */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group hover:scale-110 z-40"
      >
        <svg
          className="w-5 h-5 sm:w-8 sm:h-8 group-hover:rotate-90 transition-transform duration-300"
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

      {/* 작품 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto transform transition-all duration-300">
            <div className="p-4 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  새 {categoryName} 작품 추가
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    작품 제목
                  </label>
                  <input
                    type="text"
                    value={newWork.title}
                    onChange={(e) =>
                      setNewWork((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200"
                    placeholder="작품 제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {placeholderInfo.author}
                  </label>
                  <input
                    type="text"
                    value={newWork.author}
                    onChange={(e) =>
                      setNewWork((prev) => ({
                        ...prev,
                        author: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200"
                    placeholder={placeholderInfo.authorPlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    작품 설명
                  </label>
                  <textarea
                    value={newWork.description}
                    onChange={(e) =>
                      setNewWork((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    maxLength={100}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200 resize-none"
                    placeholder="작품에 대한 간단한 설명을 입력하세요(100자 제한)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    표지 이미지 URL (선택사항)
                  </label>
                  <input
                    type="url"
                    value={newWork.coverImage}
                    onChange={(e) =>
                      setNewWork((prev) => ({
                        ...prev,
                        coverImage: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200"
                    placeholder="이미지 URL을 입력하세요"
                  />
                </div>

                <button
                  onClick={handleAddWork}
                  disabled={!newWork.title || !newWork.author || isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      작품 추가 중...
                    </div>
                  ) : (
                    "작품 추가하기"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
