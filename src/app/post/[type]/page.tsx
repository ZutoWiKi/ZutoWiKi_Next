import WorkListPage from "@/components/WorkListPage";

interface PostTypePageProps {
  params: {
    type: string;
  };
}

export default async function PostTypePage({ params }: PostTypePageProps) {
  const { type } = await params;

  return <WorkListPage type={type} />;
}
