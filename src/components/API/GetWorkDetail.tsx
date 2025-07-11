"use server";

interface WorkDetailResponse {
  id: number;
  type_index: number;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  num_likes?: number;
  total_views?: number;
  write_count?: number;
}

export async function GetWorkDetail(
  workId: string,
): Promise<WorkDetailResponse> {
  console.log("작품 상세 조회 시도:", workId);

  try {
    const response = await fetch(`https://127.0.0.1:8000/post/work/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.detail || data.message || "작품 정보를 가져오는데 실패했습니다.";
      throw new Error(errorMessage);
    }

    // workId와 일치하는 작품 찾기
    const work = data.find(
      (work: WorkDetailResponse) => work.id.toString() === workId,
    );

    if (!work) {
      throw new Error("해당 작품을 찾을 수 없습니다.");
    }

    console.log("작품 상세 조회 성공:", work);
    return work;
  } catch (error) {
    console.error("작품 상세 조회 에러:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
    }

    throw error;
  }
}
