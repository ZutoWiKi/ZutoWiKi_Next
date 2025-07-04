"use server";
export async function PostRegister(formData: FormData) {
  const username        = formData.get("username") as string;
  const email           = formData.get("email") as string;
  const password        = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  console.log("회원가입 시도",username ,email, password, confirmPassword);

  const response = await fetch("http://127.0.0.1:8000/user/register/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password, confirmPassword}),
  });

  const json = await response.json();
  console.log(json);
}
