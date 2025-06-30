async function get() {
  await new Promise((resolve) => setTimeout(resolve, 10000));
  const response = await fetch("http://127.0.0.1:8001/api/hello/");
  const json = await response.json();
  return json;
}

export default async function GetHello() {
  const data = await get();
  return (
    <div>
      <h1>{data.message}</h1>
    </div>
  );
}
