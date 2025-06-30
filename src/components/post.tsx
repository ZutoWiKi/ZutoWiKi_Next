"use server";
export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const response = await fetch("http://127.0.0.1:8001/api/users/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email }),
  });

  const json = await response.json();
  console.log(json);
  return json;
}
