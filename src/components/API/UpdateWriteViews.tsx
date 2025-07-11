"use server";

export async function UpdateWriteViews(writeId: number) {
  console.log("조회수 증가 시도:", writeId);

  try {
    const response = await fetch(`/api/post/write/${writeId}/views/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.detail || data.message || "조회수 업데이트에 실패했습니다.";
      throw new Error(errorMessage);
    }

    console.log("조회수 증가 성공:", data);
    return data;
  } catch (error) {
    console.error("조회수 증가 에러:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
    }

    throw error;
  }
}
