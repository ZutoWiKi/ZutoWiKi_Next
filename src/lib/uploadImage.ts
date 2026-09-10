"use client";

import { getToken } from "@/components/API/session";

/**
 * Vercel 서버리스 함수의 요청 본문 상한(약 4.5MB)보다 낮게 잡는다.
 * 백엔드는 5MB 까지 받지만, 그 사이 크기는 여기 오기도 전에 막히므로
 * 사용자에게 이유를 제대로 알려주려면 프론트에서 먼저 걸러야 한다.
 */
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"];

/**
 * 이미지를 올리고 공개 URL 을 돌려준다.
 * 실패하면 그대로 사용자에게 보여줄 수 있는 한국어 메시지로 throw 한다.
 */
export async function uploadImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("png, jpg, gif, webp 이미지만 올릴 수 있습니다.");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("이미지는 4MB 이하만 올릴 수 있습니다.");
  }

  const token = getToken();
  if (!token) {
    throw new Error("로그인이 필요합니다. 다시 로그인해 주세요.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api_/upload", {
    method: "POST",
    headers: { Authorization: `Token ${token}` },
    body: formData,
  });

  const data = (await res.json().catch(() => ({}))) as {
    url?: string;
    detail?: string;
  };

  if (res.status === 401 || res.status === 403) {
    throw new Error("로그인이 필요합니다. 다시 로그인해 주세요.");
  }

  if (res.status === 429) {
    throw new Error("업로드가 너무 잦습니다. 잠시 후 다시 시도해 주세요.");
  }

  if (!res.ok || typeof data.url !== "string") {
    throw new Error(data.detail || "이미지 업로드에 실패했습니다.");
  }

  return data.url;
}
