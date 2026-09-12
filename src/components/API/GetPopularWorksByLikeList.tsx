"use client";

import { readApi } from "@/lib/readApi";

import type { Work } from "./GetPopularWorksList";

export async function GetPopularByLikesList(token: string | null): Promise<Work[]> {
  const data = await readApi<{ works: Work[] }>("popular-likes", undefined, token);
  return data.works ?? [];
}
