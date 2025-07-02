import React from "react";
import PageLayout from "@/components/PageLayout";
import FloatingMenu from "@/components/FloatingMenu";
import PostDetailPage from "@/components/PostDetailPage";

interface WorkDetailPageProps {
  params: {
    type: string;
    workId: string;
  };
}

export default function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { type, workId } = params;

  return <PostDetailPage workId={workId} type={type} />;
}
