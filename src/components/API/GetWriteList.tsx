"use server";

export async function GetWritesList(workId: string, parentId?: string) {
  console.log("해석글 목록 조회 시도:", { workId, parentId });

  try {
    let url = `http://127.0.0.1:8000/post/write/?work_id=${workId}`;
    if (parentId) {
      url += `&parent_id=${parentId}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.detail || data.message || "해석글 목록을 가져오는데 실패했습니다.";
      throw new Error(errorMessage);
    }

    console.log("해석글 목록 조회 성공:", data);
    return data;
  } catch (error) {
    console.error("해석글 목록 조회 에러:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
    }

    throw error;
  }
}
