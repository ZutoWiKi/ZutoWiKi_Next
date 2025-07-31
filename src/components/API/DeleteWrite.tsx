"use server";
export interface DeleteWriteData {
  password: string;
}

export const DeleteWrite = async (
  writeId: number,
  password: string,
  token: string,
) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/post/write/${writeId}/delete/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ password }),
      },
    );

    if (!response.ok) {
      let errorMessage = "글 삭제에 실패했습니다.";
      try {
        const errorData = await response.json();
        console.error("DeleteWrite API Error:", errorData);
        errorMessage =
          errorData.error || errorData.detail || JSON.stringify(errorData);
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("글 삭제 에러:", error);
    throw error;
  }
};
