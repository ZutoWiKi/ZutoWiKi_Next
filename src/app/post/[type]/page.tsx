import PageLayout from "@/components/PageLayout";
import FloatingMenu from "@/components/FloatingMenu";
import WorkListPage from "@/components/WorkListPage";

interface PostTypePageProps {
  params: {
    type: string;
  };
}

export default function PostTypePage({ params }: PostTypePageProps) {
  const { type } = params;

  return <WorkListPage type={type} />;
}
