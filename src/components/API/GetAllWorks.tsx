"use client";

import { readApi } from "@/lib/readApi";

export interface AllWork {
  id: number;
  title: string;
  author: string;
  coverImage?: string;
  description: string;
  type_index: string;
  write_count?: number;
  total_likes?: number;
}

export async function GetAllWorks(): Promise<AllWork[]> {
  return readApi<AllWork[]>("works");
}
