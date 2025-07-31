"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import AnimatedList from "./AnimatedList";
import { useCallback } from "react";
import { GetWorkDetail } from "@/components/API/GetWorkDetail";
import { GetWritesList } from "@/components/API/GetWriteList";
import { UpdateWriteLike } from "@/components/API/UpdateWriteLikes";
import { UpdateWriteViews } from "@/components/API/UpdateWriteViews";
import Counter from "./Counter";
import { ViewLimitManager } from "@/components/ViewTracker";
import AuthButtons from "@/components/Auth";
import { AnimatedLikeButton } from "@/components/AnimatedLikeBtn";
import { createPortal } from "react-dom";
import { marked, Tokens } from "marked";
import { GetCommentsList, Comment } from "@/components/API/GetCommentList";
import { CreateComment } from "@/components/API/CreateComment";
import { UpdateWrite, UpdateWriteData } from "@/components/API/UpdateWrite";
import { DeleteWrite } from "@/components/API/DeleteWrite";
import { GetCurrentUser, CurrentUser } from "@/components/API/GetCurrentUser";
import UserProfileColor from "@/components/UserProfileColor";
import "github-markdown-css/github-markdown.css";
import { useRef } from "react";
import { AnimatedListRef } from "./AnimatedList";
import { ChevronRightIcon, ChevronLeftIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface PostDetailPageProps {
  workId: string;
}

interface Write {
  id: number;
  title: string;
  user_name: string;
  user_id?: number; // 작성자 ID 추가
  content: string;
  work_title: string;
  work_author: string;
  created_at: string;
  views: number;
  likes: number;
  parentID: number;
  is_liked?: boolean; // 사용자의 좋아요 상태
}

interface Work {
  id: number;
  title: string;
  author: string;
  coverImage?: string;
  description: string;
}

const renderer = new marked.Renderer();

renderer.list = (token: Tokens.List) => {
  const childrenHtml = token.items
    .map((li) => {
      const content = marked.parseInline(li.text);
      return `<li>${content}</li>`;
    })
    .join("");
  return token.ordered
    ? `<ol class="list-decimal list-inside pl-5">${childrenHtml}</ol>`
    : `<ul class="list-disc list-inside pl-5">${childrenHtml}</ul>`;
};

marked.setOptions({
  renderer,
  gfm: true,
  breaks: true,
});

export default function PostDetailPage({ workId }: PostDetailPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [writes, setWrites] = useState<Write[]>([]);
  const [selectedWrite, setSelectedWrite] = useState<Write | null>(null);
  const [workInfo, setWorkInfo] = useState<Work | null>(null);
  const [sortBy, setSortBy] = useState<"time" | "views" | "likes">("time");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError] = useState<string | null>(null);
  const [showList, setShowList] = useState(true);
  const animatedListRef = useRef<AnimatedListRef>(null);
  
  // 수정/삭제 관련 상태
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // 로그인 상태 확인 및 현재 사용자 정보 가져오기
  useEffect(() => {
    if (mounted) {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
      
      // 로그인되어 있으면 현재 사용자 정보 가져오기
      if (token) {
        GetCurrentUser(token).then(setCurrentUser);
      }
    }
  }, [mounted]);

  // 로그인 상태 변경 감지
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // 로그인 요구 모달 컴포넌트
  const LoginRequiredModal = ({
    isOpen,
    onClose,
    onLogin,
    isMounted,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onLogin: () => void;
    isMounted: boolean;
  }) => {
    if (!isOpen || !isMounted) return null;

    const modalContent = (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 w-full max-w-sm mx-4 transform transition-all duration-300 scale-100">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              로그인이 필요합니다
            </h3>
            <p className="text-gray-600 mb-6">
              이 기능을 사용하려면 로그인해주세요.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={onLogin}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                로그인
              </button>
            </div>
          </div>
        </div>
      </div>
    );

    return createPortal(modalContent, document.body);
  };

  // 삭제 확인 모달 컴포넌트
  const DeleteConfirmModal = React.memo(({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    password,
    setPassword,
    isMounted,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
    password: string;
    setPassword: (password: string) => void;
    isMounted: boolean;
  }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // 모달이 열릴 때 입력 필드에 포커스
    useEffect(() => {
      if (isOpen && inputRef.current) {
        const timer = setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
        return () => clearTimeout(timer);
      }
    }, [isOpen]);

    if (!isOpen || !isMounted) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const value = e.target.value;
      setPassword(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation();
      if (e.key === 'Enter' && password.trim() && !isLoading) {
        onConfirm();
      }
    };

    const modalContent = (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div 
          className="relative bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 w-full max-w-sm mx-4 transform transition-all duration-300 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrashIcon className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              글 삭제 확인
            </h3>
            <p className="text-gray-600 mb-4 text-center">
              정말로 이 글을 삭제하시겠습니까?
            </p>
            <p className="text-sm text-gray-500 mb-2 text-center">
              삭제 확인을 위해 현재 사용자명을 입력해주세요.
            </p>
            {currentUser && (
              <p className="text-xs text-blue-600 mb-4 text-center font-mono">
                사용자명: {currentUser.username}
              </p>
            )}
            <input
              ref={inputRef}
              type="text"
              value={password}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="사용자명 입력"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
              disabled={isLoading}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              autoFocus
              name="delete-confirm"
              id="delete-confirm"
            />
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading || !password.trim()}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );

    return createPortal(modalContent, document.body);
  });

  // 데이터 로딩 함수 - 토큰과 함께 요청
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 토큰 확인
      const token = localStorage.getItem("token");

      const [workData, writesData] = await Promise.all([
        GetWorkDetail(workId),
        GetWritesList(workId, token), // 토큰을 전달하여 is_liked 정보 포함
      ]);

      setWorkInfo(workData);
      setWrites(writesData);

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

  // 데이터 로딩 후 쿼리 파라미터 확인하여 해당 글 선택
  useEffect(() => {
    if (writes.length > 0) {
      const writeId = searchParams.get('writeId');
      if (writeId) {
        const targetWrite = writes.find(write => write.id.toString() === writeId);
        if (targetWrite) {
          setSelectedWrite(targetWrite);
        }
      }
    }
  }, [writes, searchParams]);

  const goToWirte = useCallback(async () => {
    if (!isLoggedIn) {
      setShowLoginRequired(true);
      return;
    }

    router.push(`${pathname}/write`);
  }, [isLoggedIn, router, pathname]);

  const goToParentWirte = useCallback(async () => {
    if (!selectedWrite) {
      alert("파생할 작품을 선택해주세요.");
      return;
    }

    if (!isLoggedIn) {
      setShowLoginRequired(true);
      return;
    }

    router.push(`${pathname}/write?parentID=${selectedWrite.id}`);
  }, [selectedWrite, isLoggedIn, router, pathname]);

  // 좋아요 처리 - 토글 기능으로 수정
  const handleLike = useCallback(async () => {
    if (!selectedWrite) return;

    if (!isLoggedIn) {
      setShowLoginRequired(true);
      return;
    }

    if (isLikeLoading) return;

    try {
      // 클라이언트에서 토큰 가져오기
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("로그인이 필요합니다.");
      }

      setIsLikeLoading(true);
      const updatedWrite = await UpdateWriteLike(
        selectedWrite.id,
        "toggle",
        token,
      );

      // 상태 업데이트
      setWrites((prev) =>
        prev.map((write) =>
          write.id === selectedWrite.id
            ? {
                ...write,
                likes: updatedWrite.likes,
                is_liked: updatedWrite.is_liked,
              }
            : write,
        ),
      );

      setSelectedWrite((prev) =>
        prev
          ? {
              ...prev,
              likes: updatedWrite.likes,
              is_liked: updatedWrite.is_liked,
            }
          : null,
      );
    } catch (error) {
      console.error("좋아요 업데이트 실패:", error);
      // 에러 처리 - 로그인 만료 등
      if (error instanceof Error && error.message.includes("로그인")) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setShowLoginRequired(true);
      }
    } finally {
      setIsLikeLoading(false);
    }
  }, [selectedWrite, isLoggedIn, isLikeLoading]);

  // 공유 기능 - 개별 해석글 링크 복사
  const handleShare = useCallback(async () => {
    if (!selectedWrite) return;
    
    try {
      const shareSearchParams = new URLSearchParams();
      shareSearchParams.set('writeId', selectedWrite.id.toString());
      const writeUrl = `${window.location.origin}${pathname}?${shareSearchParams.toString()}`;
      await navigator.clipboard.writeText(writeUrl);
      setShowCopyMessage(true);
      setTimeout(() => setShowCopyMessage(false), 2000);
    } catch (error) {
      console.error("클립보드 복사 실패:", error);
      // 폴백: 텍스트 선택 방식
      const shareSearchParams = new URLSearchParams();
      shareSearchParams.set('writeId', selectedWrite.id.toString());
      const writeUrl = `${window.location.origin}${pathname}?${shareSearchParams.toString()}`;
      const textArea = document.createElement("textarea");
      textArea.value = writeUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setShowCopyMessage(true);
      setTimeout(() => setShowCopyMessage(false), 2000);
    }
  }, [selectedWrite, pathname]);

  // 로그인 모달 표시
  const handleShowLogin = () => {
    setShowLoginRequired(false);
    setTimeout(() => {
      const loginButton = document.querySelector(
        "[data-auth-login-button]",
      ) as HTMLButtonElement;
      if (loginButton) {
        loginButton.click();
      }
    }, 100);
  };

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

  // PostDetailPage의 handleWriteSelect 함수 수정된 버전

  const handleWriteSelect = useCallback(
    async (item: string, index: number) => {
      const selectedWrite = sortedWrites[index];
      
      // URL 쿼리 파라미터 업데이트 (히스토리에 추가하지 않음)
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set('writeId', selectedWrite.id.toString());
      const newUrl = `${pathname}?${newSearchParams.toString()}`;
      window.history.replaceState(null, '', newUrl);

      setSelectedWrite(selectedWrite);

      // 조회수 증가 로직
      console.log("선택된 글:", selectedWrite.id, selectedWrite.title);

      const canView = ViewLimitManager.canView(selectedWrite.id);
      console.log("조회 가능 여부:", canView);

      if (canView) {
        try {
          console.log("조회수 증가 시도 중...");
          const updatedWrite = await UpdateWriteViews(selectedWrite.id);
          console.log("조회수 증가 응답:", updatedWrite);

          if (updatedWrite && updatedWrite.views !== undefined) {
            // 조회수 증가 성공
            ViewLimitManager.recordView(selectedWrite.id);

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
            console.log("조회수 증가 완료. 새 조회수:", updatedWrite.views);
          } else {
            console.log("조회수 증가 실패: 서버 응답이 올바르지 않음");
          }
        } catch (error) {
          console.error("조회수 업데이트 실패:", error);
        }
      } else {
        const timeLeft = ViewLimitManager.getTimeUntilNextView(
          selectedWrite.id,
        );
        const timeLeftFormatted = ViewLimitManager.formatTimeLeft(timeLeft);
        console.log(
          `이미 조회한 글입니다. ${timeLeftFormatted} 후 다시 조회할 수 있습니다.`,
        );
      }
    },
    [sortedWrites, searchParams, pathname],
  );

  const handleParentClick = useCallback(
    async (parentId: number) => {
      if (parentId === 0) return; // 원본 글인 경우 아무것도 하지 않음

      // 현재 목록에서 해당 ID의 글을 찾기
      const parentWrite = writes.find((write) => write.id === parentId);

      if (parentWrite) {
        // 현재 목록에 있는 경우: 해당 글로 스크롤
        const parentIndex = sortedWrites.findIndex((w) => w.id === parentId);
        if (parentIndex !== -1) {
          // 먼저 선택된 글 업데이트
          setSelectedWrite(parentWrite);

          // AnimatedList의 ref를 통해 스크롤
          setTimeout(() => {
            if (animatedListRef.current) {
              animatedListRef.current.scrollToIndex(parentIndex);
            }
          }, 100);
        }
      } else {
        // 현재 목록에 없는 경우
        alert(
          `글 ID ${parentId}로 이동하려고 했지만 현재 목록에서 찾을 수 없습니다.`,
        );
      }
    },
    [writes, sortedWrites],
  );

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

  // 1) 선택된 해석이 바뀔 때마다 댓글 불러오기
  useEffect(() => {
    async function loadComments() {
      if (!selectedWrite) return;
      try {
        const data = await GetCommentsList(selectedWrite.id);
        setComments(data || []);
      } catch (e) {
        console.error(e);
      }
    }
    loadComments();
  }, [selectedWrite]);

  // 2) 댓글 등록 핸들러
  const handleCommentSubmit = async () => {
    if (!isLoggedIn) {
      setShowLoginRequired(true);
      return;
    }
    if (!selectedWrite || !newComment.trim()) return;
    setCommentLoading(true);
    const token = localStorage.getItem("token")!;
    await CreateComment(selectedWrite.id, newComment.trim(), token);
    setNewComment("");
    setCommentLoading(false);
    // 등록 후 목록 리로드
    const data = await GetCommentsList(selectedWrite.id);
    setComments(data || []);
  };

  // 수정 모드 시작 - 수정 페이지로 이동
  const handleEditStart = () => {
    if (!selectedWrite) return;
    router.push(`${pathname}/edit/${selectedWrite.id}`);
  };


  // 삭제 확인 모달 열기
  const handleDeleteStart = () => {
    setDeletePassword(""); // 먼저 초기화
    setShowDeleteModal(true);
  };

  // 삭제 취소
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeletePassword("");
  };

  // 삭제 실행
  const handleDeleteConfirm = async () => {
    if (!selectedWrite || !deletePassword.trim()) return;
    
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginRequired(true);
      return;
    }

    setIsDeleteLoading(true);
    try {
      await DeleteWrite(selectedWrite.id, deletePassword.trim(), token);
      
      // 상태에서 삭제된 글 제거
      setWrites(prev => prev.filter(write => write.id !== selectedWrite.id));
      setSelectedWrite(null);
      setShowDeleteModal(false);
      setDeletePassword("");
      
      alert('글이 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('글 삭제 실패:', error);
      alert(error instanceof Error ? error.message : '글 삭제에 실패했습니다.');
    } finally {
      setIsDeleteLoading(false);
    }
  };

  // 작성자인지 확인하는 함수
  const canEditOrDelete = (write: Write) => {
    return currentUser && write.user_id === currentUser.id;
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
      {/* 헤더 */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4 sm:gap-0">
            <div className="flex items-center gap-4">
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
              <div className="flex items-center gap-3 sm:gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {workInfo.coverImage && (
                  <img
                    src={workInfo.coverImage}
                    alt={workInfo.title}
                    className="w-12 h-16 sm:w-16 sm:h-20 object-cover rounded-lg shadow-md"
                  />
                )}
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {workInfo.title}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600">
                    작가: {workInfo.author}
                  </p>
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
            <AuthButtons />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 min-h-[calc(100vh-140px)]">
        <div
          className={`
            grid
            ${showList ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 place-items-center"}
            gap-4 sm:gap-8 items-start
            `}
        >
          {/* 왼쪽: 선택된 해석 상세 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-4 sm:p-6 min-h-[400px] sm:min-h-[500px]">
            {selectedWrite ? (
              <div className="h-full flex flex-col">
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 leading-relaxed flex-1">
                      {selectedWrite.title}
                    </h3>
                    {canEditOrDelete(selectedWrite) && (
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={handleEditStart}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="수정"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleDeleteStart}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="삭제"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
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
                        {/* 파생된 글 뭔지 */}
                        {!(selectedWrite.parentID == 0) && (
                          <button
                            onClick={() =>
                              handleParentClick(selectedWrite.parentID)
                            }
                            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer bg-transparent border-none p-0 text-sm"
                          >
                            파생한 글: {selectedWrite.parentID}번째로 이동 →
                          </button>
                        )}
                      </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div
                    className="markdown-body !bg-white !text-black list-disc list-decimal list-inside"
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(selectedWrite.content || ""),
                    }}
                  ></div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex gap-3">
                    <AnimatedLikeButton
                      isLiked={selectedWrite.is_liked || false}
                      likeCount={selectedWrite.likes}
                      onClick={handleLike}
                      disabled={isLikeLoading}
                    />
                    <button
                      onClick={handleShare}
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
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-4 sm:p-6 flex flex-col min-h-[400px] sm:min-h-[calc(100vh-200px)]">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                해석 목록
              </h2>
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

            {/* 글 목록 영역 - 고정 높이 */}
            <div className="h-[300px] sm:h-[400px] overflow-y-auto mb-4 sm:mb-6">
              {writes.length > 0 ? (
                <AnimatedList
                  ref={animatedListRef} // ref 추가
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
                      아직 해석이 없습니다
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      첫 번째 해석을 작성해보세요!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 버튼 영역 */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
              <button
                onClick={goToWirte}
                className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
              >
                새 해석 작성
              </button>
              {selectedWrite && (
                <button
                  onClick={goToParentWirte}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border border-gray-200 font-medium transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base"
                >
                  파생 해석
                </button>
              )}
            </div>

            {/* ── 댓글 섹션 ── */}
            <div className="flex-1 pt-4 sm:pt-6 border-t border-gray-200 flex flex-col max-h-[60vh] sm:max-h-[calc(80vh)]">
              <h4 className="text-base sm:text-lg font-semibold mb-3">댓글</h4>

              {/* 댓글 목록 - 남은 공간 모두 사용 */}
              <div className="flex-1 overflow-y-auto pr-2 mb-4 min-h-[200px] sm:min-h-[300px]">
                {comments.map((c) => (
                  <div key={c.id} className="mb-4 flex gap-3">
                    {/* 프로필 이미지 */}
                    <div className="flex-shrink-0">
                      {c && (
                        <UserProfileColor
                          id={c.user_id}
                          alt="avatar"
                          width={120}
                          height={60}
                          className="w-10 h-10 sm:w-16 sm:h-16 rounded-full object-cover"
                        />
                      )}
                    </div>

                    {/* 댓글 내용 */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900 text-sm sm:text-base">
                          {c.user_name}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500">
                          {new Date(c.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-800 text-sm sm:text-base">
                        {c.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 새 댓글 폼 - 하단 고정 */}
              {isLoggedIn && (
                <div className="border-t border-gray-100 pt-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="댓글을 입력하세요."
                  />
                  <button
                    onClick={handleCommentSubmit}
                    disabled={commentLoading}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {commentLoading ? "등록 중..." : "댓글 등록"}
                  </button>
                  {commentError && (
                    <p className="text-red-500 mt-2">{commentError}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 플로팅 네비게이션 */}
      <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 flex flex-col gap-2 sm:gap-3 z-40">
        <button
          onClick={() => setShowList((prev) => !prev)}
          className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
        >
          {showList ? (
            <ChevronRightIcon className="w-5 h-5 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:rotate-90" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:-rotate-90" />
          )}
        </button>
        <button
          onClick={goToWirte}
          className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
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
      </div>

      {/* 복사 완료 메시지 */}
      {showCopyMessage && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-bounce">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">복사되었습니다!</span>
          </div>
        </div>
      )}

      {/* 로그인 요구 모달 */}
      <LoginRequiredModal
        isOpen={showLoginRequired}
        onClose={() => setShowLoginRequired(false)}
        onLogin={handleShowLogin}
        isMounted={mounted}
      />

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleteLoading}
        password={deletePassword}
        setPassword={setDeletePassword}
        isMounted={mounted}
      />
    </div>
  );
}
