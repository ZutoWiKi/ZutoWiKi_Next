/**
 * 글에 달린 태그를 #태그 모양으로 보여준다.
 *
 * 지금은 보여주기만 한다. 전체 검색을 만들면 여기서 태그를 눌러 검색하도록 링크로 바꾼다.
 */
export default function TagList({
  tags,
  className = "",
}: {
  tags?: string[];
  className?: string;
}) {
  if (!tags?.length) return null;
  return (
    <ul aria-label="태그" className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map((tag) => (
        <li
          key={tag}
          className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs sm:text-sm"
        >
          #{tag}
        </li>
      ))}
    </ul>
  );
}
