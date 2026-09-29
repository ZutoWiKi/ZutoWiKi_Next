"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BANNER_STORAGE_KEY,
  FOREVER,
  bannerKey,
  isInternalLink,
  isSafeBannerLink,
  nextMidnight,
  parseDismissed,
  pickBanner,
  pruneDismissed,
  type DismissMap,
  type EventBannerData,
} from "@/lib/banner";

/** 닫은 기록을 그 브라우저에 남긴다. 저장소를 막아 뒀으면 이번 방문만 닫힌다. */
function remember(banner: EventBannerData, until: number) {
  try {
    const kept = pruneDismissed(
      parseDismissed(window.localStorage.getItem(BANNER_STORAGE_KEY)),
      Date.now(),
    );
    kept[bannerKey(banner)] = until;
    window.localStorage.setItem(BANNER_STORAGE_KEY, JSON.stringify(kept));
  } catch {
    // 사파리 비공개 모드 등. 기록만 못 남길 뿐 화면은 그대로 동작한다.
  }
}

/** 배너를 누르면 가는 링크. 윤슬 안이면 next/link, 밖이면 보통 링크. */
function BannerLink({
  href,
  newTab,
  className,
  onNavigate,
  children,
}: {
  href: string;
  newTab?: boolean;
  className: string;
  onNavigate: () => void;
  children: React.ReactNode;
}) {
  const target = newTab ? "_blank" : undefined;
  const external = !isInternalLink(href);
  const rel = external ? "noopener noreferrer" : undefined;

  if (external) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={className}
        onClick={onNavigate}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} target={target} className={className} onClick={onNavigate}>
      {children}
    </Link>
  );
}

/**
 * 홈 이벤트 팝업.
 *
 * 관리자 화면(이벤트 배너)에 등록한 것 중 지금 기간인 배너를 서버에서 받아 넘겨준다.
 * 여기서는 이 브라우저에서 닫았는지만 보고 하나를 띄운다.
 * - 오늘은 안 보기: 자정까지
 * - 다시 안 보기: 계속 (관리자가 "다시 보이기" 를 누르면 회차가 바뀌어 다시 뜬다)
 * - ✕·바깥·ESC: 이번만 닫기
 *
 * 첫 HTML 에는 넣지 않는다. 검색엔진이 읽는 내용에 팝업이 섞이지 않고,
 * 저장소를 읽기 전에 잠깐 떴다 사라지는 일도 없다.
 */
export default function EventBanner({
  banners,
}: {
  banners: EventBannerData[];
}) {
  const [banner, setBanner] = useState<EventBannerData | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!banners.length) return;

    let dismissed: DismissMap = {};
    try {
      dismissed = parseDismissed(
        window.localStorage.getItem(BANNER_STORAGE_KEY),
      );
    } catch {
      // 저장소를 못 읽으면 닫은 기록이 없는 것으로 보고 띄운다.
    }
    setBanner(pickBanner(banners, dismissed, Date.now()));
  }, [banners]);

  /** until 을 주면 그 시각까지(또는 FOREVER 면 계속) 다시 띄우지 않는다. */
  const close = useCallback((until?: number) => {
    setBanner((current) => {
      if (current && until !== undefined) remember(current, until);
      return null;
    });
  }, []);

  useEffect(() => {
    if (!banner) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);

    // 팝업이 떠 있는 동안 뒤 화면이 따라 움직이지 않게 한다.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [banner, close]);

  if (!banner) return null;

  const link = isSafeBannerLink(banner.link_url) ? banner.link_url : "";
  const content = (
    <div className="p-5 sm:p-6">
      {banner.image_url ? (
        // R2 공개 주소라 next/image 설정 없이 그대로 쓴다(사이트의 다른 이미지와 같다).
        <img
          src={banner.image_url}
          alt={banner.image_alt ?? ""}
          className="w-full rounded-xl"
        />
      ) : null}
      <h2
        id="event-banner-title"
        className={`text-lg sm:text-xl font-bold text-gray-900 ${
          banner.image_url ? "mt-4" : ""
        }`}
      >
        {banner.title}
      </h2>
      {banner.body ? (
        <p className="mt-2 whitespace-pre-line text-sm sm:text-base text-gray-600">
          {banner.body}
        </p>
      ) : null}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => close()}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-banner-title"
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={() => close()}
          aria-label="닫기"
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-2 py-1 text-gray-500 shadow-sm hover:text-gray-900"
        >
          ✕
        </button>

        {link ? (
          <BannerLink
            href={link}
            newTab={banner.link_new_tab}
            className="block hover:opacity-95 transition-opacity"
            onNavigate={() => close()}
          >
            {content}
          </BannerLink>
        ) : (
          content
        )}

        {link && banner.link_label ? (
          <div className="px-5 pb-5 sm:px-6">
            <BannerLink
              href={link}
              newTab={banner.link_new_tab}
              className="block w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-center font-semibold text-white hover:opacity-90 transition-opacity"
              onNavigate={() => close()}
            >
              {banner.link_label}
            </BannerLink>
          </div>
        ) : null}

        <div className="flex border-t border-gray-100 text-sm">
          <button
            type="button"
            onClick={() => close(nextMidnight(new Date()))}
            className="flex-1 py-3 text-gray-500 hover:bg-gray-50"
          >
            오늘은 안 보기
          </button>
          <button
            type="button"
            onClick={() => close(FOREVER)}
            className="flex-1 border-l border-gray-100 py-3 text-gray-500 hover:bg-gray-50"
          >
            다시 안 보기
          </button>
        </div>
      </div>
    </div>
  );
}
