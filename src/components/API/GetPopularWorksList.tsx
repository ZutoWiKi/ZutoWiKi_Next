"use client";

import { readApi } from "@/lib/readApi";

export interface Work {
  id: number;
  type_index: number;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  num_likes?: number;
  total_views?: number;
  total_likes?: number;
  write_count?: number;
}

export async function GetPopularWorksList(token: string | null): Promise<Work[]> {
  const data = await readApi<{ works: Work[] }>("popular", undefined, token);
  return data.works ?? [];
}
