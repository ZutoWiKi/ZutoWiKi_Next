"use server";

export async function GetWritesList(workId: string, token?: string | null) {
  console.log("해석 목록 요청:", workId);

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // 토큰이 있으면 Authorization 헤더 추가
    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }

    const response = await fetch(
      `http://yoonseul.site/post/write/?work_id=${workId}`,
      {
        method: "GET",
        headers,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.detail || data.message || "해석 목록을 불러오는데 실패했습니다.";
      throw new Error(errorMessage);
    }

    console.log("해석 목록 조회 성공:", data);
    return data;
  } catch (error) {
    console.error("해석 목록 조회 에러:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
    }

    throw error;
  }
}
