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
  write_count?: number; // 해석글 개수
}

export async function GetPopularByViewsList(token: string | null) {
  try {
    const res = await fetch("http://127.0.0.1:8000/post/popular/views/", {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    if (!res.ok)
      throw new Error("인기 작품(조회수 순)을 불러오는데 실패했습니다.");
    const data = await res.json();
    return data.works;
  } catch {
    console.log("GetPopularByViewsList fetch fail");
  }
}
