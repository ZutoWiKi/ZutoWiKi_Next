"use client";

/**
 * 로그인 세션(토큰) 관리.
 *
 * 토큰은 서버에서 언제든 폐기될 수 있는데(보안 사고 대응, 관리자 정리 등),
 * 지금까지는 프론트가 localStorage 에 값이 "있는지"만 보고 로그인 상태를
 * 판단해서, 죽은 토큰을 들고 로그인된 척하다가 조용히 실패했다.
 * 여기서 실제 유효성까지 확인한다.
 */

const TOKEN_KEY = "token";

export const SESSION_EXPIRED_MESSAGE =
  "로그인이 만료되었습니다. 다시 로그인해 주세요.";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // 시크릿 모드 등에서 접근이 막혀도 무시
  }
}

/**
 * 토큰이 서버에서 아직 살아있는지 확인한다.
 *
 * 401/403 일 때만 무효로 판단하고 토큰을 지운다.
 * 서버 오류나 네트워크 장애로 로그아웃시키면 안 되므로 그 외에는 전부 유효로 본다.
 */
export async function verifySession(token: string): Promise<boolean> {
  try {
    const res = await fetch("/api_/mypage/", {
      headers: { Authorization: `Token ${token}` },
      cache: "no-store",
    });

    if (res.status === 401 || res.status === 403) {
      clearToken();
      return false;
    }

    return true;
  } catch {
    return true;
  }
}

/** 인증이 풀려서 실패한 요청인지 판별한다. */
export function isAuthError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return /로그인|인증|invalid token|authentication credentials|not authenticated/i.test(
    error.message,
  );
}
