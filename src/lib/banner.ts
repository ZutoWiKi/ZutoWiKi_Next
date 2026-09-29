/**
 * 홈 이벤트 팝업의 규칙.
 *
 * 배너 자체는 관리자 화면(백엔드 EventBanner)에서 등록하고, 여기서는 "이 브라우저에서
 * 닫았는지" 만 다룬다. 닫은 기록은 localStorage 에만 남으므로 기기·브라우저마다 따로다.
 *
 * 주소 검사는 백엔드 ZutoPages/models.py 의 is_safe_banner_link 와 같은 규칙이다.
 */

export interface EventBannerData {
  id: number;
  title: string;
  body?: string;
  image_url?: string;
  image_alt?: string;
  link_url?: string;
  link_label?: string;
  link_new_tab?: boolean;
  /** 관리자가 "다시 보이기" 를 누르면 올라간다. 회차가 다르면 닫은 기록이 풀린다. */
  dismiss_version?: number;
}

/** localStorage 열쇠. 값은 { "<배너번호>:<회차>": 다시 보일 시각(ms) } */
export const BANNER_STORAGE_KEY = "event_banner_dismissed";

/** "다시 안 보기". 다시 보일 시각이 없다는 뜻으로 0 을 넣는다. */
export const FOREVER = 0;

export type DismissMap = Record<string, number>;

export function bannerKey(banner: EventBannerData): string {
  return `${banner.id}:${banner.dismiss_version ?? 1}`;
}

/** 저장된 값을 읽는다. 사람이 손댔거나 깨졌으면 기록이 없는 것으로 본다. */
export function parseDismissed(raw: string | null): DismissMap {
  if (!raw) return {};
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    const out: DismissMap = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
        out[key] = value;
      }
    }
    return out;
  } catch {
    return {};
  }
}

export function isDismissed(
  dismissed: DismissMap,
  banner: EventBannerData,
  now: number,
): boolean {
  const until = dismissed[bannerKey(banner)];
  if (until === undefined) return false;
  return until === FOREVER || until > now;
}

/** "오늘은 안 보기" 의 끝 시각 — 그 기기의 자정. 날짜가 바뀌면 다시 뜬다. */
export function nextMidnight(now: Date): number {
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime();
}

/** 하루가 지난 기록은 버린다. 끝난 배너 기록이 저장소에 쌓이지 않게 한다. */
export function pruneDismissed(dismissed: DismissMap, now: number): DismissMap {
  const out: DismissMap = {};
  for (const [key, until] of Object.entries(dismissed)) {
    if (until === FOREVER || until > now) out[key] = until;
  }
  return out;
}

/** 지금 띄울 배너 하나. 목록은 백엔드가 우선순위 순으로 준다. */
export function pickBanner(
  banners: EventBannerData[],
  dismissed: DismissMap,
  now: number,
): EventBannerData | null {
  return banners.find((banner) => !isDismissed(dismissed, banner, now)) ?? null;
}

/** 눌렀을 때 갈 주소로 써도 되는 모양인지 본다. 백엔드도 저장할 때 같은 검사를 한다. */
export function isSafeBannerLink(url?: string): url is string {
  if (!url || /\s/.test(url)) return false;
  // "//other.example" 은 프로토콜만 생략한 바깥 주소다.
  if (url.startsWith("//")) return false;
  if (url.startsWith("/")) return true;
  return url.startsWith("http://") || url.startsWith("https://");
}

/** 윤슬 안의 주소인지(= next/link 로 옮길 주소인지). */
export function isInternalLink(url: string): boolean {
  return url.startsWith("/");
}
