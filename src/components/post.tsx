async function post(movieData: any) {
  //await new Promise((resolve) => setTimeout(resolve, 5000));
  const response = await fetch("http://127.0.0.1:8001/api/users/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movieData),
  });

  const json = await response.json();
  return json;
}

export default async function PostHello() {
  const data = await post({ name: "lgh", email: "sslgh1024@naver.com" });
  return (
    <div>
      <h1>{data.message}</h1>
    </div>
  );
}
