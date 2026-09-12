import { NextResponse } from "next/server";
import { API_URL } from "@/config/site";

const BACKEND =
  `${API_URL}/api/version/`;

// 항상 실시간으로 물어본다. 캐시되면 배포 확인용으로 쓸 수 없다.
export const dynamic = "force-dynamic";

/**
 * 백엔드 버전을 대신 물어봐 준다.
 *
 * 브라우저에서 Railway 로 직접 부르면 프리뷰 도메인(*.vercel.app)에서는
 * CORS 에 막히므로, 같은 출처인 이 경로를 거친다.
 */
export async function GET() {
  try {
    const res = await fetch(BACKEND, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ commit: "?", started_at: null });
    }
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ commit: "?", started_at: null });
  }
}
