"use server";

export async function UpdateWriteLike(
  writeId: number,
  action: "increase" | "decrease" | "toggle",
  token: string | null,
) {
  console.log("좋아요 업데이트 시도:", { writeId, action });

  try {
    const response = await fetch(`http://localhost:8000/api/post/write/${writeId}/likes/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`, // Django Token 형식으로 변경
      },
      body: JSON.stringify({ action }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.detail || data.message || "좋아요 업데이트에 실패했습니다.";
      throw new Error(errorMessage);
    }

    console.log("좋아요 업데이트 성공:", data);
    return data;
  } catch (error) {
    console.error("좋아요 업데이트 에러:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
    }

    throw error;
  }
}
