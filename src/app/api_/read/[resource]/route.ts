import { NextResponse } from "next/server";
import { API_URL } from "@/config/site";

/**
 * 조회 전용 프록시.
 *
 * 목록·인기글 같은 읽기는 예전에 서버 액션("use server")으로 불렀다. 그런데
 * Next 는 서버 액션을 한 번에 하나씩만 처리한다 — 원래 데이터 변경용이라
 * 순서를 보장하려고 그렇게 설계돼 있다. 그래서 홈 화면의 요청 7개가 줄을 서서
 * 4초 넘게 걸렸다(Promise.all 로 묶어도 소용없다).
 *
 * 라우트 핸들러는 보통 요청이라 브라우저가 동시에 여러 개를 보낼 수 있다.
 * 같은 출처라 CORS 도 걸리지 않고, 백엔드 주소도 브라우저에 노출되지 않는다.
 *
 * 경로는 아래 표에 적힌 것만 통과시킨다. 받은 경로를 그대로 백엔드에 넘기면
 * 우리 도메인이 열린 프록시가 된다.
 */
const ROUTES: Record<string, string> = {
  writes: "/api/post/write/all/",
  works: "/api/post/work/all/",
  popular: "/api/post/popular/",
  "popular-views": "/api/post/popular/views/",
  "popular-likes": "/api/post/popular/likes/",
};

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  const { resource } = await params;
  const path = ROUTES[resource];

  if (!path) {
    return NextResponse.json(
      { detail: "알 수 없는 조회 경로입니다." },
      { status: 404 },
    );
  }

  // 질의 변수는 그대로 넘긴다(page, page_size, sort, summary, mine …).
  const search = new URL(request.url).search;
  const auth = request.headers.get("authorization");

  try {
    const res = await fetch(`${API_URL}${path}${search}`, {
      headers: auth ? { Authorization: auth } : {},
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { detail: "서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요." },
      { status: 502 },
    );
  }
}
