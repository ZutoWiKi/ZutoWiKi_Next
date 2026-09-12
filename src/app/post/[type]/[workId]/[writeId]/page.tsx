import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDetailPage from "@/components/PostDetailPage";
import { GetWorkDetail } from "@/components/API/GetWorkDetail";
import { categoryName } from "@/config/categories";
import { writePath, writeTitle } from "@/lib/writeLink";
import { API_URL } from "@/config/site";

/**
 * 해석글 한 편의 고유 주소.
 *
 * 예전에는 작품 페이지에 ?writeId= 를 붙여 글을 골랐는데, writeId 를
 * 브라우저에서만 읽었기 때문에 제목·설명·미리보기가 작품 기준으로 고정됐다.
 * 한 작품에 달린 글이 전부 같은 제목으로 공유되고, 검색엔진에도 같은
 * 페이지로 보였다. 이제 서버에서 글을 읽어 글마다 다른 메타데이터를 만든다.
 */
interface PageProps {
  params: Promise<{ type: string; workId: string; writeId: string }>;
}

interface WriteRow {
  id: number;
  title: string;
  content?: string;
  user_name?: string;
}

/**
 * 작품에 달린 글 중 하나를 서버에서 읽는다. 글 하나만 주는 엔드포인트는 아직 없다.
 *
 * "없는 글"과 "서버에 못 물어봄"을 구분한다. 백엔드가 잠깐 죽었을 때 멀쩡한
 * 글을 404 로 만들면 검색엔진이 색인에서 내려버린다.
 */
type WriteLookup =
  | { status: "found"; write: WriteRow }
  | { status: "missing" }
  | { status: "unavailable" };

async function getWrite(
  workId: string,
  writeId: string,
): Promise<WriteLookup> {
  try {
    const res = await fetch(`${API_URL}/api/post/write/?work_id=${workId}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return { status: "unavailable" };
    const rows: WriteRow[] = await res.json();
    const write = rows.find((w) => String(w.id) === writeId);
    return write ? { status: "found", write } : { status: "missing" };
  } catch {
    return { status: "unavailable" };
  }
}

/** 본문 마크다운에서 설명문으로 쓸 만한 첫 문장들을 뽑는다. */
function toDescription(content: string | undefined, fallback: string): string {
  if (!content) return fallback;
  const plain = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!plain) return fallback;
  return plain.length > 155 ? `${plain.slice(0, 155)}…` : plain;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { type, workId, writeId } = await params;

  const [work, lookup] = await Promise.all([
    GetWorkDetail(workId).catch(() => null),
    getWrite(workId, writeId),
  ]);
  const write = lookup.status === "found" ? lookup.write : null;

  const canonical = writePath(type, workId, writeId);
  const typeName = categoryName(type);

  if (!write) {
    return {
      title: work ? `${work.title} - ${typeName} 해석` : "해석글",
      alternates: { canonical },
    };
  }

  const title = writeTitle(write.title, work ? work.title : typeName);
  const description = toDescription(
    write.content,
    work
      ? `${work.author}의 ${typeName} "${work.title}"에 대한 해석입니다.`
      : "윤슬에 올라온 해석입니다.",
  );

  return {
    title,
    description,
    authors: write.user_name ? [{ name: write.user_name }] : undefined,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      images: work?.coverImage ? [work.coverImage] : undefined,
    },
  };
}

export default async function WriteDetailPage({ params }: PageProps) {
  const { workId, writeId } = await params;

  // 숫자가 아닌 조각은 글 주소가 아니다.
  if (!/^\d+$/.test(writeId)) notFound();

  // 이 작품에 그 글이 없으면 404 다. 그냥 두면 첫 글이 대신 보여서
  // 한 글이 여러 주소를 갖게 되고 검색엔진에 중복으로 잡힌다.
  // 위 generateMetadata 와 같은 요청이라 Next 가 합쳐 준다.
  const lookup = await getWrite(workId, writeId);
  if (lookup.status === "missing") notFound();

  return <PostDetailPage workId={workId} initialWriteId={writeId} />;
}
