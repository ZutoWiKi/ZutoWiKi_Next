/**
 * 해석글 태그 규칙. 백엔드 ZutoPages/tags.py 와 같아야 한다.
 *
 * - 앞의 # 을 떼고 앞뒤 공백을 지운다. 한글은 NFC 로 합친다.
 * - 영문은 소문자로 바꾼다.
 * - 한글(완성형·자모)·영문·숫자·밑줄만 쓸 수 있다. 띄어쓰기는 태그를 나누는 기호다.
 * - 태그 하나는 20자, 글 하나에 10개까지. 같은 태그는 하나로 친다.
 *
 * 화면에서 먼저 알려 주는 용도이고, 최종 판단은 서버가 한다.
 */

export const TAG_MAX_COUNT = 10;
export const TAG_MAX_LENGTH = 20;

const TAG_PATTERN = /^[0-9A-Za-z_가-힣ㄱ-ㅎㅏ-ㅣ]+$/;

/** 태그 하나를 저장할 모양으로 바꾼다. 쓸 수 있는 글자인지는 tagError 로 따로 본다. */
export function normalizeTag(raw: string): string {
  return raw.normalize("NFC").trim().replace(/^#+/, "").trim().toLowerCase();
}

/** 저장할 수 없는 태그면 이유를, 괜찮으면 null 을 돌려준다. */
export function tagError(name: string): string | null {
  if (Array.from(name).length > TAG_MAX_LENGTH) {
    return `태그는 ${TAG_MAX_LENGTH}자까지 쓸 수 있어요.`;
  }
  if (!TAG_PATTERN.test(name)) {
    return "태그에는 한글·영문·숫자·밑줄(_)만 쓸 수 있어요.";
  }
  return null;
}

/** 입력한 글자를 태그 조각으로 나눈다. 공백·쉼표·# 가 경계다. "#소설 #반전" → ["소설", "반전"] */
export function splitTags(text: string): string[] {
  return text.split(/[\s,#]+/).map(normalizeTag).filter(Boolean);
}
