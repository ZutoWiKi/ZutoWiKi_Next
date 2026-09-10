"use server";

// "use server" 파일에서는 async 함수만 내보낼 수 있으므로 타입은 내보내지 않는다.
interface CreateCommentResult {
  ok: boolean;
  /** HTTP 상태. 요청 자체가 실패하면 0. */
  status: number;
  data: Record<string, unknown>;
}

export async function CreateComment(
  writeId: number,
  content: string,
  token: string,
): Promise<CreateCommentResult> {
  try {
    const res = await fetch(
      `https://hospitable-illumination-production-e611.up.railway.app/api/post/comment/comments/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ write: writeId, content }),
      },
    );

    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch {
    console.log("create comment fetch fail");
    return { ok: false, status: 0, data: {} };
  }
}
