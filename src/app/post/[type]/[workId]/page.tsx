import React from "react";
import PostDetailPage from "@/components/PostDetailPage";
import { GetWorkDetail } from "@/components/API/GetWorkDetail";
import { Metadata } from "next";

interface WorkDetailPageProps {
  params: Promise<{
    type: string;
    workId: string;
  }>;
}

const typeNames: Record<string, string> = {
  song: "곡",
  album: "앨범",
  mv: "뮤직비디오",
};

export async function generateMetadata({
  params,
}: WorkDetailPageProps): Promise<Metadata> {
  const { type, workId } = await params;

  const work = await GetWorkDetail(workId);
  const typeName = typeNames[type] || "작품";

  return {
    title: `${work.title} - ${typeName} 해석`,
    description: `${work.author}의 ${typeName} "${work.title}"에 대한 다양한 해석을 만나보세요. ${work.description}`,
    openGraph: {
      title: `${work.title} - ${typeName} 해석 | Yoonseul`,
      description: `${work.author}의 ${typeName} "${work.title}"에 대한 다양한 해석을 만나보세요.`,
      images: work.coverImage ? [work.coverImage] : undefined,
    },
  };
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { workId } = await params;

  return <PostDetailPage workId={workId} />;
}
