import React from "react";
import PostDetailPage from "@/components/PostDetailPage";
import { GetWorkDetail } from "@/components/API/GetWorkDetail";
import { Metadata } from "next";

interface WorkDetailPageProps {
  params: Promise<{
    type: string;
    workId: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const typeNames: Record<string, string> = {
  song: "곡",
  album: "앨범",
  mv: "뮤직비디오",
};

export async function generateMetadata({
  params,
  searchParams,
}: WorkDetailPageProps): Promise<Metadata> {
  const { type, workId } = await params;
  const sp = await searchParams;
  const writeId = typeof sp.writeId === "string" ? sp.writeId : undefined;

  const work = await GetWorkDetail(workId);
  const typeName = typeNames[type] || "작품";

  // 사이트맵이 ?writeId= 까지 포함해 제출하므로 정본(canonical) 주소도 동일하게 맞춘다.
  const canonical = writeId
    ? `/post/${type}/${workId}?writeId=${writeId}`
    : `/post/${type}/${workId}`;

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

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { workId } = await params;

  return <PostDetailPage workId={workId} />;
}
