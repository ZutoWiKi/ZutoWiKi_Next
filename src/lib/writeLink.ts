/**
 * 해석글 주소를 만드는 단 하나의 자리.
 *
 * 예전에는 작품 페이지에 ?writeId=57 을 붙여 글을 골랐다. 그래서 한 작품에
 * 달린 글이 전부 같은 주소로 취급됐고, 제목·설명·미리보기가 전부 같았다.
 * 이제 글마다 고유 주소를 가진다.
 *
 *   예전: /post/animation/3?writeId=57
 *   지금: /post/animation/3/57
 *
 * 예전 주소는 작품 페이지에서 새 주소로 영구 이동시킨다.
 */
/**
 * 수필 갈래는 주소 조각이 둘이다.
 *
 * 백엔드가 작품·글에 붙여 주는 이름은 "esay"(모델 TYPE_CHOICES 의 오타)인데, 작품 목록
 * 필터(/api/post/work/?type=)는 "essay" 만 알아듣는다. 그래서 /post/esay 목록은 늘 비어 있고
 * 실제 수필 목록은 /post/essay 에 있다. 작품·글 주소는 이미 "esay" 로 퍼져 있으므로
 * 작품·글은 "esay", 갈래 목록은 "essay" 를 정본으로 둔다. 어느 이름으로 넘겨도 같은 주소가 나온다.
 *
 * (Map 을 쓰는 이유: 일반 객체는 "constructor" 같은 기본 속성까지 값으로 돌려준다.)
 */
const WORK_TYPE_ALIAS = new Map([["essay", "esay"]]);
const CATEGORY_TYPE_ALIAS = new Map([["esay", "essay"]]);

/** 갈래 목록 주소. */
export function categoryPath(type: string): string {
  return `/post/${CATEGORY_TYPE_ALIAS.get(type) ?? type}`;
}

export function workPath(type: string, workId: string | number): string {
  return `/post/${WORK_TYPE_ALIAS.get(type) ?? type}/${workId}`;
}

export function writePath(
  type: string,
  workId: string | number,
  writeId: string | number,
): string {
  return `${workPath(type, workId)}/${writeId}`;
}

/**
 * 해석글 페이지의 제목.
 *
 * 서버의 generateMetadata 와 목록에서 글을 바꿀 때가 같은 형식을 써야 해서
 * 여기 모아 둔다. 사이트 이름(| Yoonseul)은 layout 의 title.template 이 붙인다.
 */
export function writeTitle(
  title: string,
  workTitle?: string | null,
): string {
  return workTitle ? `${title} - ${workTitle} 해석` : title;
}
