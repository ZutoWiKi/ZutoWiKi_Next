import { NextResponse } from "next/server";
import { API_URL } from "@/config/site";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  const res = await fetch(
    `${API_URL}/api/user/mypage/`,
    {
      headers: { Authorization: auth },
    },
  );
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
