interface SpoilerToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/** 글쓰기·수정 화면의 "스포일러 주의" 선택 칸. 켜면 글 화면이 본문을 가려 둔다(SpoilerGuard). */
export default function SpoilerToggle({
  checked,
  onChange,
  disabled,
}: SpoilerToggleProps) {
  return (
    <label
      className={`flex items-start gap-3 w-full px-4 py-3 border rounded-lg transition-colors ${
        checked ? "border-amber-300 bg-amber-50" : "border-gray-200 bg-white/90"
      } ${disabled ? "opacity-60" : "cursor-pointer"}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-0.5 h-4 w-4 shrink-0 accent-amber-500"
      />
      <span>
        <span className="block text-sm font-medium text-gray-800">
          스포일러 주의
        </span>
        <span className="block mt-0.5 text-xs sm:text-sm text-gray-500 leading-relaxed">
          작품의 결말이나 반전을 다룬다면 켜 주세요. 본문이 흐리게 가려져 읽는
          사람이 눌러야 보이고, 검색 결과·공유 미리보기에도 본문이 나오지
          않습니다.
        </span>
      </span>
    </label>
  );
}
