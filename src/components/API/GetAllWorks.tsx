"use server";

export interface AllWork {
  id: number;
  title: string;
  author: string;
  coverImage?: string;
  description: string;
  type_index: string;
  write_count?: number;
  total_likes?: number;
}

export async function GetAllWorks(): Promise<AllWork[]> {
  console.log("전체 작품 목록 조회 시도");

  try {
    const response = await fetch(
      `https://hospitable-illumination-production-e611.up.railway.app/api/post/work/all`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // 실시간 데이터가 필요한 경우
      },
    );
    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.detail ||
        data.message ||
        "전체 작품 목록을 가져오는데 실패했습니다.";
      throw new Error(errorMessage);
    }

    console.log("전체 작품 목록 조회 성공:", data);
    return data;
  } catch (error) {
    console.error("전체 작품 목록 조회 에러:", error);

    // 네트워크 에러 등 fetch 자체가 실패한 경우
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
    }

    // 이미 Error 객체인 경우 그대로 throw
    throw error;
  }
}
