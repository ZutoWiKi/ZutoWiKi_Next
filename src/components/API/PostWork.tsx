"use server";

interface WorkData {
  typeindex: number;
  title: string;
  author: string;
  description: string;
  coverImage: string;
}

export async function PostWork(workData: WorkData) {
  console.log("작품 추가 시도:", workData);

  try {
    const response = await fetch("http://127.0.0.1:8000/post/work/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workData),
    });

    const data = await response.json();

    if (!response.ok) {
      // 백엔드에서 온 에러 메시지를 파싱
      let errorMessage = "작품 추가에 실패했습니다.";

      if (data.detail) {
        errorMessage = data.detail;
      } else if (data.message) {
        errorMessage = data.message;
      } else if (data.errors) {
        // 필드별 에러 메시지가 있는 경우
        const errorMessages = [];
        for (const [field, messages] of Object.entries(data.errors)) {
          if (Array.isArray(messages)) {
            errorMessages.push(...messages);
          } else {
            errorMessages.push(messages as string);
          }
        }
        errorMessage = errorMessages.join(", ");
      } else if (data.title) {
        errorMessage = `제목: ${Array.isArray(data.title) ? data.title.join(", ") : data.title}`;
      } else if (data.author) {
        errorMessage = `작가: ${Array.isArray(data.author) ? data.author.join(", ") : data.author}`;
      } else if (data.typeindex) {
        errorMessage = `타입: ${Array.isArray(data.typeindex) ? data.typeindex.join(", ") : data.typeindex}`;
      }

      throw new Error(errorMessage);
    }

    console.log("작품 추가 성공:", data);
    return data;
  } catch (error) {
    console.error("작품 추가 에러:", error);

    // 네트워크 에러 등 fetch 자체가 실패한 경우
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
    }

    // 이미 Error 객체인 경우 그대로 throw
    throw error;
  }
}
