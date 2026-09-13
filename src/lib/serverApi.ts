import type { AllWork } from "@/components/API/GetAllWorks";
import type { AllWrite, WritePage } from "@/components/API/GetAllWrites";
import type { Work as PopularWork } from "@/components/API/GetPopularWorksList";
import type { Write } from "@/components/PostDetailPage";
import type { Work as ListWork } from "@/components/WorkListPage";
import { API_URL } from "@/config/site";

/**
 * 서버 컴포넌트에서 첫 화면 데이터를 미리 받아오는 함수들.
 *
 * 예전에는 목록·본문을 전부 브라우저에서 받아왔다. 그래서 서버가 보내는 첫
 * HTML 에는 "Loading..." 만 있었고, JS 를 실행하지 않는 검색엔진(특히 네이버)은
 * 빈 페이지로 봤다. 여기서 받은 값을 컴포넌트 초기값으로 넘기면 첫 HTML 에
 * 내용과 링크가 들어간다.
 *
 * - 로그인한 사람만 아는 값(좋아요 여부 등)은 싣지 않는다. 그건 브라우저에서
 *   토큰과 함께 다시 받는다.
 * - 실패하면 null 을 돌려준다. 그러면 컴포넌트가 예전처럼 브라우저에서 받아오므로
 *   백엔드가 잠깐 죽어도 화면이 깨지지 않는다.
 *
 * 브라우저 코드("use client")에서 import 하지 말 것.
 */

/** "fresh" 는 요청마다 새로 받는다. 숫자는 그 초만큼 캐시한다. */
type Freshness = "fresh" | number;

async function getJson<T>(
  path: string,
  freshness: Freshness,
): Promise<T | null> {
  try {
    const res = await fetch(
      `${API_URL}${path}`,
      freshness === "fresh"
        ? { cache: "no-store" }
        : { next: { revalidate: freshness } },
    );
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/**
 * 작품 한 편에 달린 해석글 전부(본문 포함).
 *
 * 조회수·좋아요가 화면에 그대로 보이고, 방금 쓴 글도 바로 열려야 해서 캐시하지 않는다.
 */
export function fetchWorkWrites(workId: string): Promise<Write[] | null> {
  return getJson<Write[]>(
    `/api/post/write/?work_id=${encodeURIComponent(workId)}`,
    "fresh",
  );
}

/**
 * 갈래 하나의 작품 목록. 작품을 추가하면 바로 보여야 해서 캐시하지 않는다.
 *
 * 주소 끝의 / 를 빼면 백엔드가 301 로 한 번 더 돌린다.
 */
export async function fetchWorksByType(
  type: string,
): Promise<ListWork[] | null> {
  const data = await getJson<ListWork[] | { works?: ListWork[] }>(
    `/api/post/work/?type=${encodeURIComponent(type)}`,
    "fresh",
  );
  if (data === null) return null;
  return Array.isArray(data) ? data : (data.works ?? []);
}

/**
 * 홈 화면용. 홈은 정적 페이지로 두고 이 주기로 새로 만든다.
 * 브라우저에서도 한 번 더 받아 최신으로 맞추므로 잠깐 늦는 건 괜찮다.
 */
const HOME_REVALIDATE_SECONDS = 60;

export function fetchAllWorks(): Promise<AllWork[] | null> {
  return getJson<AllWork[]>("/api/post/work/all/", HOME_REVALIDATE_SECONDS);
}

/** 최신순 해석글 첫 페이지. 브라우저의 GetWritesPage 와 같은 모양으로 돌려준다. */
export async function fetchLatestWrites(
  pageSize: number,
): Promise<WritePage | null> {
  const data = await getJson<WritePage | AllWrite[]>(
    `/api/post/write/all/?page=1&page_size=${pageSize}&sort=recent&summary=1`,
    HOME_REVALIDATE_SECONDS,
  );
  if (data === null) return null;

  // 페이지네이션을 모르는 예전 백엔드는 배열을 그대로 준다(GetWritesPage 와 같은 처리).
  if (Array.isArray(data)) {
    return {
      count: data.length,
      page: 1,
      page_size: data.length || pageSize,
      num_pages: 1,
      results: data,
    };
  }
  return data;
}

/** 인기 작품. writes: 해석글 많은 순, likes: 좋아요 많은 순. */
export async function fetchPopularWorks(
  kind: "writes" | "likes",
): Promise<PopularWork[] | null> {
  const path =
    kind === "likes" ? "/api/post/popular/likes/" : "/api/post/popular/";
  const data = await getJson<{ works?: PopularWork[] }>(
    path,
    HOME_REVALIDATE_SECONDS,
  );
  return data === null ? null : (data.works ?? []);
}
