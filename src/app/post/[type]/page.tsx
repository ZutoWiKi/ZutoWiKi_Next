import WorkListPage from "@/components/WorkListPage";
import { categoryName } from "@/config/categories";
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

  return <WorkListPage type={type} />;
}
