"use client";

import React, { useEffect, useState } from "react";
import { NoticeViewLimitManager } from "@/components/ViewTracker";
import { isBotUserAgent } from "@/lib/bot";

/**
 * 공지 조회수. 화면에 숫자를 보여주면서 열어 본 것을 한 번 센다.
 *
 * 해석글과 같은 규칙이다. 같은 브라우저에서 같은 공지는 한 시간에 한 번만 세고,
 * 검색엔진 로봇과 자동화 브라우저는 세지 않는다. 숫자는 서버가 그린 값으로 먼저
 * 보이고, 올리는 데 성공하면 그 값으로 바뀐다.
 *
 * 조회수를 못 올려도 공지를 읽는 데는 지장이 없으므로 실패는 조용히 넘긴다.
 */
export default function NoticeViewCount({
  noticeId,
  initialViews,
}: {
  noticeId: number;
  initialViews: number;
}) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    if (navigator.webdriver || isBotUserAgent(navigator.userAgent)) return;
    if (!NoticeViewLimitManager.canView(noticeId)) return;

    // 응답을 기다리는 사이 다른 공지로 옮겨 갔으면 그 공지의 숫자를 덮어쓰지 않는다.
    let cancelled = false;

    (async () => {
      try {
        // 끝에 / 를 붙이면 Next 가 308 로 한 번 더 돌린다(라우트 경로에는 / 가 없다).
        const res = await fetch(`/api_/notice/${noticeId}/views`, {
          method: "PUT",
        });
        if (!res.ok) return;

        const data: unknown = await res.json();
        const next = (data as { views?: unknown }).views;
        if (typeof next !== "number") return;

        NoticeViewLimitManager.recordView(noticeId);
        if (!cancelled) setViews(next);
      } catch {
        // 네트워크가 끊겼거나 서버가 잠깐 죽은 경우.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [noticeId]);

  return <span>조회 {views}</span>;
}
