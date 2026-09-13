import React from "react";
import { permanentRedirect } from "next/navigation";
import PostDetailPage from "@/components/PostDetailPage";
import { GetWorkDetail } from "@/components/API/GetWorkDetail";
import { categoryName } from "@/config/categories";
import { fetchWorkWrites } from "@/lib/serverApi";
import { workPath, writePath } from "@/lib/writeLink";
import { Metadata } from "next";

interface WorkDetailPageProps {
  params: Promise<{
    type: string;
    workId: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/** ?writeId=57 로 들어온 예전 주소인지 확인하고, 맞으면 그 값을 돌려준다. */
function legacyWriteId(sp: {
  [key: string]: string | string[] | undefined;
}): string | null {
  const raw = sp.writeId;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return typeof value === "string" && /^\d+$/.test(value) ? value : null;
}

export async function generateMetadata({
  params,
  searchParams,
}: WorkDetailPageProps): Promise<Metadata> {
  const { type, workId } = await params;
  // 해석글 목록은 아래 페이지와 같은 요청이라 Next 가 합쳐 준다.
  const [work, writes] = await Promise.all([
    GetWorkDetail(workId),
    fetchWorkWrites(workId),
  ]);
  const typeName = categoryName(type);

  // 예전 주소로 들어왔으면 곧 새 주소로 보낸다. 정본도 새 주소를 가리켜야
  // 검색엔진이 두 주소를 하나로 합친다.
  const writeId = legacyWriteId(await searchParams);
  const canonical = writeId
    ? writePath(type, workId, writeId)
    : workPath(type, workId);

  return {
    title: `${work.title} - ${typeName} 해석`,
    description: `${work.author}의 ${typeName} "${work.title}"에 대한 다양한 해석을 만나보세요. ${work.description}`,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${work.title} - ${typeName} 해석`,
      description: `${work.author}의 ${typeName} "${work.title}"에 대한 다양한 해석을 만나보세요.`,
      url: canonical,
      images: work.coverImage ? [work.coverImage] : undefined,
    },
    // 해석글이 하나도 없는 작품은 내용이 거의 없어서 색인하지 않는다. 글이 달리면 저절로 풀린다.
    // 글 목록을 못 받았을 때(null)는 멀쩡한 작품을 내리지 않도록 그대로 둔다.
    ...(writes?.length === 0 ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function WorkDetailPage({
  params,
  searchParams,
}: WorkDetailPageProps) {
  const { type, workId } = await params;

  // 예전에 공유된 /post/{type}/{workId}?writeId=57 주소를 새 주소로 넘긴다.
  // 영구 이동(308)이라 검색엔진이 색인을 옮기고, 이미 나간 링크도 그대로 산다.
  const writeId = legacyWriteId(await searchParams);
  if (writeId) {
    permanentRedirect(writePath(type, workId, writeId));
  }

  // 수필을 /post/essay/... 로 들어오면 정본 주소(/post/esay/...)로 넘긴다(writeLink 참고).
  const canonical = workPath(type, workId);
  if (canonical !== `/post/${type}/${workId}`) {
    permanentRedirect(canonical);
  }

  // 첫 HTML 에 작품 정보와 해석글이 들어가도록 서버에서 먼저 받는다.
  // 작품 정보는 위 generateMetadata 와 같은 요청이라 Next 가 합쳐 준다.
  // 하나라도 못 받으면 예전처럼 브라우저에서 받는다.
  const [work, writes] = await Promise.all([
    GetWorkDetail(workId).catch(() => null),
    fetchWorkWrites(workId),
  ]);

  // 다른 작품으로 옮겨 가면 이전 작품의 글이 남지 않도록 작품마다 새로 만든다.
  return (
    <PostDetailPage
      key={workId}
      workId={workId}
      initialData={work && writes ? { work, writes } : undefined}
    />
  );
}
