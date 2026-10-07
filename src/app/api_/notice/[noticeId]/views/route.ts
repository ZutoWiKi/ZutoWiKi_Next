import { NextResponse } from "next/server";
import { API_URL } from "@/config/site";

/**
 * 공지 조회수 올리기 프록시.
 *
 * 해석글 조회수는 서버 액션(components/API/UpdateWriteViews)으로 부르지만, Next 는
 * 서버 액션을 한 번에 하나씩 처리한다. 조회수는 화면을 그리는 것과 상관없는 곁다리
 * 요청이라 그 줄에 세울 이유가 없어서 라우트 핸들러로 둔다
 * (읽기 프록시 api_/read 와 같은 이유).
 *
 * 백엔드 주소를 브라우저에 노출하지 않는 효과도 같다. 부풀리기·DB 쓰기 증폭은
 * 백엔드가 공지 하나당 시간당 횟수로 막는다(ZutoPages/throttles.py).
 */
export const dynamic = "force-dynamic";

export async function PUT(
  _request: Request,
  { params }: { params: Promise<{ noticeId: string }> },
) {
  const { noticeId } = await params;

  // 숫자가 아니면 백엔드까지 갈 것도 없다.
  if (!/^\d+$/.test(noticeId)) {
    return NextResponse.json(
      { detail: "알 수 없는 공지 번호입니다." },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(`${API_URL}/api/post/notice/${noticeId}/views/`, {
      method: "PUT",
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { detail: "서버에 연결할 수 없습니다." },
      { status: 502 },
    );
  }
}
