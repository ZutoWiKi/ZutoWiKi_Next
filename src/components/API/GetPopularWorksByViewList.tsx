"use client";

import { readApi } from "@/lib/readApi";

import type { Work } from "./GetPopularWorksList";

export async function GetPopularByViewsList(token: string | null): Promise<Work[]> {
  const data = await readApi<{ works: Work[] }>("popular-views", undefined, token);
  return data.works ?? [];
}
