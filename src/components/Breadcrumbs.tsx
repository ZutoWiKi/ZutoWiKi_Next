import React from "react";
import Link from "next/link";

export interface Crumb {
  label: string;
  /** 없으면 지금 페이지라 링크를 걸지 않는다. */
  href?: string;
}

/**
 * 페이지 머리에 작게 보이는 경로(홈 › 음악 › 작품).
 *
 * 작품·글 페이지마다 홈과 갈래 목록으로 가는 진짜 링크를 하나씩 더 만든다. 구조화 데이터의
 * BreadcrumbList(src/lib/jsonLd.ts)와 같은 길을 사람 눈에도 보여주는 것이다.
 */
export default function Breadcrumbs({
  items,
  className = "",
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav aria-label="현재 위치" className={className}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs sm:text-sm text-gray-500">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-x-1.5">
            {index > 0 && (
              <span aria-hidden="true" className="text-gray-400">
                ›
              </span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                prefetch={false}
                className="hover:text-blue-700 hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-gray-700">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
