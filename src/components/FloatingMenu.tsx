"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";

export default function FloatingMenu() {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 130 });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentType, setCurrentType] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(0);
  const animationRef = useRef<number | undefined>(undefined);

  // 컴포넌트가 마운트되었는지 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // URL에서 현재 타입 파라미터 가져오기 및 URL 변경 감지
  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    const updateCurrentType = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const type = urlParams.get("type") || "";
      setCurrentType(type.toLowerCase());
    };

    // 초기 설정
    updateCurrentType();

    // popstate 이벤트 (뒤로가기/앞으로가기)
    const handlePopState = () => {
      updateCurrentType();
    };

    // pushState/replaceState 감지를 위한 커스텀 이벤트
    const handleUrlChanged = () => {
      updateCurrentType();
    };

    // Next.js의 router 변경 감지
    const handleRouteChange = () => {
      updateCurrentType();
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("urlChanged", handleUrlChanged);

    // Next.js router events (만약 사용 중이라면)
    if (typeof window !== "undefined" && (window as any).next) {
      (window as any).next.router?.events?.on(
        "routeChangeComplete",
        handleRouteChange,
      );
    }

    // pushState와 replaceState를 감지하기 위한 오버라이드
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      setTimeout(updateCurrentType, 0);
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      setTimeout(updateCurrentType, 0);
    };

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("urlChanged", handleUrlChanged);

      if (typeof window !== "undefined" && (window as any).next) {
        (window as any).next.router?.events?.off(
          "routeChangeComplete",
          handleRouteChange,
        );
      }

      // 원래 함수 복원
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [mounted]);

  // 화면 경계 체크 함수
  const constrainToScreen = useCallback((pos: { x: number; y: number }) => {
    if (!menuRef.current || typeof window === "undefined") return pos;

    const rect = menuRef.current.getBoundingClientRect();
    const menuWidth = rect.width;
    const menuHeight = rect.height;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let newX = pos.x;
    let newY = pos.y;

    if (newX < 0) {
      newX = 0;
      velocityRef.current.x = Math.abs(velocityRef.current.x) * 0.6;
    } else if (newX + menuWidth > screenWidth) {
      newX = screenWidth - menuWidth;
      velocityRef.current.x = -Math.abs(velocityRef.current.x) * 0.6;
    }

    if (newY < 0) {
      newY = 0;
      velocityRef.current.y = Math.abs(velocityRef.current.y) * 0.6;
    } else if (newY + menuHeight > screenHeight) {
      newY = screenHeight - menuHeight;
      velocityRef.current.y = -Math.abs(velocityRef.current.y) * 0.6;
    }

    return { x: newX, y: newY };
  }, []);

  // 관성 애니메이션 함수
  const animateThrow = useCallback(() => {
    const friction = 0.9;
    const minVelocity = 0.5;

    const animate = () => {
      velocityRef.current.x *= friction;
      velocityRef.current.y *= friction;

      const speed = Math.sqrt(
        velocityRef.current.x ** 2 + velocityRef.current.y ** 2,
      );

      if (speed < minVelocity) {
        setIsAnimating(false);
        return;
      }

      setPosition((prev) => {
        const newPos = {
          x: prev.x + velocityRef.current.x,
          y: prev.y + velocityRef.current.y,
        };
        return constrainToScreen(newPos);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    setIsAnimating(true);
    animate();
  }, [constrainToScreen]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const currentTime = Date.now();
      const currentX = e.clientX - dragOffsetRef.current.x;
      const currentY = e.clientY - dragOffsetRef.current.y;

      if (lastTimeRef.current > 0) {
        const deltaTime = currentTime - lastTimeRef.current;
        if (deltaTime > 0) {
          velocityRef.current.x =
            ((currentX - lastPositionRef.current.x) / deltaTime) * 16;
          velocityRef.current.y =
            ((currentY - lastPositionRef.current.y) / deltaTime) * 16;
        }
      }

      lastPositionRef.current = { x: currentX, y: currentY };
      lastTimeRef.current = currentTime;

      requestAnimationFrame(() => {
        const constrainedPos = constrainToScreen({ x: currentX, y: currentY });
        setPosition(constrainedPos);
      });
    },
    [constrainToScreen],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    const speed = Math.sqrt(
      velocityRef.current.x ** 2 + velocityRef.current.y ** 2,
    );

    if (speed > 2) {
      animateThrow();
    }

    lastTimeRef.current = 0;
  }, [handleMouseMove, animateThrow]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (
        e.target instanceof Element &&
        e.target.closest(".drag-handle") &&
        menuRef.current
      ) {
        e.preventDefault();

        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          setIsAnimating(false);
        }

        const rect = menuRef.current.getBoundingClientRect();
        dragOffsetRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };

        velocityRef.current = { x: 0, y: 0 };
        lastPositionRef.current = {
          x: e.clientX - dragOffsetRef.current.x,
          y: e.clientY - dragOffsetRef.current.y,
        };
        lastTimeRef.current = Date.now();

        setIsDragging(true);

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }
    },
    [handleMouseMove, handleMouseUp],
  );

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const categories = [
    { name: "소설", desc: "Novel" },
    { name: "시", desc: "Poem" },
    { name: "음악", desc: "Music" },
    { name: "게임", desc: "Game" },
    { name: "영화", desc: "Movie" },
    { name: "공연", desc: "Performance" },
    { name: "애니메이션", desc: "Animation" },
  ];

  const hasActiveItem = categories.some(
    (category) => currentType === category.desc.toLowerCase(),
  );

  // hydration 문제 해결: 마운트되기 전까지는 null 반환
  if (!mounted) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className={`fixed bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/30 select-none z-50 ${
        isDragging || isAnimating
          ? "transition-none"
          : "transition-all duration-300"
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        minWidth: hasActiveItem ? "300px" : "280px",
        maxHeight: "80vh",
        cursor: isDragging ? "grabbing" : "default",
        transform: isDragging
          ? "scale(1.02)"
          : isAnimating
            ? "scale(1.01)"
            : "scale(1)",
      }}
      onMouseDown={handleMouseDown}
    >
      {/* 윈도우 타이틀바 */}
      <div className="drag-handle bg-gradient-to-r from-gray-100 to-gray-200 rounded-t-xl px-4 py-3 border-b border-gray-200/50 cursor-grab active:cursor-grabbing flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-gray-700">Menu</span>
          {isAnimating && (
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded p-1 transition-all duration-200"
        >
          {isCollapsed ? "▼" : "▲"}
        </button>
      </div>

      {/* 카테고리 메뉴 목록 */}
      {!isCollapsed && (
        <div className="py-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {categories.map((category, index) => {
            const isActive = currentType === category.desc.toLowerCase();

            return (
              <button
                key={index}
                onClick={() => {
                  if (typeof window === "undefined") return;

                  const searchParams = new URLSearchParams({
                    type: category.desc.toLowerCase(),
                  });
                  const newUrl = `/post?${searchParams.toString()}`;

                  window.history.pushState({}, "", newUrl);
                  setCurrentType(category.desc.toLowerCase());

                  window.dispatchEvent(
                    new CustomEvent("urlChanged", {
                      detail: { type: category.desc.toLowerCase() },
                    }),
                  );
                }}
                className={`w-full text-left transition-all duration-300 border-b border-gray-100/50 last:border-b-0 font-medium group flex items-center justify-between relative overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm px-7 py-3"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 hover:px-6 px-5 py-3"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"></div>
                )}

                <span
                  className={`text-sm transition-all duration-300 ${
                    isActive ? "font-semibold" : ""
                  }`}
                >
                  {category.name}
                </span>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`text-xs transition-all duration-300 ${
                      isActive
                        ? "text-blue-600 font-medium"
                        : "text-gray-400 group-hover:text-blue-500"
                    }`}
                  >
                    {category.desc}
                  </span>
                  {isActive && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse flex-shrink-0"></div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* 윈도우 하단 */}
      <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-xl border-t border-gray-200/50">
        <div className="text-xs text-gray-500 text-center flex flex-col items-center justify-center gap-1">
          <span>Drag to Move and Slide</span>
          {currentType && (
            <span className="text-blue-600 font-medium capitalize">
              {currentType} Selected
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
