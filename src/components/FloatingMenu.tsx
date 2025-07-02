"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";

export default function FloatingMenu() {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 100 });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(0);
  const animationRef = useRef<number | undefined>(undefined);

  // 화면 경계 체크 함수
  const constrainToScreen = useCallback((pos: { x: number; y: number }) => {
    if (!menuRef.current) return pos;

    const rect = menuRef.current.getBoundingClientRect();
    const menuWidth = rect.width;
    const menuHeight = rect.height;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let newX = pos.x;
    let newY = pos.y;

    // 좌우 경계 체크
    if (newX < 0) {
      newX = 0;
      velocityRef.current.x = Math.abs(velocityRef.current.x) * 0.6; // 반발력
    } else if (newX + menuWidth > screenWidth) {
      newX = screenWidth - menuWidth;
      velocityRef.current.x = -Math.abs(velocityRef.current.x) * 0.6; // 반발력
    }

    // 상하 경계 체크
    if (newY < 0) {
      newY = 0;
      velocityRef.current.y = Math.abs(velocityRef.current.y) * 0.6; // 반발력
    } else if (newY + menuHeight > screenHeight) {
      newY = screenHeight - menuHeight;
      velocityRef.current.y = -Math.abs(velocityRef.current.y) * 0.6; // 반발력
    }

    return { x: newX, y: newY };
  }, []);

  // 관성 애니메이션 함수
  const animateThrow = useCallback(() => {
    const friction = 0.9; // 마찰 계수 (0.9 ~ 0.98)
    const minVelocity = 0.5; // 최소 속도 임계값

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

      // 속도 계산 (이동거리 / 시간)
      if (lastTimeRef.current > 0) {
        const deltaTime = currentTime - lastTimeRef.current;
        if (deltaTime > 0) {
          velocityRef.current.x =
            ((currentX - lastPositionRef.current.x) / deltaTime) * 16; // 60fps 기준으로 조정
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

    // 던지기 효과: 속도가 충분히 크면 관성 애니메이션 시작
    const speed = Math.sqrt(
      velocityRef.current.x ** 2 + velocityRef.current.y ** 2,
    );

    if (speed > 2) {
      // 임계값보다 빠르게 움직였을 때만 던지기 효과
      animateThrow();
    }

    // 속도 기록 초기화
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

        // 현재 관성 애니메이션이 실행 중이면 중단
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          setIsAnimating(false);
        }

        const rect = menuRef.current.getBoundingClientRect();
        dragOffsetRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };

        // 속도 추적 초기화
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

  // 컴포넌트 언마운트 시 애니메이션 정리
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

  return (
    <>
      {/* 둥둥 떠다니는 카테고리 메뉴 윈도우 */}
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
          minWidth: "280px",
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
            {categories.map((category, index) => (
              <button
                key={index}
                className="w-full px-5 py-3 text-left text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 transition-all duration-200 border-b border-gray-100/50 last:border-b-0 font-medium group flex items-center justify-between"
              >
                <span className="text-sm">{category.name}</span>
                <span className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors">
                  {category.desc}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* 윈도우 하단 */}
        <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-xl border-t border-gray-200/50">
          <div className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
            <span>Drag to Move • Throw to Slide</span>
          </div>
        </div>
      </div>
    </>
  );
}
