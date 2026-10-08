import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { SPOILER_LABEL } from "@/lib/spoiler";

/** 스포일러 주의 글에 붙는 작은 표시. 홈 카드·글 머리·작품 소개 카드가 같이 쓴다. */
export default function SpoilerBadge({
  className = "",
}: {
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-amber-200 bg-amber-50 text-amber-700 text-xs font-medium whitespace-nowrap ${className}`}
    >
      <ExclamationTriangleIcon className="w-3.5 h-3.5" aria-hidden="true" />
      {SPOILER_LABEL}
    </span>
  );
}
