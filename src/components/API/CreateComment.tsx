"use server";
export async function CreateComment(
  writeId: number,
  content: string,
  token: string,
) {
  try {
    //console.log(writeId, content, token);
    const res = await fetch(
      `https://hospitable-illumination-production-e611.up.railway.app/api/post/comment/comments/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ write: writeId, content }),
      },
    );
    return await res.json();
  } catch {
    console.log("create comment fetch fail");
    return {};
  }
}
