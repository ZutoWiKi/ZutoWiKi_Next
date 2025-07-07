"use server";
export async function PostLogin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("로그인 시도 : ", email, password);

  const response = await fetch("http://127.0.0.1:8000/user/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("로그인 실패");
  const { token } = await response.json();
  console.log(token);

  // 서버 액션에서는 localStorage에 직접 접근할 수 없으므로 token을 반환
  return { token };
}
