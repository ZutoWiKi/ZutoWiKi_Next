import React from "react";
import PostDetailPage from "@/components/PostDetailPage";

interface WorkDetailPageProps {
  params: Promise<{
    workId: string;
  }>;
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { workId } = await params;

  return <PostDetailPage workId={workId} />;
}
