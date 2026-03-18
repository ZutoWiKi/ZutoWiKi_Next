import WorkListPage from "@/components/WorkListPage";
import { Metadata } from "next";

interface PostTypePageProps {
  params: Promise<{
    type: string;
  }>;
}

const typeNames: Record<string, string> = {
  song: "곡 해석",
  album: "앨범 해석",
  mv: "뮤직비디오 해석",
};

export async function generateMetadata({
  params,
}: PostTypePageProps): Promise<Metadata> {
  const { type } = await params;
  const typeName = typeNames[type] || "작품";

  return {
    title: `${typeName} 목록`,
    description: `${typeName} 목록을 확인하고 다양한 해석을 만나보세요.`,
    openGraph: {
      title: `${typeName} 목록`,
      description: `${typeName} 목록을 확인하고 다양한 해석을 만나보세요.`,
    },
  };
}

export default async function PostTypePage({ params }: PostTypePageProps) {
  const { type } = await params;

  return <WorkListPage type={type} />;
}
