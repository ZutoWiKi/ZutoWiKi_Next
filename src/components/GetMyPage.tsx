"use client";
import React, { useEffect, useState } from "react";
import UserProfileColor from "@/components/UserProfileColor";

interface User {
  id: number;
  username: string;
  email: string;
  date_joined: string;
}

const GetMyPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/mypage/", {
      credentials: "include",
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="bg-white shadow-md rounded-2xl p-6 flex items-center space-x-4">
        유저 정보를 불러오는 중..
      </div>
    );
  if (!user)
    return (
      <div className="bg-white shadow-md rounded-2xl p-6 flex items-center space-x-4">
        유저 정보를 불러올 수 없습니다.
      </div>
    );

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 flex items-center space-x-4">
      {user && (
        <UserProfileColor
          id={user.id}
          alt="avatar"
          width={120}
          height={60}
          className="w-16 h-16 rounded-full object-cover"
        />
      )}
      <div>
        <h2 className="text-xl font-semibold">{user?.username}</h2>
        <p className="text-gray-500">{user?.email}</p>
        <p className="text-sm text-gray-400">
          가입일:{" "}
          {user?.date_joined
            ? new Date(user.date_joined).toLocaleDateString("ko-KR")
            : ""}
        </p>
      </div>
    </div>
  );
};

export default GetMyPage;
