import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  const res = await fetch("https://localhost:8000/user/mypage/", {
    headers: { Authorization: auth },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
