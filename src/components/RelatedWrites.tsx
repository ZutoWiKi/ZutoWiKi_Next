import React from "react";
import Link from "next/link";
import { categoryName } from "@/config/categories";
import type { RelatedWrite } from "@/lib/related";
import { writePath } from "@/lib/writeLink";

/**
 * 글 아래 "함께 읽을 만한 해석". 다른 작품의 글로 가는 사이트 안 링크다.
 *
 * 예전 글 페이지는 자기 작품으로 가는 링크 말고는 나갈 곳이 없어서, 검색엔진도 사람도
 * 글 하나를 읽으면 거기서 끝났다. 고르는 규칙은 src/lib/related.ts 에 있다.
 */
export default function RelatedWrites({ writes }: { writes: RelatedWrite[] }) {
  if (writes.length === 0) return null;

  return (
    <section className="mt-6 pt-6 border-t border-gray-200">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
        함께 읽을 만한 해석
      </h2>
      <ul className="space-y-1">
        {writes.map((write) => (
          <li key={write.id}>
            <Link
              href={writePath(write.type_index, write.work_id, write.id)}
              prefetch={false}
              className="block px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <span className="block text-sm sm:text-base text-gray-800 line-clamp-1">
                {write.title}
              </span>
              <span className="block text-xs sm:text-sm text-gray-500">
                {write.work_title} · {categoryName(write.type_index)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
