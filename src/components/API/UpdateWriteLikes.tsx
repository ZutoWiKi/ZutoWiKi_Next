"use server";

export async function UpdateWriteLike(
  writeId: number,
  action: "increase" | "decrease" | "toggle",
) {
  console.log("좋아요 업데이트 시도:", { writeId, action });

  try {
    // 토큰 가져오기 (실제 구현에서는 쿠키나 다른 방법 사용)
    const token = process.env.USER_TOKEN || "temp_token"; // 임시

    const response = await fetch(
      `http://127.0.0.1:8000/post/write/${writeId}/likes/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 인증 헤더 추가
        },
        body: JSON.stringify({ action }),
      },
    );

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
