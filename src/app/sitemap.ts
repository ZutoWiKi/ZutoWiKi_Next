// app/sitemap.ts
import { MetadataRoute } from "next";
import { AllWrite } from "../components/API/GetAllWrites";
import { API_URL, SITE_URL } from "@/config/site";
import { writePath } from "@/lib/writeLink";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // DRF에서 글 목록 가져오기 (주소는 API 서버, 사이트맵에 실리는 링크는 서비스 도메인)
  // 주소와 날짜만 쓰므로 본문은 받지 않는다.
  const res = await fetch(`${API_URL}/api/post/write/all/?summary=1`, {
    next: { revalidate: 86400 }, // 하루마다 갱신
  });
  const posts: AllWrite[] = await res.json();

  // 글 주소 변환
  const postUrls = posts.map((post: AllWrite) => ({
    url: `${SITE_URL}${writePath(post.type_index, post.work_id, post.id)}`,
    lastModified: new Date(post.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...postUrls,
  ];
}
