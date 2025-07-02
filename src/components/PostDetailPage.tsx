"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 목업 게시글 데이터
const mockPostsData = {
  "1": [
    {
      id: 1,
      title: "빅 브라더의 감시 체계에 대한 현대적 해석",
      author: "문학평론가김",
      content:
        "오늘날 우리가 살고 있는 디지털 시대에서 조지 오웰의 '1984'는 더욱 현실적인 경고로 다가온다. 빅 브라더의 감시 체계는 단순한 독재의 상징이 아니라, 정보 기술을 통한 통제의 메커니즘을 예견한 것이다.",
      createdAt: "2024-01-15",
      views: 1250,
      likes: 89,
      parentId: null,
      level: 0,
    },
    {
      id: 2,
      title: "언어의 파괴와 사고의 통제 - 신어(Newspeak)의 의미",
      author: "언어학도박",
      content:
        "오웰이 제시한 신어는 단순한 언어 정책이 아니다. 이는 사고 자체를 제한하는 도구로서, 언어의 다양성을 제거함으로써 비판적 사고의 가능성을 원천 차단하는 시스템이다.",
      createdAt: "2024-01-20",
      views: 890,
      likes: 67,
      parentId: 1,
      level: 1,
    },
    {
      id: 3,
      title: "현대 SNS와 신어의 유사성",
      author: "디지털네이티브",
      content:
        "박님의 언어 통제에 대한 분석에 동감하면서, 현대 SNS에서 일어나는 언어 현상과의 연결점을 찾아보고 싶습니다. 제한된 글자 수, 해시태그 문화, 밈(meme)을 통한 의사소통은 어떤 면에서 신어와 유사한 기능을 하고 있는 것은 아닐까요?",
      createdAt: "2024-01-22",
      views: 445,
      likes: 23,
      parentId: 2,
      level: 2,
    },
    {
      id: 4,
      title: "윈스턴의 저항과 좌절 - 개인과 체제의 대립",
      author: "철학과대학원생",
      content:
        "윈스턴 스미스의 여정은 개인의 자유의지와 전체주의 체제 간의 근본적인 갈등을 보여준다. 그의 저항은 단순한 반항이 아니라 인간 본성의 마지막 보루를 지키려는 시도였다.",
      createdAt: "2024-01-25",
      views: 678,
      likes: 45,
      parentId: null,
      level: 0,
    },
    {
      id: 5,
      title: "사랑의 의미와 체제의 통제",
      author: "로맨티스트",
      content:
        "윈스턴과 줄리아의 사랑이 체제에 대한 저항의 상징이라는 해석에 흥미를 느꼈습니다. 사랑이라는 가장 개인적인 감정조차 정치적 도구로 활용되는 모습에서 현대 사회의 모습을 엿볼 수 있습니다.",
      createdAt: "2024-01-28",
      views: 234,
      likes: 18,
      parentId: 4,
      level: 1,
    },
    {
      id: 6,
      title: "진리부의 역할과 정보 조작",
      author: "미디어연구자",
      content:
        "진리부(Ministry of Truth)는 단순히 과거의 기록을 바꾸는 기관이 아니다. 이는 현실 자체를 재정의하는 권력을 가진 기관으로, 현재의 팩트체킹 기관들과 언론사들의 역할과 비교해볼 때 매우 흥미로운 통찰을 제공한다.",
      createdAt: "2024-02-01",
      views: 523,
      likes: 41,
      parentId: null,
      level: 0,
    },
    {
      id: 7,
      title: "O'Brien의 양면성 - 구원자와 파괴자",
      author: "심리분석가",
      content:
        "오브라이언은 윈스턴에게 구원의 희망과 절망적 파괴를 동시에 안겨준다. 이러한 양면성은 권력의 본질과 피지배자의 심리를 깊이 있게 탐구한 오웰의 천재성을 보여준다.",
      createdAt: "2024-02-03",
      views: 445,
      likes: 32,
      parentId: null,
      level: 0,
    },
    {
      id: 8,
      title: "도덕적 상대주의와 절대적 진리",
      author: "윤리학교수",
      content:
        "오브라이언의 철학은 도덕적 상대주의의 극단을 보여준다. '2+2=5'라는 명제는 단순한 수학적 오류가 아니라, 진리의 절대성에 대한 근본적 의문을 제기한다.",
      createdAt: "2024-02-05",
      views: 312,
      likes: 28,
      parentId: 7,
      level: 1,
    },
    {
      id: 9,
      title: "텔레스크린과 현대의 스마트 기기",
      author: "기술비평가",
      content:
        "텔레스크린은 단방향 감시 도구였지만, 현대의 스마트폰과 IoT 기기들은 양방향 감시를 가능하게 한다. 우리는 자발적으로 더 정교한 감시 체계 안에 들어가고 있는 것은 아닐까?",
      createdAt: "2024-02-07",
      views: 789,
      likes: 67,
      parentId: 1,
      level: 1,
    },
    {
      id: 10,
      title: "스마트시티와 사회 통제",
      author: "도시계획연구자",
      content:
        "현대의 스마트시티 프로젝트들은 효율성과 편의성을 추구하지만, 그 이면에는 시민 감시와 통제의 가능성이 내재되어 있다. 중국의 사회신용시스템이 그 예시가 될 수 있다.",
      createdAt: "2024-02-10",
      views: 456,
      likes: 39,
      parentId: 9,
      level: 2,
    },
  ],
  "2": [
    {
      id: 1,
      title: "어른과 아이의 시선으로 본 세상",
      author: "동심지킴이",
      content:
        "생텍쥐페리가 그린 어린 왕자의 여행은 단순한 모험담이 아니다. 이는 어른이 되면서 잃어버린 순수함과 본질을 보는 눈에 대한 깊은 성찰이다.",
      createdAt: "2024-02-01",
      views: 892,
      likes: 76,
      parentId: null,
      level: 0,
    },
    {
      id: 2,
      title: "장미와 여우 - 관계의 의미",
      author: "관계심리학자",
      content:
        "어린 왕자의 장미와 여우는 각각 다른 종류의 관계를 상징한다. 장미는 특별함을 위한 책임감을, 여우는 길들임을 통한 유대감을 보여준다.",
      createdAt: "2024-02-05",
      views: 567,
      likes: 42,
      parentId: null,
      level: 0,
    },
    {
      id: 3,
      title: "바오밥나무와 현대 사회의 문제들",
      author: "환경철학자",
      content:
        "바오밥나무는 작은 행성을 파괴할 수 있는 위험한 존재로 그려진다. 이는 현대 사회의 환경 파괴, 소비주의, 무분별한 성장주의에 대한 경고로 해석될 수 있다.",
      createdAt: "2024-02-08",
      views: 445,
      likes: 38,
      parentId: null,
      level: 0,
    },
    {
      id: 4,
      title: "기후변화와 바오밥나무의 은유",
      author: "기후과학자",
      content:
        "바오밥나무를 방치하면 행성 전체가 파괴된다는 설정은 기후변화의 위험성과 정확히 일치한다. 작은 방치가 돌이킬 수 없는 결과를 가져온다는 메시지가 담겨있다.",
      createdAt: "2024-02-10",
      views: 289,
      likes: 23,
      parentId: 3,
      level: 1,
    },
  ],
};

// 작품 정보 목업 데이터
const mockWorkInfo = {
  "1": {
    title: "1984",
    author: "조지 오웰",
    type: "novel",
    coverImage:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
    description: "디스토피아 사회를 그린 고전 소설",
  },
  "2": {
    title: "어린 왕자",
    author: "생텍쥐페리",
    type: "novel",
    coverImage:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    description: "사랑과 우정에 대한 철학적 동화",
  },
};

interface PostDetailPageProps {
  workId: string;
  type: string;
}

interface Post {
  id: number;
  title: string;
  author: string;
  content: string;
  createdAt: string;
  views: number;
  likes: number;
  parentId: number | null;
  level: number;
}

interface GraphNode extends Post {
  x: number;
  y: number;
}

export default function PostDetailPage({ workId, type }: PostDetailPageProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [workInfo, setWorkInfo] = useState<any>(null);
  const [sortBy, setSortBy] = useState<"time" | "views" | "likes">("time");
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [writeModalParent, setWriteModalParent] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    author: "익명의사용자",
  });

  useEffect(() => {
    setMounted(true);
    const workPosts = mockPostsData[workId as keyof typeof mockPostsData] || [];
    const work = mockWorkInfo[workId as keyof typeof mockWorkInfo];

    setPosts(workPosts);
    setWorkInfo(work);
    if (workPosts.length > 0) {
      setSelectedPost(workPosts[0]);
    }
  }, [workId]);

  // 그래프 노드 위치 계산
  const calculateGraphPosition = (): GraphNode[] => {
    const rootPosts = posts.filter((post) => post.parentId === null);
    const allNodes: GraphNode[] = [];
    let currentX = 80;

    const processNode = (
      post: Post,
      level: number,
      parentX?: number,
      branchIndex?: number,
    ): void => {
      let x: number, y: number;

      if (level === 0) {
        x = currentX;
        y = 100;
        currentX += 220;
      } else {
        x = parentX! + 180;
        const childCount = posts.filter(
          (p) => p.parentId === post.parentId,
        ).length;
        const centerOffset = (branchIndex! - (childCount - 1) / 2) * 70;
        y = 100 + level * 50 + centerOffset;
      }

      allNodes.push({
        ...post,
        x,
        y,
      });

      const children = posts.filter((p) => p.parentId === post.id);
      children.forEach((child, index) => {
        processNode(child, level + 1, x, index);
      });
    };

    rootPosts.forEach((post) => {
      processNode(post, 0);
    });

    return allNodes;
  };

  const graphNodes = calculateGraphPosition();

  // 연결선 계산
  const connections = graphNodes.flatMap((node) =>
    graphNodes
      .filter((child) => child.parentId === node.id)
      .map((child) => ({ from: node, to: child })),
  );

  // 정렬된 게시글 목록
  const sortedPosts = [...posts].sort((a, b) => {
    switch (sortBy) {
      case "views":
        return b.views - a.views;
      case "likes":
        return b.likes - a.likes;
      case "time":
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  const handleMouseEnter = (post: GraphNode, event: React.MouseEvent) => {
    setHoveredPost(post.id);
    setHoverPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredPost(null);
  };

  const handleWritePost = () => {
    const newPostData = {
      id: posts.length + 1,
      title: newPost.title,
      author: newPost.author,
      content: newPost.content,
      createdAt: new Date().toISOString().split("T")[0],
      views: 0,
      likes: 0,
      parentId: writeModalParent,
      level: writeModalParent
        ? (posts.find((p) => p.id === writeModalParent)?.level || 0) + 1
        : 0,
    };

    console.log("새 게시글 작성:", newPostData);
    setShowWriteModal(false);
    setWriteModalParent(null);
    setNewPost({ title: "", content: "", author: "익명의사용자" });
  };

  if (!mounted || !workInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
              <img
                src={workInfo.coverImage}
                alt={workInfo.title}
                className="w-16 h-20 object-cover rounded-lg shadow-md"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {workInfo.title}
                </h1>
                <p className="text-gray-600">작가: {workInfo.author}</p>
                <p className="text-sm text-gray-500">
                  {posts.length}개의 해석이 있습니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 해석 관계도 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">해석 관계도</h2>
            <button
              onClick={() => {
                setWriteModalParent(null);
                setShowWriteModal(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 text-sm"
            >
              새 해석 작성
            </button>
          </div>

          <div
            className="relative bg-white/50 rounded-xl p-8 overflow-x-auto"
            style={{ minHeight: "280px" }}
          >
            {posts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p>아직 작성된 해석이 없습니다</p>
                <p className="text-sm">첫 번째 해석을 작성해보세요!</p>
              </div>
            ) : (
              <div
                className="relative"
                style={{
                  minWidth: `${Math.max(graphNodes.length * 220 + 160, 1200)}px`,
                  height: "240px",
                }}
              >
                {/* 연결선 */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {connections.map((conn, index) => (
                    <line
                      key={index}
                      x1={conn.from.x + 20}
                      y1={conn.from.y + 20}
                      x2={conn.to.x + 20}
                      y2={conn.to.y + 20}
                      stroke="#3B82F6"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      opacity="0.6"
                    />
                  ))}
                </svg>

                {/* 노드들 */}
                {graphNodes.map((node) => {
                  const isSelected = selectedPost?.id === node.id;
                  const isHovered = hoveredPost === node.id;

                  return (
                    <div
                      key={node.id}
                      className="absolute"
                      style={{ left: `${node.x}px`, top: `${node.y}px` }}
                    >
                      <div className="relative group">
                        {/* 메인 노드 버튼 */}
                        <button
                          onClick={() => setSelectedPost(node)}
                          onMouseEnter={(e) => handleMouseEnter(node, e)}
                          onMouseLeave={handleMouseLeave}
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all hover:scale-110 ${
                            isSelected
                              ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                              : "bg-white border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600"
                          }`}
                        >
                          {isHovered ? (
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
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          ) : (
                            node.id
                          )}
                        </button>

                        {/* 파생 글 작성 버튼 */}
                        <div
                          className={`absolute -top-12 left-1/2 transform -translate-x-1/2 transition-all duration-200 ${
                            isHovered
                              ? "opacity-100 scale-100"
                              : "opacity-0 scale-95 pointer-events-none"
                          }`}
                          onMouseEnter={() => setHoveredPost(node.id)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setWriteModalParent(node.id);
                              setShowWriteModal(true);
                              setHoveredPost(null);
                            }}
                            className="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-all shadow-lg hover:scale-110"
                            title="이 글에서 파생된 새 글 작성"
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
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* 제목 표시 */}
                        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap max-w-40 truncate text-center">
                          {node.title}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 중앙 컨텐츠 영역 */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
          {/* 정렬 옵션 */}
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

          {/* 선택된 게시글 내용 */}
          {selectedPost ? (
            <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <h3 className="font-bold text-xl text-blue-900 mb-3">
                {selectedPost.title}
              </h3>
              <div className="text-sm text-blue-700 mb-4">
                {selectedPost.author} • {selectedPost.createdAt} • 조회수{" "}
                {selectedPost.views} • 좋아요 {selectedPost.likes}
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                {selectedPost.content}
              </p>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  좋아요
                </button>
                <button
                  onClick={() => {
                    setWriteModalParent(selectedPost.id);
                    setShowWriteModal(true);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                >
                  이 글에서 파생하기
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-8 text-center text-gray-500">
              게시글을 선택해주세요
            </div>
          )}

          {/* 게시글 목록 */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {sortedPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedPost?.id === post.id
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-200 hover:border-blue-200 hover:bg-blue-25"
                }`}
              >
                <h4 className="font-semibold text-gray-800 mb-1">
                  {post.title}
                </h4>
                <div className="text-sm text-gray-600 mb-2">
                  {post.author} • {post.createdAt}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>조회수 {post.views}</span>
                  <span>좋아요 {post.likes}</span>
                  {post.parentId && (
                    <span className="text-green-600">↳ 파생글</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 호버 팝업 */}
      {hoveredPost && (
        <div
          className="fixed z-50 bg-white/95 backdrop-blur-lg rounded-lg shadow-2xl border border-white/30 p-4 max-w-sm pointer-events-none"
          style={{
            left: `${hoverPosition.x + 10}px`,
            top: `${hoverPosition.y - 80}px`,
          }}
        >
          {(() => {
            const post = posts.find((p) => p.id === hoveredPost);
            return post ? (
              <div>
                <h4 className="font-bold text-gray-800 text-sm mb-2">
                  {post.title}
                </h4>
                <div className="text-xs text-gray-600 mb-2">
                  {post.author} • {post.createdAt}
                </div>
                <p className="text-xs text-gray-700 line-clamp-3">
                  {post.content}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                  <span>조회수 {post.views}</span>
                  <span>좋아요 {post.likes}</span>
                </div>
              </div>
            ) : null;
          })()}
        </div>
      )}

      {/* 플로팅 추가 버튼 */}
      <button
        onClick={() => {
          setWriteModalParent(null);
          setShowWriteModal(true);
        }}
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

      {/* 글 작성 모달 */}
      {showWriteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowWriteModal(false)}
          />
          <div className="relative bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {writeModalParent ? "파생 해석 작성" : "새 해석 작성"}
                </h2>
                <button
                  onClick={() => setShowWriteModal(false)}
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

              {writeModalParent && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    <strong>
                      "{posts.find((p) => p.id === writeModalParent)?.title}"
                    </strong>{" "}
                    글에서 파생된 해석을 작성합니다.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    해석 제목
                  </label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) =>
                      setNewPost((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200"
                    placeholder="해석의 제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    해석 내용
                  </label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) =>
                      setNewPost((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200 resize-none"
                    placeholder="작품에 대한 해석을 자유롭게 작성해주세요..."
                  />
                </div>

                <button
                  onClick={handleWritePost}
                  disabled={!newPost.title || !newPost.content}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {writeModalParent ? "파생 해석 발행" : "해석 발행"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
