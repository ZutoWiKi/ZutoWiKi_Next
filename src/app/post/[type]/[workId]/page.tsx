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
  const work = await GetWorkDetail(workId);
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
