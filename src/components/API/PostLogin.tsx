"use server";
export async function PostLogin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await fetch(
      "https://hospitable-illumination-production-e611.up.railway.app/api/user/login/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      // 백엔드에서 온 에러 메시지를 사용하거나 기본 메시지 사용
      const errorMessage =
        data.detail || data.message || "로그인에 실패했습니다.";
      throw new Error(errorMessage);
    }

    const { token } = data;

    // 토큰은 로그에 남기지 않는다. 서버 액션에서는 localStorage에 직접
    // 접근할 수 없으므로 token 을 호출부로 돌려준다.
    return { token };
  } catch (error) {
    console.error("로그인 에러:", error);

    // 네트워크 에러 등 fetch 자체가 실패한 경우
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
    }

    // 이미 Error 객체인 경우 그대로 throw
    throw error;
  }
}
