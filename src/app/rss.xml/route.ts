// app/rss.xml/route.ts
import { NextResponse } from "next/server";
import { AllWrite } from "../../components/API/GetAllWrites"

export async function GET() {
  const baseUrl = "https://yoonseul.site";

  // DRF API 호출 (모든 글)
  const res = await fetch(`${baseUrl}/api/post/write/all/`, {
    next: { revalidate: 86400 }, // 하루마다 새로고침
  });
  const posts:AllWrite[] = await res.json();

  // RSS 아이템 생성
  const items = posts
    .map(
      (post: AllWrite) => `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${baseUrl}/post/${post.type_index}/${post.work_id}?writeId=${post.id}</link>
        <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
        <description><![CDATA[${post.content.slice(0, 200)}...]]></description>
      </item>
    `
    )
    .join("");

  // RSS XML 전체 구조
  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>윤슬 RSS 피드</title>
        <link>${baseUrl}</link>
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