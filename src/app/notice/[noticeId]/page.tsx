import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageLayout from "@/components/PageLayout";
import { formatDate } from "@/lib/formatDate";
import { renderMarkdown } from "@/lib/markdown";
import { NOTICE_LIST_PATH, noticePath } from "@/lib/notice";
import { markdownToPlainText, truncateText } from "@/lib/plainText";
import { fetchNotice } from "@/lib/serverApi";
// markdown-body 의 인용구·표·코드 모양. 해석글 페이지와 같은 스타일시트를 쓴다
// (이 css 는 쓰는 쪽에서 직접 import 해야 한다 — 전역으로 올려 두지 않았다).
import "github-markdown-css/github-markdown.css";

/**
 * 공지 한 건을 길게 읽는 곳.
 *
 * 홈 띠에서 내려간 뒤에도 이 주소는 그대로 남는다. 본문은 해석글과 같은 마크다운을
 * 같은 renderMarkdown 으로 그린다(원시 HTML 은 글자로, 유튜브 임베드만 다시 조립).
 */
interface PageProps {
  params: Promise<{ noticeId: string }>;
}

function describe(body: string | undefined): string {
  const plain = markdownToPlainText(body);
  return plain ? truncateText(plain, 155) : "윤슬의 공지입니다.";
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { noticeId } = await params;
  const canonical = noticePath(noticeId);

  if (!/^\d+$/.test(noticeId)) {
    return { title: "공지", alternates: { canonical } };
  }

  const lookup = await fetchNotice(noticeId);
  if (lookup.status !== "found") {
    return { title: "공지", alternates: { canonical } };
  }

  const { notice } = lookup;
  const description = describe(notice.body);

  return {
    title: notice.title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: notice.title,
      description,
      url: canonical,
      publishedTime: notice.created_at,
      modifiedTime: notice.updated_at,
    },
  };
}

export default async function NoticeDetailPage({ params }: PageProps) {
  const { noticeId } = await params;

  // 숫자가 아닌 조각은 공지 주소가 아니다.
  if (!/^\d+$/.test(noticeId)) notFound();

  // generateMetadata 와 같은 요청이라 Next 가 합쳐 준다.
  const lookup = await fetchNotice(noticeId);

  // 없는 공지만 404 다. 백엔드가 잠깐 죽었을 때 멀쩡한 공지를 404 로 만들면
  // 검색엔진이 색인에서 내려버린다.
  if (lookup.status === "missing") notFound();

  const notice = lookup.status === "found" ? lookup.notice : null;

  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        <Breadcrumbs
          items={[
            { label: "홈", href: "/" },
            { label: "공지", href: NOTICE_LIST_PATH },
            { label: notice ? notice.title : "공지" },
          ]}
          className="mb-3"
        />

        {notice ? (
          <article className="rounded-2xl bg-white/90 px-5 py-6 shadow-sm ring-1 ring-black/5 sm:px-8 sm:py-8">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {notice.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 text-xs text-gray-400">
              <time dateTime={notice.created_at}>
                {formatDate(notice.created_at)}
              </time>
              {/* 고친 날이 올린 날과 다를 때만 알려 준다. */}
              {notice.updated_at &&
                formatDate(notice.updated_at) !==
                  formatDate(notice.created_at) && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{formatDate(notice.updated_at)} 고침</span>
                  </>
                )}
            </div>
            <div
              // mt 에 ! 를 붙인다. github-markdown-css 가 .markdown-body 의 margin 을
              // 0 으로 덮어써서 날짜줄과 본문이 딱 붙는다.
              className="markdown-body !mt-6 !bg-transparent !text-black list-disc list-decimal list-inside"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(notice.body) }}
            />
          </article>
        ) : (
          <p className="rounded-2xl bg-white/70 px-5 py-10 text-center text-sm text-gray-500">
            공지를 불러오지 못했습니다. 잠시 후 다시 열어 주세요.
          </p>
        )}

        <div className="mt-6">
          <Link
            href={NOTICE_LIST_PATH}
            prefetch={false}
            className="text-sm text-gray-500 hover:text-blue-700 hover:underline"
          >
            <span aria-hidden="true">‹</span> 공지 목록
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
