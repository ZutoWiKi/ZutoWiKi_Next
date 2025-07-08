"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface FloatingMenuState {
  position: { x: number; y: number };
  isCollapsed: boolean;
}

export default function FloatingMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 90 });
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

  // localStorage에서 상태 로드
  useEffect(() => {
    setMounted(true);

    try {
      const savedState = localStorage.getItem("floatingMenuState");
      if (savedState) {
        const parsed: FloatingMenuState = JSON.parse(savedState);
        setPosition(parsed.position);
        setIsCollapsed(parsed.isCollapsed);
      }
    } catch (error) {
      console.warn("Failed to load floating menu state:", error);
    }
  }, []);

  // 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (!mounted) return;

    try {
      const state: FloatingMenuState = {
        position,
        isCollapsed,
      };
      localStorage.setItem("floatingMenuState", JSON.stringify(state));
    } catch (error) {
      console.warn("Failed to save floating menu state:", error);
    }
  }, [position, isCollapsed, mounted]);

  useEffect(() => {
    if (!mounted) return;

    // pathname에서 type 추출 (예: /post/novel → novel)
    const pathSegments = pathname.split("/");
    const typeFromPath = pathSegments[pathSegments.length - 1];

    // post 페이지에 있고 type이 있는 경우에만 설정
    if (pathname.startsWith("/post/") && typeFromPath !== "post") {
      setCurrentType(typeFromPath.toLowerCase());
    } else {
      setCurrentType("");
    }
  }, [pathname, mounted]);

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
    { name: "영화 / 드라마", desc: "Movie" },
    { name: "공연", desc: "Performance" },
    { name: "애니메이션", desc: "Animation" },
  ];

  const hasActiveItem = categories.some(
    (category) => currentType === category.desc.toLowerCase(),
  );

  if (!mounted) {
    return null;
  }

  const handleCategoryClick = (categoryDesc: string) => {
    const typeSlug = categoryDesc.toLowerCase();
    setCurrentType(typeSlug);

    // 동적 라우팅 사용: /post/[type]
    router.push(`/post/${typeSlug}`);
  };

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

      {!isCollapsed && (
        <div className="py-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {categories.map((category, index) => {
            const isActive = currentType === category.desc.toLowerCase();

            return (
              <button
                key={index}
                onClick={() => handleCategoryClick(category.desc)}
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
