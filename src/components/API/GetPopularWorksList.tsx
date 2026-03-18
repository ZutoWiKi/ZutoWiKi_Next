"use server";
export interface Work {
  id: number;
  type_index: number;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  num_likes?: number; // 좋아요 수
  total_views?: number; // 총 조회수
  total_likes?: number; // 전체 좋아요 수 - 새로 추가
  write_count?: number; // 해석글 개수
}

export async function GetPopularWorksList(token: string | null) {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/post/popular/", {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    if (!res.ok) throw new Error("인기 작품을 불러오는데 실패했습니다.");
    const data = await res.json();
    return data.works;
  } catch {
    console.log("GetPopularWorksList fetch fail");
  }
}
