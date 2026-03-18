"use server";

interface WriteData {
  title: string;
  content: string;
  user: number;
  work: number;
  parentID: number;
}

interface WriteResponse {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
  title?: string | string[];
  content?: string | string[];
  user?: string | string[];
  work?: string | string[];
}

export async function PostWrite(writeData: WriteData) {
  console.log("글 작성 시도:", writeData);

  try {
    const response = await fetch("http://127.0.0.1:8000/api/post/write/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(writeData),
    });

    const data: WriteResponse = await response.json();

    if (!response.ok) {
      // 백엔드에서 온 에러 메시지를 파싱
      let errorMessage = "글 작성에 실패했습니다.";

      if (data.detail) {
        errorMessage = data.detail;
      } else if (data.message) {
        errorMessage = data.message;
      } else if (data.errors) {
        // 필드별 에러 메시지가 있는 경우
        const errorMessages = [];
        for (const [, messages] of Object.entries(data.errors)) {
          if (Array.isArray(messages)) {
            errorMessages.push(...messages);
          } else {
            errorMessages.push(messages as string);
          }
        }
        errorMessage = errorMessages.join(", ");
      } else if (data.title) {
        errorMessage = `제목: ${Array.isArray(data.title) ? data.title.join(", ") : data.title}`;
      } else if (data.content) {
        errorMessage = `내용: ${Array.isArray(data.content) ? data.content.join(", ") : data.content}`;
      } else if (data.user) {
        errorMessage = `사용자: ${Array.isArray(data.user) ? data.user.join(", ") : data.user}`;
      } else if (data.work) {
        errorMessage = `작품: ${Array.isArray(data.work) ? data.work.join(", ") : data.work}`;
      }

      throw new Error(errorMessage);
    }

    console.log("글 작성 성공:", data);
    return data;
  } catch (error) {
    console.error("글 작성 에러:", error);

    // 네트워크 에러 등 fetch 자체가 실패한 경우
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
    }

    // 이미 Error 객체인 경우 그대로 throw
    throw error;
  }
}
