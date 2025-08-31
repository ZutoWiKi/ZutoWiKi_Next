// app/sitemap.ts
import { MetadataRoute } from "next";
import { AllWrite } from "../components/API/GetAllWrites"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://yoonseul.site";

  // DRF에서 글 목록 가져오기
  const res = await fetch(`${baseUrl}/api/post/write/all/`, {
    next: { revalidate: 86400 }, // 하루마다 갱신
  });
  const posts:AllWrite[] = await res.json();

  // 글 주소 변환
  const postUrls = posts.map((post: AllWrite) => ({
    url: `${baseUrl}/post/${post.type_index}/${post.work_id}?writeId=${post.id}`,
    lastModified: new Date(post.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...postUrls,
  ];
}
