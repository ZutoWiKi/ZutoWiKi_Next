/**
 * 스포일러 주의 글.
 *
 * 글쓴이가 글을 쓸 때 "스포일러 주의" 를 켜면 글 화면이 본문을 흐리게 가려 둔다
 * (SpoilerGuard). 어떻게 들어왔느냐에 따라 푸는 방법이 다르다.
 *
 * - 홈의 "전체 해석글" 카드를 눌러 들어왔으면 스크롤하거나 누르면 풀린다.
 *   그 글을 골라서 온 사람이라 가볍게 막는다.
 * - 그 밖(작품 페이지 목록, 검색·공유 링크, 함께 읽을 만한 해석)은 눌러야 풀린다.
 *
 * 본문 말고도 본문이 새어 나가는 곳이 있다. 검색 결과·공유 미리보기의 설명문,
 * RSS 요약, 작품 페이지의 해석글 미리보기다. 이런 곳에는 본문 대신 안내문을 싣는다.
 */

/** 화면에 붙이는 표시 문구. 홈 카드·글 머리·작품 소개 카드가 같은 말을 쓴다. */
export const SPOILER_LABEL = "스포일러 주의";

/**
 * 검색 결과·공유 미리보기·RSS 에 본문 대신 싣는 설명문.
 * 작품 이름은 그대로 둔다 — 무슨 작품의 해석인지는 알려야 검색해서 찾아온다.
 */
export function spoilerDescription(workTitle?: string | null): string {
  const about = workTitle ? `"${workTitle}"에 대한 해석입니다.` : "해석입니다.";
  return `[${SPOILER_LABEL}] ${about} 작품의 결말이나 주요 내용이 담겨 있을 수 있어 본문 미리보기를 가렸습니다.`;
}

// ---------------------------------------------------------------------------
// 홈에서 눌러 들어왔는지
//
// 주소에 ?from=home 같은 표시를 붙이면 공유·검색 주소가 갈라진다. 대신 홈 카드를 누른
// 순간 글 번호를 적어 두고, 글 화면이 그 번호를 보고 판단한다. 같은 탭 안에서 페이지를
// 바꾸는 이동(Next 의 Link)만 해당하므로 모듈 변수로 충분하다. 새로고침하면 사라진다.
// ---------------------------------------------------------------------------

/** 카드를 누르고 글 화면이 뜨기까지 이만큼은 기다려 준다. 백엔드가 느리면 몇 초 걸린다. */
const HOME_ENTRY_TTL_MS = 60_000;

let homeEntry: { writeId: number; at: number } | null = null;

/** 홈 카드를 눌렀을 때 부른다. */
export function markHomeEntry(writeId: number): void {
  homeEntry = { writeId, at: Date.now() };
}

/** 방금 홈에서 이 글 카드를 눌러 들어왔는지. 읽기만 하고 지우지 않는다. */
export function cameFromHome(writeId: number): boolean {
  return (
    homeEntry !== null &&
    homeEntry.writeId === writeId &&
    Date.now() - homeEntry.at < HOME_ENTRY_TTL_MS
  );
}

/**
 * 홈에서 들어온 표시를 지운다. 한 번 쓰고 나면 지워야, 같은 글을 나중에 다른 길로
 * 다시 열었을 때 "홈에서 왔다" 로 잘못 보지 않는다.
 */
export function clearHomeEntry(writeId: number): void {
  if (homeEntry?.writeId === writeId) homeEntry = null;
}

// ---------------------------------------------------------------------------
// 이번 방문에 이미 펼친 글
//
// 작품 페이지에서 다른 글을 골랐다가 돌아오면 다시 가리지 않는다. 새로고침하면 사라진다.
// 서버에서도 이 모듈이 읽히지만 쓰는 쪽(펼치기)은 브라우저에서만 불리므로 서버에서는
// 늘 비어 있다.
// ---------------------------------------------------------------------------

const revealedWrites = new Set<number>();

export function rememberReveal(writeId: number): void {
  revealedWrites.add(writeId);
}

export function wasRevealed(writeId: number): boolean {
  return revealedWrites.has(writeId);
}
