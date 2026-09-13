/**
 * 작품 갈래 이름. 주소의 type 조각과 화면에 보이는 이름을 잇는다.
 *
 * 주의: 백엔드 TYPE_CHOICES 의 수필이 "esay" 로 오타가 나 있어서 실제 응답과
 * 주소에 그대로 쓰인다. 고치면 이미 나간 주소가 깨지므로 여기서 함께 받아준다.
 */
export const CATEGORY_NAMES: Record<string, string> = {
  novel: "소설",
  poem: "시",
  music: "음악",
  game: "게임",
  movie: "영화 / 드라마",
  performance: "공연",
  animation: "애니메이션",
  essay: "수필",
  esay: "수필",
  webtoon: "만화 / 웹툰",
};

/**
 * 주소의 type 조각이 실제 갈래인지.
 *
 * `type in CATEGORY_NAMES` 는 "toString" 같은 객체 기본 속성까지 참으로 봐서 쓰지 않는다.
 */
export function isCategory(type: string): boolean {
  return Object.prototype.hasOwnProperty.call(CATEGORY_NAMES, type);
}

export function categoryName(type: string): string {
  return CATEGORY_NAMES[type] ?? "작품";
}
