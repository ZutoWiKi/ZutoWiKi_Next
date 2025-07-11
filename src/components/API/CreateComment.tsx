export async function CreateComment(
  writeId: number,
  content: string,
  token: string,
) {
  try {
    const res = await fetch(`http://yoonseul.site/post/comment/comments/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ write: writeId, content }),
    });
    return await res.json();
  } catch {
    console.log("create comment fetch fail");
    return {};
  }
}
