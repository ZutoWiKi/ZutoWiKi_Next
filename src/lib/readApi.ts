"use client";

/**
 * 조회 API 호출 공통부.
 *
 * 브라우저 → /api_/read/<이름> → 백엔드. 서버 액션이 아니라 보통 fetch 라서
 * 여러 개를 동시에 보낼 수 있다. 이유는 src/app/api_/read/[resource]/route.ts 참고.
 */
/**
 * 같은 요청이 동시에 여러 번 나가는 걸 막는다.
 *
 * 홈 화면은 인기 작품 목록을 모바일용·데스크톱용으로 두 번 렌더한다(한쪽은
 * CSS 로 숨겨진다). 그래서 같은 주소를 두 번씩 받아오고 있었다. 진행 중인
 * 요청만 공유하고 끝나면 바로 지우므로, 결과를 오래 들고 있지는 않는다.
 */
const inflight = new Map<string, Promise<unknown>>();

export async function readApi<T>(
  resource: string,
  params?: Record<string, string | number | undefined>,
  token?: string | null,
): Promise<T> {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params ?? {})) {
    if (v !== undefined && v !== "") search.set(k, String(v));
  }
  const qs = search.toString();
  const url = `/api_/read/${resource}${qs ? `?${qs}` : ""}`;
  const key = `${url}|${token ? "auth" : "anon"}`;

  const existing = inflight.get(key);
  if (existing) return existing as Promise<T>;

  const request = (async () => {
    let res: Response;
    try {
      res = await fetch(url, {
        headers: token ? { Authorization: `Token ${token}` } : undefined,
        cache: "no-store",
      });
    } catch {
      throw new Error("서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const detail = (data as { detail?: string }).detail;
      const message = (data as { message?: string }).message;
      throw new Error(detail || message || "데이터를 불러오는데 실패했습니다.");
    }
    return data as T;
  })();

  inflight.set(key, request);
  try {
    return await request;
  } finally {
    inflight.delete(key);
  }
}
