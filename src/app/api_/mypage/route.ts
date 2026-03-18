import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  const res = await fetch(
    "https://hospitable-illumination-production-e611.up.railway.app/api/user/mypage/",
    {
      headers: { Authorization: auth },
    },
  );
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
