"use server";

/**
 * 서버에 저장된 토큰을 지운다.
 *
 * 예전에는 로그아웃이 localStorage 를 비우는 게 전부라서 서버 토큰은
 * 그대로 살아 있었다. 그 토큰이 새어나가면 관리자가 직접 지우기 전까지
 * 영원히 유효했다.
 *
 * 실패해도 던지지 않는다 — 로그아웃은 어떤 경우에도 완료되어야 하고,
 * 최소한 이 브라우저에서는 토큰이 지워져야 하기 때문이다.
 */
export async function PostLogout(token: string): Promise<boolean> {
  try {
    const res = await fetch(
      "https://hospitable-illumination-production-e611.up.railway.app/api/user/logout/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}
