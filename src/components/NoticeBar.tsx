import React from "react";
import Link from "next/link";
import { noticePath, type NoticeSummary } from "@/lib/notice";

/**
 * 홈 맨 위에 한 줄로 붙는 공지 띠.
 *
 * 이벤트 팝업(EventBanner)과 달리 화면을 덮지 않는다. 읽던 것을 막지 않고, 닫기
 * 버튼도 없다 — 내리는 건 관리자 화면의 "홈에 띄우기"·"홈에서 내릴 시각" 이 맡는다.
 * 사람마다 닫은 기록을 들고 다니지 않으므로 첫 HTML 에 그대로 넣을 수 있고,
 * 그 덕에 검색엔진에게도 공지로 가는 진짜 링크가 하나 생긴다.
 *
 * 띄울 공지가 없으면(백엔드가 못 받은 경우 포함) 아무것도 그리지 않는다.
 *
 * 내용을 가운데로 모으는 데는 이유가 있다. 1024px 부터 왼쪽 위에 떠 있는 메뉴
 * (FloatingMenu, 기본 위치 x 20·y 90)가 띠의 왼쪽 끝을 덮는다. 메뉴는 끌어 옮길 수
 * 있고 그 자리를 기억하므로 메뉴를 내리는 식으로는 확실히 피할 수 없다.
 */
export default function NoticeBar({
  notice,
}: {
  notice: NoticeSummary | null;
}) {
  if (!notice) return null;

  return (
    <aside
      aria-label="공지"
      className="border-b border-blue-100 bg-gradient-to-r from-blue-50 via-white to-purple-50"
    >
      <Link
        href={noticePath(notice.id)}
        prefetch={false}
        className="group mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2.5 sm:gap-3 sm:px-6"
      >
        <span className="shrink-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-2.5 py-0.5 text-xs font-semibold text-white">
          공지
        </span>
        {/* 제목이 길면 한 줄로 줄인다. 전문은 눌러서 본다. */}
        <span className="min-w-0 truncate text-sm text-gray-700 group-hover:text-blue-700 sm:text-base">
          {notice.title}
        </span>
        <span className="shrink-0 whitespace-nowrap text-xs text-gray-500 group-hover:text-blue-700">
          자세히 <span aria-hidden="true">›</span>
        </span>
      </Link>
    </aside>
  );
}
