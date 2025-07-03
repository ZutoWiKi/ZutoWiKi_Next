"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { PostLogin } from "@/components/API/PostLogin";
import { useRouter } from "next/navigation";

// Modal 컴포넌트를 외부로 분리
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

const AuthButtons = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 로그인 폼 서버 액션 처리
  const handleLoginAction = async (formData: FormData) => {
    try {
      await PostLogin(formData);
      setShowLogin(false);
      router.push("/");
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  const handleSignupSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      console.log("회원가입 시도:", signupForm);
      setShowSignup(false);
    },
    [signupForm],
  );

  const handleLoginEmailChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoginForm((prev) => ({ ...prev, email: e.target.value }));
    },
    [],
  );

  const handleLoginPasswordChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoginForm((prev) => ({ ...prev, password: e.target.value }));
    },
    [],
  );

  const handleSignupNameChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSignupForm((prev) => ({ ...prev, name: e.target.value }));
    },
    [],
  );

  const handleSignupEmailChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSignupForm((prev) => ({ ...prev, email: e.target.value }));
    },
    [],
  );

  const handleSignupPasswordChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSignupForm((prev) => ({ ...prev, password: e.target.value }));
    },
    [],
  );

  const handleSignupConfirmPasswordChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSignupForm((prev) => ({ ...prev, confirmPassword: e.target.value }));
    },
    [],
  );

  return (
    <>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setShowLogin(true)}
          className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition-all duration-200 hover:bg-gray-200 rounded-lg"
        >
          로그인
        </button>
        <button
          type="button"
          onClick={() => setShowSignup(true)}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          회원가입
        </button>
      </div>

      {/* 로그인 모달 */}
      <Modal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        isMounted={isMounted}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              로그인
            </h2>
            <button
              type="button"
              onClick={() => setShowLogin(false)}
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

          {/* 서버 액션을 action 속성으로 연결 */}
          <form action={handleLoginAction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <input
                type="email"
                name="email"
                value={loginForm.email}
                onChange={handleLoginEmailChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200"
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
                name="password"
                value={loginForm.password}
                onChange={handleLoginPasswordChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 rounded" />
                <span className="text-gray-600">로그인 상태 유지</span>
              </label>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                비밀번호 찾기 ( 개발 ing... )
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              로그인
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600">아직 계정이 없으신가요? </span>
            <button
              type="button"
              onClick={() => {
                setShowLogin(false);
                setShowSignup(true);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              회원가입
            </button>
          </div>
        </div>
      </Modal>

      {/* 회원가입 모달 */}
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

          {/* form 태그로 수정 */}
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름
              </label>
              <input
                type="text"
                name="name"
                value={signupForm.name}
                onChange={handleSignupNameChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200"
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
                name="email"
                value={signupForm.email}
                onChange={handleSignupEmailChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200"
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
                name="password"
                value={signupForm.password}
                onChange={handleSignupPasswordChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200"
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
                name="confirmPassword"
                value={signupForm.confirmPassword}
                onChange={handleSignupConfirmPasswordChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200"
                placeholder="비밀번호를 다시 입력하세요"
                required
              />
            </div>

            <div className="flex items-center">
              <input type="checkbox" className="mr-2 rounded" required />
              <span className="text-sm text-gray-600">
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700"
                >
                  이용약관
                </button>{" "}
                및
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 ml-1"
                >
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

          <div className="mt-6 text-center">
            <span className="text-gray-600">이미 계정이 있으신가요? </span>
            <button
              type="button"
              onClick={() => {
                setShowSignup(false);
                setShowLogin(true);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              로그인
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AuthButtons;
