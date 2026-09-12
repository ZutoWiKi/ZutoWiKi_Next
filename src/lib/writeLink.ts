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
export function workPath(type: string, workId: string | number): string {
  return `/post/${type}/${workId}`;
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
