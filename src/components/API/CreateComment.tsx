export async function CreateComment(
  writeId: number,
  content: string,
  token: string
) {
  const res = await fetch(`http://127.0.0.1:8000/post/comment/comments/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      Authorization: `Token ${token}`
    },
    body: JSON.stringify({ write: writeId, content })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || '댓글 작성에 실패했습니다.');
  }
  return await res.json();
}