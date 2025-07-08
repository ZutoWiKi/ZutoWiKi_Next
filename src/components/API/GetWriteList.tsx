// 클라이언트 사이드 API 함수로 변경
export async function GetWritesList(workId: string, parentId?: string) {
  console.log("해석글 목록 조회 시도:", { workId, parentId });

  try {
    let url = `http://127.0.0.1:8000/post/write/?work_id=${workId}`;
    if (parentId) {
      url += `&parent_id=${parentId}`;
    }

    // 클라이언트에서 토큰을 가져와서 헤더에 추가
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // localStorage에서 토큰 가져오기
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
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
