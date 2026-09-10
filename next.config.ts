import type { NextConfig } from "next";

// 모든 응답에 붙는 보안 헤더.
// CSP는 아직 넣지 않았다 — 인라인 스타일/스크립트 때문에 깨질 수 있어서
// Vercel 프리뷰에서 Report-Only로 먼저 확인한 뒤 추가할 것.
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  // 푸터에 표시할 프론트 버전. Vercel 이 빌드할 때 커밋 해시를 넣어준다.
  env: {
    NEXT_PUBLIC_BUILD_SHA: (
      process.env.VERCEL_GIT_COMMIT_SHA ?? "dev"
    ).slice(0, 7),
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
