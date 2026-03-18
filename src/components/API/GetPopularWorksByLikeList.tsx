"use server";
export interface Work {
  id: number;
  type_index: number;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  total_likes?: number; // 전체 좋아요 수
  total_views?: number; // 총 조회수
  write_count?: number; // 해석글 개수
}

export async function GetPopularByLikesList(token: string | null) {
  try {
    const res = await fetch(
      "https://hospitable-illumination-production-e611.up.railway.app/api/post/popular/likes/",
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
    );
    if (!res.ok)
      throw new Error("인기 작품(좋아요 순)을 불러오는데 실패했습니다.");
    const data = await res.json();
    return data.works;
  } catch {
    console.log("GetPopularByLikesList fetch fail");
  }
}
