export interface Comment {
  id: number;
  user_id: number;
  user_name: string;
  content: string;
  created_at: string;
  likes: number;
  parentID: number;
}

export async function GetCommentsList(writeId: number) {
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/post/comment/comments/?write=${writeId}`,
    );
    if (!res.ok) throw new Error("댓글 목록을 불러오지 못했습니다.");
    return (await res.json()) as Comment[];
  } catch {
    console.log("GetCommentsList fetch fail");
  }
}
