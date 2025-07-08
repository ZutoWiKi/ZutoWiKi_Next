import { useState } from "react";

// 애니메이션 좋아요 버튼 컴포넌트
const AnimatedLikeButton = ({
  isLiked,
  likeCount,
  onClick,
  disabled,
}: {
  isLiked: boolean;
  likeCount: number;
  onClick: () => void;
  disabled: boolean;
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHearts, setShowHearts] = useState(false);

  const handleClick = () => {
    if (disabled) return;

    setIsAnimating(true);
    setShowHearts(true);
    onClick();

    // 애니메이션 리셋
    setTimeout(() => setIsAnimating(false), 600);
    setTimeout(() => setShowHearts(false), 1000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 overflow-hidden ${
        isLiked
          ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg shadow-pink-500/25"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      } ${isAnimating ? "scale-110" : "scale-100"} ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:shadow-lg transform hover:-translate-y-1"
      }`}
    >
      {/* 하트 아이콘 */}
      <div className="relative">
        <svg
          className={`w-5 h-5 transition-all duration-300 ${
            isLiked ? "fill-current" : "stroke-current fill-none"
          } ${isAnimating ? "animate-ping" : ""}`}
          viewBox="0 0 24 24"
          strokeWidth={isLiked ? 0 : 2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>

        {/* 추가 하트 애니메이션 */}
        {isAnimating && (
          <svg
            className="absolute top-0 left-0 w-5 h-5 fill-current text-pink-400 animate-ping"
            viewBox="0 0 24 24"
          >
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        )}
      </div>

      {/* 좋아요 텍스트 */}
      <span className="select-none">{isLiked ? "좋아요" : "좋아요"}</span>

      {/* 추가 CSS 애니메이션을 위한 스타일 */}
      <style jsx>{`
        @keyframes float-heart {
          0% {
            transform: translateY(0) scale(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-20px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-40px) scale(0);
            opacity: 0;
          }
        }
        .animate-float-heart {
          animation: float-heart 1s ease-out forwards;
        }
      `}</style>
    </button>
  );
};

export { AnimatedLikeButton };
