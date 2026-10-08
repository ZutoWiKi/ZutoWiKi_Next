"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import {
  cameFromHome,
  clearHomeEntry,
  rememberReveal,
  SPOILER_LABEL,
  wasRevealed,
} from "@/lib/spoiler";

/** 홈에서 들어왔을 때 이만큼 스크롤하면 본문을 보여 준다. */
const SCROLL_REVEAL_PX = 40;

/**
 * 글 화면이 뜨면서 Next 가 맨 위로 올리는 스크롤을 사람이 한 스크롤로 세지 않도록,
 * 화면이 자리 잡을 때까지 기다렸다가 그때 위치를 기준으로 삼는다.
 */
const SCROLL_SETTLE_MS = 400;

interface SpoilerGuardProps {
  /** 스포일러 주의 글인지. 아니면 본문을 그대로 그린다. */
  active: boolean;
  writeId: number;
  children: React.ReactNode;
}

/**
 * 스포일러 주의 글의 본문을 흐리게 가려 두는 칸.
 *
 * 눌러야 풀린다. 홈 카드를 눌러 이 글로 바로 들어왔으면 스크롤해도 풀린다
 * (src/lib/spoiler.ts). 글마다 따로 가리므로 쓰는 쪽에서 key 를 글 번호로 준다.
 *
 * 본문은 HTML 에 그대로 둔다. 검색엔진이 글을 읽고 색인할 수 있어야 하기 때문이다.
 * 대신 data-nosnippet 으로 구글이 검색 결과 미리보기에 본문을 쓰지 않게 한다.
 * 가려진 동안에는 inert 라서 본문 속 링크·영상에 손이 닿지 않고, 화면 낭독기도
 * 본문 대신 "스포일러 주의" 단추를 읽는다.
 */
export default function SpoilerGuard({
  active,
  writeId,
  children,
}: SpoilerGuardProps) {
  const [revealed, setRevealed] = useState(
    () => !active || wasRevealed(writeId),
  );
  const [fromHome] = useState(() => cameFromHome(writeId));
  const contentRef = useRef<HTMLDivElement>(null);

  // 홈에서 왔다는 표시는 한 번 쓰고 지운다. 같은 글을 나중에 다른 길로 열면 눌러야 풀린다.
  useEffect(() => {
    if (fromHome) clearHomeEntry(writeId);
  }, [fromHome, writeId]);

  const reveal = useCallback(() => {
    setRevealed(true);
    rememberReveal(writeId);
  }, [writeId]);

  // 홈에서 들어왔으면 스크롤로도 푼다.
  useEffect(() => {
    if (revealed || !fromHome) return;

    let startY: number | null = null;
    const settle = window.setTimeout(() => {
      startY = window.scrollY;
    }, SCROLL_SETTLE_MS);
    const onScroll = () => {
      if (startY === null) return;
      if (Math.abs(window.scrollY - startY) > SCROLL_REVEAL_PX) reveal();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
    };
  }, [revealed, fromHome, reveal]);

  if (!active) return <>{children}</>;

  return (
    <div className={`relative ${revealed ? "" : "min-h-60"}`} data-nosnippet="">
      <div
        ref={contentRef}
        tabIndex={-1}
        inert={!revealed}
        className={`outline-none transition-[filter] duration-500 ${
          revealed ? "" : "blur-md select-none"
        }`}
      >
        {children}
      </div>

      {!revealed && (
        <button
          type="button"
          onClick={() => {
            reveal();
            // 단추가 사라지면 초점이 문서 처음으로 튄다. 키보드로 연 사람이 본문부터 읽게 옮긴다.
            requestAnimationFrame(() =>
              contentRef.current?.focus({ preventScroll: true }),
            );
          }}
          className="absolute inset-0 z-10 flex w-full cursor-pointer items-start justify-center rounded-xl bg-white/20 px-4 pt-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <span className="flex max-w-sm flex-col items-center gap-2 rounded-2xl border border-amber-200 bg-white/95 px-5 py-4 text-center shadow-lg">
            <EyeSlashIcon
              className="h-7 w-7 text-amber-600"
              aria-hidden="true"
            />
            <span className="text-base font-semibold text-gray-800">
              {SPOILER_LABEL}
            </span>
            <span className="text-sm leading-relaxed text-gray-600">
              작품의 결말이나 주요 내용이 담겨 있을 수 있어요.
            </span>
            <span className="mt-1 rounded-full bg-amber-500 px-4 py-1.5 text-sm font-medium text-white">
              {fromHome ? "스크롤하거나 누르면 보여요" : "눌러서 내용 보기"}
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
