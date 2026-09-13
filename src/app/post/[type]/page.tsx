import { notFound } from "next/navigation";
import WorkListPage from "@/components/WorkListPage";
import { categoryName, isCategory } from "@/config/categories";
import { fetchWorksByType } from "@/lib/serverApi";
import { Metadata } from "next";

interface PostTypePageProps {
  params: Promise<{
    type: string;
  }>;
}

export async function generateMetadata({
  params,
}: PostTypePageProps): Promise<Metadata> {
  const { type } = await params;
  const typeName = categoryName(type);
  const title = `${typeName} 해석 목록`;
  const description = `${typeName} 작품 목록을 확인하고 다양한 해석을 만나보세요.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/post/${type}`,
    },
    openGraph: {
      title,
      description,
      url: `/post/${type}`,
    },
  };
}

export default async function PostTypePage({ params }: PostTypePageProps) {
  const { type } = await params;

  // 없는 갈래 주소를 빈 목록으로 200 응답하면 검색엔진이 내용 없는 페이지를 색인한다.
  if (!isCategory(type)) notFound();

  // 첫 HTML 에 작품 목록과 링크가 들어가도록 서버에서 먼저 받는다.
  const works = await fetchWorksByType(type);

  // 갈래를 옮겨 다닐 때 이전 갈래의 목록이 남지 않도록 갈래마다 새로 만든다.
  return (
    <WorkListPage key={type} type={type} initialWorks={works ?? undefined} />
  );
}
