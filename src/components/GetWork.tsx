interface GetWorkProps {
  type: string;
}

async function get(type: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await fetch(`http://127.0.0.1:8000/pages/${type}/`);
  const json = await response.json();
  return json;
}

export default async function GetWork({ type }: GetWorkProps) {
  const data = await get(type);
  return (
    <div>
      <h1>{data.message}</h1>
      <p>Data for type: {type}</p>
    </div>
  );
}
