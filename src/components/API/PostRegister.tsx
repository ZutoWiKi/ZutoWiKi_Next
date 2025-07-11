"use server";

interface RegisterResponse {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
  username?: string[];
  email?: string[];
  password?: string[];
}

export async function PostRegister(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  console.log("회원가입 시도", username, email, password, confirmPassword);

  try {
    const response = await fetch("http://localhost:8000/api/user/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password, confirmPassword }),
    });

    const data: RegisterResponse = await response.json();
    console.log("회원가입 응답:", data);

    if (!response.ok) {
      // 백엔드에서 온 에러 메시지를 파싱
      let errorMessage = "회원가입에 실패했습니다.";

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
            errorMessages.push(messages);
          }
        }
        errorMessage = errorMessages.join(", ");
      } else if (data.username) {
        errorMessage = `이름: ${data.username.join(", ")}`;
      } else if (data.email) {
        errorMessage = `이메일: ${data.email.join(", ")}`;
      } else if (data.password) {
        errorMessage = `비밀번호: ${data.password.join(", ")}`;
      }

      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("회원가입 에러:", error);

    // 네트워크 에러 등 fetch 자체가 실패한 경우
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
    }

    // 이미 Error 객체인 경우 그대로 throw
    throw error;
  }
}
