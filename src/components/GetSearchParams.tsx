"use client";

import { useSearchParams } from "next/navigation";

export function GetSearchParams(): URLSearchParams | null {
  const searchParams = useSearchParams();
  return searchParams;
}
