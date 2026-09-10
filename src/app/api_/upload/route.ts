import { NextResponse } from "next/server";

const BACKEND =
  "https://hospitable-illumination-production-e611.up.railway.app/api/post/upload/";

export const dynamic = "force-dynamic";

/**
 * 이미지 업로드를 백엔드로 넘겨준다.
 *
 * 예전에는 프론트가 상대경로 /api/post/upload/ 를 그대로 불렀는데
 * Next 앱에 그런 라우트가 없어서 308 -> 404 로 끝났다(업로드가 아예
 * 동작하지 않았다). 같은 출처인 이 경로를 거치면 CORS 도 걸리지 않는다.
 */
export async function POST(request: Request) {
  const auth = request.headers.get("authorization") ?? "";

  try {
    const form = await request.formData();

    // Content-Type 은 fetch 가 multipart 경계값과 함께 직접 붙인다.
    const res = await fetch(BACKEND, {
      method: "POST",
      headers: { Authorization: auth },
      body: form,
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { detail: "이미지 업로드에 실패했습니다." },
      { status: 502 },
    );
  }
}
