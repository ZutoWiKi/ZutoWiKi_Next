export interface Work {
  id: number;
  type_index: number;
  title: string;
  author: string;
  coverImage: string;
  description: string;
}

export async function GetPopularWorksList(): Promise<Work[]> {
  const token = localStorage.getItem('token');
  const res = await fetch(
    "http://localhost:8000/post/popular/",
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    }
  );
  if (!res.ok) throw new Error('인기 작품을 불러오는데 실패했습니다.');
  const data = await res.json();
  return data.works;
}