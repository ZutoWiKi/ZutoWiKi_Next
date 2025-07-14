"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GetPopularWorksList, Work } from "./API/GetPopularWorksList";
import { GetPopularByViewsList } from "@/components/API/GetPopularWorksByViewList";
import { GetPopularByLikesList } from "@/components/API/GetPopularWorksByLikeList";

export default function RecommendedWorks() {
  const [works, setWorks] = useState<Work[]>([]);
  const [likesWorks, setLikesWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      const [writeList, likesList] = await Promise.all([
        GetPopularWorksList(token),
        GetPopularByViewsList(token),
        GetPopularByLikesList(token),
      ]);
      setWorks(writeList);
      setLikesWorks(likesList);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="p-4">로딩 중…</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      {/* 좋아요 순 목록 (새로 추가) */}
      <div className="p-4 bg-white/90 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">❤️ 인기 작품 (좋아요 순)</h2>
        <ul className="space-y-4">
          {likesWorks.map((w, index) => (
            <li
              key={w.id}
              className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition"
              onClick={() => router.push(`/post/${w.type_index}/${w.id}`)}
            >
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-red-400 to-pink-500 text-white font-bold rounded-full mr-3 flex-shrink-0">
                {index + 1}
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={w.coverImage}
                alt={w.title}
                className="w-12 h-16 object-cover rounded mr-3 flex-shrink-0"
                width={48}
                height={64}
              />
              <div className="flex-1">
                <p className="font-medium line-clamp-2 text-gray-800">
                  {w.title}
                </p>
                <p className="text-sm text-gray-500 mb-1">— {w.author}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    📝 {w.write_count || 0}개
                  </span>
                  <span className="flex items-center gap-1 font-medium text-red-600">
                    ❤️ {w.total_likes || 0}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 해석글 순 목록 */}
      <div className="p-4 bg-white/90 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">🔥 인기 작품 (해석글 순)</h2>
        <ul className="space-y-4">
          {works.map((w, index) => (
            <li
              key={w.id}
              className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition"
              onClick={() => router.push(`/post/${w.type_index}/${w.id}`)}
            >
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold rounded-full mr-3 flex-shrink-0">
                {index + 1}
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={w.coverImage}
                alt={w.title}
                className="w-12 h-16 object-cover rounded mr-3 flex-shrink-0"
                width={48}
                height={64}
              />
              <div className="flex-1">
                <p className="font-medium line-clamp-2 text-gray-800">
                  {w.title}
                </p>
                <p className="text-sm text-gray-500 mb-1">— {w.author}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1 font-medium text-blue-600">
                    📝 {w.write_count || 0}개
                  </span>
                  <span className="flex items-center gap-1">
                    ❤️ {w.total_likes || 0}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
