/**
 * 공지의 자료 모양과 주소.
 *
 * 공지는 홈 이벤트 팝업(src/lib/banner.ts)과 다른 것이다. 팝업은 기간이 끝나면
 * 사라지고 그걸로 끝이지만, 공지는 홈 띠에서 내려가도 /notice 에 계속 남는다.
 * 그래서 공지마다 고유 주소가 있고, 본문은 해석글과 같은 마크다운이다.
 */

/** 공지 목록 한 줄. 본문 대신 앞부분(excerpt)만 온다. */
export interface NoticeSummary {
  id: number;
  title: string;
  /** 본문 앞 NOTICE_EXCERPT_LENGTH 자. 마크다운 원문이라 평문으로 다듬어 쓴다. */
  excerpt?: string;
  /** 조회수. 올리는 건 NoticeViewCount 가 한다. */
  views?: number;
  created_at: string;
  /** 화면에는 쓰지 않는다. 사이트맵의 lastModified 가 쓴다. */
  updated_at?: string;
  /** 지금 홈 띠에 떠 있는 공지인지. 목록에서 표시용으로만 쓴다. */
  on_home?: boolean;
}

/** 공지 한 건. 본문 전체가 들어 있다. */
export interface NoticeDetail extends NoticeSummary {
  body: string;
}

/** 백엔드가 목록에 싣는 본문 앞부분 길이. ZutoPages/serializers.py 와 같아야 한다. */
export const NOTICE_EXCERPT_LENGTH = 200;

export const NOTICE_LIST_PATH = "/notice";

export function noticePath(id: number | string): string {
  return `${NOTICE_LIST_PATH}/${id}`;
}
