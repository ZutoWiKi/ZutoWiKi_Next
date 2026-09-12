"use client";

import { readApi } from "@/lib/readApi";

/** 목록 카드가 쓰는 필드. 본문(content)은 목록에 싣지 않는다. */
export interface AllWrite {
  id: number;
  title: string;
  user_name: string;
  work_title: string;
  work_author: string;
  work_id: number;
  type_index: string;
  created_at: string;
  views: number;
  likes: number;
  comments: number;
  excerpt?: string;
  is_liked?: boolean;
  /** 예전 응답 호환용. 목록에서는 쓰지 않는다. */
  content?: string;
}

export interface WritePage {
  count: number;
  page: number;
  page_size: number;
  num_pages: number;
  results: AllWrite[];
}

export type WriteSort = "recent" | "old" | "views" | "likes" | "comments";

export interface GetWritesOptions {
  page?: number;
  pageSize?: number;
  sort?: WriteSort;
  /** 로그인한 사용자가 쓴 글만 */
  mine?: boolean;
  token?: string | null;
}

/**
 * 해석글 목록 한 페이지를 가져온다.
 *
 * 예전에는 전체를 한 번에 받아 브라우저에서 정렬·자르기를 했다. 글 43건에
 * 92KB 였고, 그중 16만 자가 목록에서 쓰지도 않는 본문이었다.
 */
export async function GetWritesPage({
  page = 1,
  pageSize = 15,
  sort = "recent",
  mine = false,
  token,
}: GetWritesOptions = {}): Promise<WritePage> {
  const data = await readApi<WritePage | AllWrite[]>(
    "writes",
    {
      page,
      page_size: pageSize,
      sort,
      summary: 1,
      mine: mine ? 1 : undefined,
    },
    token,
  );

  // 페이지네이션을 모르는 예전 백엔드는 배열을 그대로 준다. 프론트가 먼저
  // 배포돼도 목록이 깨지지 않도록 받아준다(정렬·쪽나눔은 서버가 해야 정확하다).
  if (Array.isArray(data)) {
    return {
      count: data.length,
      page: 1,
      page_size: data.length || pageSize,
      num_pages: 1,
      results: data,
    };
  }

  return data;
}
