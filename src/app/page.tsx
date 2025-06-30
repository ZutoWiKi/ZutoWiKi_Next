async function getMovies() {
  const response = await fetch("http://127.0.0.1:8001/api/hello/");
  const json = await response.json();
  return json;
}

export default async function MyAPP() {
  const data = await getMovies();
  return <h1>{data.message}</h1>;
}
