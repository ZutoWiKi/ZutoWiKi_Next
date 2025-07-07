"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { PostLogin } from "@/components/API/PostLogin";
import { PostRegister } from "@/components/API/PostRegister";
import { useRouter } from "next/navigation";
import { ErrorAlert, SuccessAlert } from "@/components/ErrorAlert";

// Modal 컴포넌트
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
  const [isMounted, setIsMounted] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("token");
    setIsLogin(!!token);
  }, []);

  // 에러 메시지 파싱 함수
  const parseErrorMessage = (error: any): string => {
    if (error.message) {
      return error.message;
    }

    if (typeof error === "string") {
      return error;
    }

    return "알 수 없는 오류가 발생했습니다.";
  };

  // 로그인 폼 서버 액션 처리
  const handleLoginAction = async (formData: FormData) => {
    setIsLoading(true);
    setLoginError("");

    try {
      const result = await PostLogin(formData);
      if (result?.token) {
        localStorage.setItem("token", result.token);
        setShowLogin(false);
        setIsLogin(true);
        router.push("/");
      }
    } catch (error: any) {
      console.error("로그인 실패:", error);
      setLoginError(parseErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setSignupError("");
    setSignupSuccess("");

    // 비밀번호 확인 검증
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setSignupError("비밀번호가 일치하지 않습니다.");
      setIsLoading(false);
      return;
    }

    try {
      await PostRegister(formData);
      setSignupSuccess("회원가입이 성공적으로 완료되었습니다!");

      // 2초 후 로그인 모달로 전환
      setTimeout(() => {
        setShowSignup(false);
        setShowLogin(true);
        setSignupSuccess("");
      }, 2000);
    } catch (error: any) {
      console.error("회원가입 실패:", error);
      setSignupError(parseErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogin(false);
    router.push("/");
  };

  // 모달 닫기 시 에러 메시지 초기화
  const handleCloseLogin = () => {
    setShowLogin(false);
    setLoginError("");
  };

  const handleCloseSignup = () => {
    setShowSignup(false);
    setSignupError("");
    setSignupSuccess("");
  };

  return (
    <>
      {isMounted &&
        (isLogin ? (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/user/mypage/")}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              마이페이지
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition-all duration-200 hover:bg-gray-200 rounded-lg"
            >
              로그아웃
            </button>
          </div>
        ) : (
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
        ))}

      {/* 로그인 모달 */}
      <Modal
        isOpen={showLogin}
        onClose={handleCloseLogin}
        isMounted={isMounted}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              로그인
            </h2>
            <button
              type="button"
              onClick={handleCloseLogin}
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

          {/* 로그인 에러 메시지 */}
          {loginError && (
            <ErrorAlert
              message={loginError}
              onClose={() => setLoginError("")}
            />
          )}

          {/* 로그인 폼 */}
          <form action={handleLoginAction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-colors duration-200"
                placeholder="이메일을 입력하세요"
                autoComplete="email"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-colors duration-200"
                placeholder="비밀번호를 입력하세요"
                autoComplete="current-password"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 rounded"
                  disabled={isLoading}
                />
                <span className="text-gray-600">로그인 상태 유지</span>
              </label>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium"
                disabled={isLoading}
              >
                비밀번호 찾기
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "로그인 중..." : "로그인"}
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
              disabled={isLoading}
            >
              회원가입
            </button>
          </div>
        </div>
      </Modal>

      {/* 회원가입 모달 */}
      <Modal
        isOpen={showSignup}
        onClose={handleCloseSignup}
        isMounted={isMounted}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              회원가입
            </h2>
            <button
              type="button"
              onClick={handleCloseSignup}
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

          {/* 회원가입 에러 메시지 */}
          {signupError && (
            <ErrorAlert
              message={signupError}
              onClose={() => setSignupError("")}
            />
          )}

          {/* 회원가입 성공 메시지 */}
          {signupSuccess && (
            <SuccessAlert
              message={signupSuccess}
              onClose={() => setSignupSuccess("")}
            />
          )}

          {/* 회원가입 폼 */}
          <form action={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름
              </label>
              <input
                type="text"
                name="username"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-colors duration-200"
                placeholder="이름을 입력하세요"
                autoComplete="name"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-colors duration-200"
                placeholder="이메일을 입력하세요"
                autoComplete="email"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-colors duration-200"
                placeholder="비밀번호를 입력하세요"
                autoComplete="new-password"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 확인
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-colors duration-200"
                placeholder="비밀번호를 다시 입력하세요"
                autoComplete="new-password"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 rounded"
                required
                disabled={isLoading}
              />
              <span className="text-sm text-gray-600">
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700"
                  disabled={isLoading}
                >
                  이용약관
                </button>{" "}
                및
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 ml-1"
                  disabled={isLoading}
                >
                  개인정보처리방침
                </button>
                에 동의합니다.
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "가입 중..." : "회원가입"}
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
              disabled={isLoading}
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
