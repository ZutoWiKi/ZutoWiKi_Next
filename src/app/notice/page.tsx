import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageLayout from "@/components/PageLayout";
import { formatDate } from "@/lib/formatDate";
import { NOTICE_LIST_PATH, noticePath } from "@/lib/notice";
import { markdownToPlainText, truncateText } from "@/lib/plainText";
import { fetchNotices } from "@/lib/serverApi";

export const metadata: Metadata = {
  title: "공지",
  description: "윤슬의 공지와 안내를 모아 둔 곳입니다.",
  alternates: { canonical: NOTICE_LIST_PATH },
  openGraph: {
    type: "website",
    title: "공지",
    description: "윤슬의 공지와 안내를 모아 둔 곳입니다.",
    url: NOTICE_LIST_PATH,
  },
};

/** 목록에 보여 줄 한 줄 요약. 백엔드가 준 앞부분(마크다운)을 평문으로 다듬는다. */
function summarize(excerpt: string | undefined): string {
  // cutOff: 가운데서 잘린 조각이라 끝에 걸린 반쪽짜리 링크·태그를 먼저 걷어낸다.
  const plain = markdownToPlainText(excerpt, { cutOff: true });
  return plain ? truncateText(plain, 120) : "";
}

export default async function NoticeListPage() {
  const notices = await fetchNotices();

  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        <Breadcrumbs
          items={[{ label: "홈", href: "/" }, { label: "공지" }]}
          className="mb-3"
        />
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">공지</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          윤슬에서 알려 드릴 일들을 여기에 모아 둡니다.
        </p>

        {notices === null ? (
          // 백엔드가 응답하지 않은 경우. 공지가 없는 것과 다르므로 다르게 말한다.
          <p className="mt-10 rounded-2xl bg-white/70 px-5 py-8 text-center text-sm text-gray-500">
            공지를 불러오지 못했습니다. 잠시 후 다시 열어 주세요.
          </p>
        ) : notices.length === 0 ? (
          <p className="mt-10 rounded-2xl bg-white/70 px-5 py-8 text-center text-sm text-gray-500">
            아직 올라온 공지가 없습니다.
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {notices.map((notice) => {
              const summary = summarize(notice.excerpt);
              return (
                <li key={notice.id}>
                  <Link
                    href={noticePath(notice.id)}
                    prefetch={false}
                    className="group block rounded-2xl bg-white/80 px-5 py-4 shadow-sm ring-1 ring-black/5 transition hover:bg-white hover:shadow-md"
                  >
                    <div className="flex items-start gap-2">
                      <h2 className="flex-1 font-semibold text-gray-900 group-hover:text-blue-700">
                        {notice.title}
                      </h2>
                      {notice.on_home && (
                        <span className="mt-0.5 shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                          띄우는 중
                        </span>
                      )}
                    </div>
                    {summary && (
                      <p className="mt-1.5 line-clamp-2 text-sm text-gray-600">
                        {summary}
                      </p>
                    )}
                    <time
                      dateTime={notice.created_at}
                      className="mt-2 block text-xs text-gray-400"
                    >
                      {formatDate(notice.created_at)}
                    </time>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </PageLayout>
  );
}
