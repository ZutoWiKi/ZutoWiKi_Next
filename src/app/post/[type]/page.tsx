import { notFound, permanentRedirect } from "next/navigation";
import WorkListPage from "@/components/WorkListPage";
import { categoryName, isCategory } from "@/config/categories";
import { fetchWorksByType } from "@/lib/serverApi";
import { categoryPath } from "@/lib/writeLink";
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
  const canonical = categoryPath(type);

  // 아래 페이지와 같은 요청이라 Next 가 합쳐 준다.
  const works = await fetchWorksByType(type);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
    },
    // 작품이 하나도 없는 갈래는 빈 목록뿐이라 색인하지 않는다.
    // 목록을 못 받았을 때(null)는 멀쩡한 갈래를 내리지 않도록 그대로 둔다.
    ...(works?.length === 0 ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function PostTypePage({ params }: PostTypePageProps) {
  const { type } = await params;

  // 없는 갈래 주소를 빈 목록으로 200 응답하면 검색엔진이 내용 없는 페이지를 색인한다.
  if (!isCategory(type)) notFound();

  // 수필 목록의 정본은 /post/essay 다(writeLink 의 categoryPath 참고). /post/esay 는 늘 비어 있다.
  const canonical = categoryPath(type);
  if (canonical !== `/post/${type}`) permanentRedirect(canonical);

  // 첫 HTML 에 작품 목록과 링크가 들어가도록 서버에서 먼저 받는다.
  const works = await fetchWorksByType(type);

  // 갈래를 옮겨 다닐 때 이전 갈래의 목록이 남지 않도록 갈래마다 새로 만든다.
  return (
    <WorkListPage key={type} type={type} initialWorks={works ?? undefined} />
  );
}
