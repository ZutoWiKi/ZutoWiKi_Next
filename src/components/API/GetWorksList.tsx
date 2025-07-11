"use server";

export async function GetWorksList(type: string) {
  console.log("작품 목록 조회 시도:", type);

  try {
    const response = await fetch(
      `http://yoonseul.site/post/work?type=${type}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // 캐시 설정 (선택사항)
        cache: "no-store", // 실시간 데이터가 필요한 경우
        // 또는 next: { revalidate: 60 } // 60초마다 갱신
      },
    );
    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.detail || data.message || "작품 목록을 가져오는데 실패했습니다.";
      throw new Error(errorMessage);
    }

    console.log("작품 목록 조회 성공:", data);
    return data;
  } catch (error) {
    console.error("작품 목록 조회 에러:", error);

    // 네트워크 에러 등 fetch 자체가 실패한 경우
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
    }

    // 이미 Error 객체인 경우 그대로 throw
    throw error;
  }
}
