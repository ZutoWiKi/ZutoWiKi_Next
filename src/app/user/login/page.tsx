// src/app/user/login/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/user/login/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error("로그인 실패");
      const { token } = await res.json();
      localStorage.setItem("authToken", token);
      router.push("/"); // 로그인 후 리다이렉트
    } catch (err: any) {
      console.error(err);
      alert(err.message || "로그인 중 에러가 발생했습니다.");
    }
  };

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>

        <label className="block mb-2 text-sm font-medium">이메일</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm((f) => ({ ...f, email: e.target.value }))
          }
          className="w-full px-4 py-2 mb-4 border rounded"
          placeholder="이메일을 입력하세요"
          required
        />

        <label className="block mb-2 text-sm font-medium">비밀번호</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm((f) => ({ ...f, password: e.target.value }))
          }
          className="w-full px-4 py-2 mb-6 border rounded"
          placeholder="비밀번호를 입력하세요"
          required
        />

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          로그인
        </button>
      </form>
    </div>
    </>
  );
}
