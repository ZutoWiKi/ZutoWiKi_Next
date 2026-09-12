// app/rss.xml/route.ts
import { NextResponse } from "next/server";
import { AllWrite } from "../../components/API/GetAllWrites";
import { API_URL, SITE_URL } from "@/config/site";

export async function GET() {
  // DRF API 호출 (모든 글) — 호출은 API 서버로, 피드에 실리는 링크는 서비스 도메인으로
  // summary=1 이면 본문 대신 앞 200자(excerpt)만 온다. 설명문에는 그걸로 충분하다.
  const res = await fetch(`${API_URL}/api/post/write/all/?summary=1`, {
    next: { revalidate: 86400 }, // 하루마다 새로고침
  });
  const posts: AllWrite[] = await res.json();

  // RSS 아이템 생성
  const items = posts
    .map(
      (post: AllWrite) => `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${SITE_URL}/post/${post.type_index}/${post.work_id}?writeId=${post.id}</link>
        <guid isPermaLink="true">${SITE_URL}/post/${post.type_index}/${post.work_id}?writeId=${post.id}</guid>
        <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
        <description><![CDATA[${(post.excerpt ?? post.content ?? "").slice(0, 200)}...]]></description>
      </item>
    `,
    )
    .join("");

  // RSS XML 전체 구조
  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>윤슬 RSS 피드</title>
        <link>${SITE_URL}</link>
        <description>윤슬 새 글 알림</description>
        <language>ko</language>
        ${items}
      </channel>
    </rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
