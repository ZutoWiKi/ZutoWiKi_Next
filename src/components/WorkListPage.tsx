"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 목업 데이터
const mockWorksData = {
  novel: [
    {
      id: 1,
      title: "1984",
      author: "조지 오웰",
      coverImage:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      description: "디스토피아 사회를 그린 고전 소설",
    },
    {
      id: 2,
      title: "어린 왕자",
      author: "생텍쥐페리",
      coverImage:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
      description: "사랑과 우정에 대한 철학적 동화",
    },
    {
      id: 3,
      title: "해리포터와 마법사의 돌",
      author: "J.K. 롤링",
      coverImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
      description: "마법 세계의 모험 이야기",
    },
    {
      id: 4,
      title: "카라마조프 가의 형제들",
      author: "도스토예프스키",
      coverImage:
        "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&h=400&fit=crop",
      description: "인간 본성에 대한 깊이 있는 탐구",
    },
  ],
  poem: [
    {
      id: 1,
      title: "진달래꽃",
      author: "김소월",
      coverImage:
        "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&h=400&fit=crop",
      description: "이별의 정한을 노래한 서정시",
    },
    {
      id: 2,
      title: "님의 침묵",
      author: "한용운",
      coverImage:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop",
      description: "사랑과 그리움의 철학적 성찰",
    },
    {
      id: 3,
      title: "청록집",
      author: "박두진, 조지훈, 박목월",
      coverImage:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=400&fit=crop",
      description: "자연과 향토를 노래한 서정시집",
    },
  ],
  music: [
    {
      id: 1,
      title: "베토벤 교향곡 9번",
      author: "루트비히 판 베토벤",
      coverImage:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=400&fit=crop",
      description: "합창이 포함된 웅장한 교향곡",
    },
    {
      id: 2,
      title: "Four Seasons",
      author: "안토니오 비발디",
      coverImage:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=400&fit=crop",
      description: "계절의 변화를 표현한 바이올린 협주곡",
    },
  ],
  movie: [
    {
      id: 1,
      title: "기생충",
      author: "봉준호",
      coverImage:
        "https://images.unsplash.com/photo-1489599510846-1aac057aceec?w=300&h=400&fit=crop",
      description: "계급 갈등을 다룬 블랙 코미디",
    },
    {
      id: 2,
      title: "인터스텔라",
      author: "크리스토퍼 놀란",
      coverImage:
        "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=400&fit=crop",
      description: "우주를 배경으로 한 SF 대작",
    },
  ],
  game: [
    {
      id: 1,
      title: "젤다의 전설: 브레스 오브 더 와일드",
      author: "닌텐도",
      coverImage:
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300&h=400&fit=crop",
      description: "오픈 월드 어드벤처 게임",
    },
  ],
  performance: [
    {
      id: 1,
      title: "오페라의 유령",
      author: "앤드류 로이드 웨버",
      coverImage:
        "https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=300&h=400&fit=crop",
      description: "사랑과 집착을 그린 뮤지컬",
    },
  ],
  animation: [
    {
      id: 1,
      title: "센과 치히로의 행방불명",
      author: "미야자키 하야오",
      coverImage:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop",
      description: "환상적인 세계를 그린 애니메이션",
    },
  ],
};

// 카테고리명 매핑
const categoryNames = {
  novel: "소설",
  poem: "시",
  music: "음악",
  movie: "영화",
  game: "게임",
  performance: "공연",
  animation: "애니메이션",
};

interface WorkListPageProps {
  type: string;
}

export default function WorkListPage({ type }: WorkListPageProps) {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [newWork, setNewWork] = useState({
    title: "",
    author: "",
    description: "",
    coverImage: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  const works = mockWorksData[type as keyof typeof mockWorksData] || [];
  const categoryName =
    categoryNames[type as keyof typeof categoryNames] || type;

  const handleWorkClick = (workId: number) => {
    router.push(`/post/${type}/${workId}`);
  };

  const handleAddWork = () => {
    console.log("새 작품 추가:", newWork);
    setShowAddModal(false);
    setNewWork({ title: "", author: "", description: "", coverImage: "" });
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
      default:
        return { author: "작가", authorPlaceholder: "작가명을 입력하세요" };
    }
  };

  const placeholderInfo = getPlaceholderText();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 헤더 */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 px-6 py-8">
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {categoryName} 작품 목록
            </h1>
          </div>
          <p className="text-gray-600">
            {works.length}개의 {categoryName} 작품이 있습니다. 작품을 클릭하여
            다양한 해석과 관점을 탐색해보세요.
          </p>
        </div>
      </div>

      {/* 작품 목록 */}
      <main className="max-w-7xl mx-auto px-6 py-12">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {works.map((work) => (
              <div
                key={work.id}
                onClick={() => handleWorkClick(work.id)}
                className="group cursor-pointer bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/30 hover:border-white/50 transform hover:-translate-y-2"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={work.coverImage}
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop`;
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {work.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 font-medium">
                    {placeholderInfo.author}: {work.author}
                  </p>
                  <p className="text-gray-500 text-sm line-clamp-3">
                    {work.description}
                  </p>
                  <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                    <span>해석 보기</span>
                    <svg
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
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
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 플로팅 추가 버튼 */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group hover:scale-110 z-40"
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

      {/* 작품 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 w-full max-w-md mx-4 transform transition-all duration-300">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200 resize-none"
                    placeholder="작품에 대한 간단한 설명을 입력하세요"
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
                  disabled={!newWork.title || !newWork.author}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  작품 추가하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
