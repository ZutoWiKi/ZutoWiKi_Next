"use server";

export interface AllWrite {
  id: number;
  title: string;
  user_name: string;
  content: string;
  work_title: string;
  work_author: string;
  work_id: number;
  type_index: string;
  created_at: string;
  views: number;
  likes: number;
  comments: number;
  is_liked?: boolean;
}

export async function GetAllWrites(token?: string | null): Promise<AllWrite[]> {
  console.log("전체 글 목록 조회 시도");

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // 토큰이 있으면 Authorization 헤더 추가 (좋아요 상태 확인용)
    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }

    const response = await fetch(`http://127.0.0.1:8000/api/post/write/all`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.detail ||
        data.message ||
        "전체 글 목록을 가져오는데 실패했습니다.";
      throw new Error(errorMessage);
    }

    console.log("전체 글 목록 조회 성공:", data);
    return data;
  } catch (error) {
    console.error("전체 글 목록 조회 에러:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
    }

    throw error;
  }
}
