import React, { ReactElement } from "react";
import PageLayout from "@/components/PageLayout";
import FloatingMenu from "@/components/FloatingMenu";
import PostDetailPage from "@/components/PostDetailPage";
import AnimatedList from "@/components/AnimatedList";

interface WorkDetailPageProps {
  params: {
    type: string;
    workId: string;
  };
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { type, workId } = await params;

  return <PostDetailPage workId={workId} type={type} />;
}
