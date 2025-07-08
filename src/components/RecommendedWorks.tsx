"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GetPopularWorksList, Work } from "./API/GetPopularWorksList";

export default function RecommendedWorks() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const list = await GetPopularWorksList(token);
        setWorks(list);
      } catch (err: any) {
        setError(err.message ?? "알 수 없는 오류");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-4">로딩 중…</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <aside className="p-4 bg-white/90 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">🔥 인기 작품</h2>
      <ul className="space-y-4">
        {works.map((w) => (
          <li
            key={w.id}
            className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition"
            onClick={() => router.push(`/post/${w.type_index}/${w.id}`)}
          >
            <img
              src={w.coverImage}
              alt={w.title}
              className="w-12 h-16 object-cover rounded mr-3 flex-shrink-0"
            />
            <div>
              <p className="font-medium line-clamp-2 text-gray-800">
                {w.title}
              </p>
              <p className="text-sm text-gray-500">— {w.author}</p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
