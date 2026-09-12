"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GetWritesPage, AllWrite } from "@/components/API/GetAllWrites";
import UserProfileColor from "@/components/UserProfileColor";

interface User {
  id: number;
  username: string;
  email: string;
  date_joined: string;
}

const GetMyPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [writes, setWrites] = useState<AllWrite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("로그인이 필요합니다.");
          setLoading(false);
          return;
        }

        // 사용자 정보와 내 글을 동시에 받는다. 서버 액션이 아니라 보통
        // 요청이므로 실제로 병렬로 나간다.
        //
        // 예전에는 전체 글 목록(92KB)을 통째로 받아 브라우저에서 걸렀다.
        // 게다가 응답에 user_id 가 없어서 실제로 맞물리는 건 작성자 이름
        // 비교 한 줄뿐이었다. 이제 서버가 로그인한 사용자 기준으로 걸러준다.
        const [userRes, myPage] = await Promise.all([
          fetch("/api_/mypage", {
            credentials: "include",
            headers: { Authorization: `Token ${token}` },
          }),
          GetWritesPage({ mine: true, pageSize: 100, token }),
        ]);

        if (!userRes.ok) throw new Error("사용자 정보를 불러올 수 없습니다.");
        const userData: User = await userRes.json();
        setUser(userData);

        const myWrites = myPage.results;

        setWrites(myWrites);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "에러가 발생했습니다.");
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-2xl p-6 flex items-center space-x-4">
        유저 정보를 불러오는 중..
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-white shadow-md rounded-2xl p-6 flex items-center space-x-4">
        {error || "유저 정보를 불러올 수 없습니다."}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      {/* 사용자 프로필 */}
      <div className="flex items-center space-x-4 mb-6">
        <UserProfileColor
          id={user.id}
          alt="avatar"
          width={120}
          height={60}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">{user.username}</h2>
          <p className="text-gray-500">{user.email}</p>
          <p className="text-sm text-gray-400">
            가입일:{" "}
            {user.date_joined
              ? new Date(user.date_joined).toLocaleDateString("ko-KR")
              : ""}
          </p>
        </div>
      </div>

      {/* 자신이 쓴 글 리스트 */}
      <h3 className="text-lg font-semibold mb-4">내가 쓴 글</h3>
      {writes.length === 0 ? (
        <p className="text-gray-500">
          아직 쓴 글이 없습니다! 당신만의 시선을 어서 들려주세요!!
        </p>
      ) : (
        <ul className="space-y-4">
          {writes.map((write) => (
            <div key={write.id} className="space-y-4">
              <div
                onClick={() =>
                  router.push(`/post/${write.type_index ?? 0}/${write.work_id ?? write.id}?writeId=${write.id}`,)
                }
                className="bg-white rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                  <h3 className="font-bold text-gray-800 text-lg sm:text-xl line-clamp-2 leading-tight flex-1">
                    {write.title}
                  </h3>
                  <div className="flex items-center gap-3 sm:gap-4 text-sm text-gray-500 sm:ml-4 sm:mt-1">
                    <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                   >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                  </svg>
                  {write.views}
                  </span>
                  
                  <span className="flex items-center gap-1">
                        <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    {write.likes}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <p className="text-xs sm:text-sm text-blue-600 font-medium">
                      ← {write.work_title ?? "제목 없음"}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      by {write.work_author ?? "작가 없음"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <span>{new Date(write.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GetMyPage;
