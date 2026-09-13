import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import { fetchWriteIndex } from "@/lib/serverApi";
import { categoryPath, workPath, writePath } from "@/lib/writeLink";

/**
 * 사이트맵.
 *
 * 담는 것: 홈, 해석글이 있는 갈래 목록과 작품, 모든 해석글.
 * 글이 하나도 없는 작품·갈래는 담지 않는다. 그 페이지들은 noindex 이고, 내용 없는
 * 페이지를 검색엔진에 알리면 사이트 전체 평가가 깎인다.
 *
 * lastModified 는 "그 페이지에 보이는 가장 최근 글의 작성일"이다. 사이트맵을 만든
 * 시각을 넣으면 매일 바뀐 것처럼 보여서, 구글이 이 사이트의 날짜를 아예 믿지 않게 된다.
 * 글을 고친 날은 반영하지 못한다 — 백엔드에 수정 시각이 없다.
 *
 * changeFrequency·priority 는 구글이 쓰지 않는 값이라 넣지 않는다.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const writes = await fetchWriteIndex();

  // 못 받았으면 실패로 끝낸다. 하루마다 다시 만들다 실패하면 Next 가 이전 사이트맵을
  // 계속 내보낸다. 여기서 홈만 담아 성공시키면 그 빈약한 사이트맵이 하루 동안 나간다.
  if (writes === null) {
    throw new Error("사이트맵을 만들 글 목록을 받지 못했습니다.");
  }

  // 주소마다 가장 최근 글의 작성일. 넣은 순서대로 나가므로 홈이 맨 앞에 온다.
  const pages = new Map<string, Date | undefined>([[SITE_URL, undefined]]);
  const touch = (url: string, date: Date) => {
    const prev = pages.get(url);
    if (!prev || prev < date) pages.set(url, date);
  };

  for (const write of writes) {
    const date = new Date(write.created_at);
    touch(SITE_URL, date);
    touch(`${SITE_URL}${categoryPath(write.type_index)}`, date);
    touch(`${SITE_URL}${workPath(write.type_index, write.work_id)}`, date);
    touch(
      `${SITE_URL}${writePath(write.type_index, write.work_id, write.id)}`,
      date,
    );
  }

  return [...pages].map(([url, lastModified]) => ({ url, lastModified }));
}
