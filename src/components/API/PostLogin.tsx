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

  const json = await response.json();
  console.log(json);
}
