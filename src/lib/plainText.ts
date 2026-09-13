/**
 * 마크다운 본문을 검색 설명·피드 요약에 쓸 평문으로 바꾼다.
 *
 * 코드 블록·HTML 태그·이미지는 지우고, 링크는 글자만 남기고, 제목·강조·인용 기호를 지운다.
 *
 * cutOff: 원문이 중간에서 잘린 조각일 때(예: 백엔드 excerpt). 끝에 걸린 반쪽짜리
 * 코드 블록·링크·이미지·태그("![그림](https://…")를 먼저 걷어낸다. 그대로 두면
 * 닫는 짝이 없어서 아래 정리에 걸리지 않고 주소 조각이 글자로 남는다.
 */
export function markdownToPlainText(
  markdown: string | null | undefined,
  { cutOff = false }: { cutOff?: boolean } = {},
): string {
  let text = markdown ?? "";

  if (cutOff) {
    const fences = text.split("```").length - 1;
    if (fences % 2 === 1) text = text.slice(0, text.lastIndexOf("```"));
    text = text.replace(/!?\[[^\]\n]*(\]\([^)\n]*)?$|<[^>\n]*$/, "");
  }

  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** 글자 수로 자르고, 잘랐으면 …를 붙인다. 이모지를 반으로 가르지 않도록 코드 포인트로 센다. */
export function truncateText(text: string, max: number): string {
  const chars = Array.from(text);
  return chars.length > max ? `${chars.slice(0, max).join("")}…` : text;
}
