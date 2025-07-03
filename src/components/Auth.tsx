// src/components/Auth.tsx
"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

// Modal 컴포넌트 (회원가입 용도로만 사용)
const Modal = ({
  isOpen,
  onClose,
  children,
  isMounted,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  isMounted: boolean;
}) => {
  if (!isOpen || !isMounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default function AuthButtons() {
  const router = useRouter();
  const [showSignup, setShowSignup] = useState(false);
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 실제 회원가입 API 호출 로직
    console.log("회원가입 데이터:", signupForm);
    setShowSignup(false);
  };

  return (
    <>
      <div className="flex gap-3">
        {/* 로그인은 페이지로 이동 */}
        <button
          type="button"
          onClick={() => router.push("/user/login")}
          className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition-all duration-200 hover:bg-gray-200 rounded-lg"
        >
          로그인
        </button>

        {/* 회원가입 모달 */}
        <button
          type="button"
          onClick={() => setShowSignup(true)}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          회원가입
        </button>
      </div>

      <Modal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        isMounted={isMounted}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              회원가입
            </h2>
            <button
              type="button"
              onClick={() => setShowSignup(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름
              </label>
              <input
                type="text"
                value={signupForm.name}
                onChange={(e) =>
                  setSignupForm((f) => ({ ...f, name: e.target.value }))
                }
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/70 backdrop-blur-sm"
                placeholder="이름을 입력하세요"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <input
                type="email"
                value={signupForm.email}
                onChange={(e) =>
                  setSignupForm((f) => ({ ...f, email: e.target.value }))
                }
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/70 backdrop-blur-sm"
                placeholder="이메일을 입력하세요"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                value={signupForm.password}
                onChange={(e) =>
                  setSignupForm((f) => ({ ...f, password: e.target.value }))
                }
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/70 backdrop-blur-sm"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 확인
              </label>
              <input
                type="password"
                value={signupForm.confirmPassword}
                onChange={(e) =>
                  setSignupForm((f) => ({
                    ...f,
                    confirmPassword: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/70 backdrop-blur-sm"
                placeholder="비밀번호를 다시 입력하세요"
                required
              />
            </div>

            <div className="flex items-center">
              <input type="checkbox" className="mr-2 rounded" required />
              <span className="text-sm text-gray-600">
                <button type="button" className="text-blue-600 hover:text-blue-700">
                  이용약관
                </button>{" "}
                및{" "}
                <button type="button" className="text-blue-600 hover:text-blue-700">
                  개인정보처리방침
                </button>
                에 동의합니다.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              회원가입
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
}
