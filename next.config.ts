import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content Security Policy.
 *
 * 운영 번들에는 eval / new Function 이 하나도 없어서 'unsafe-eval' 없이 간다.
 * 개발 모드는 HMR 이 eval 을 쓰므로 그때만 허용한다.
 *
 * script-src 에 'unsafe-inline' 이 남아 있는 건 Next 가 하이드레이션용
 * 인라인 스크립트를 넣기 때문이다. 이걸 없애려면 미들웨어로 요청마다
 * nonce 를 발급해야 하는데, 그러면 정적 페이지가 전부 동적으로 바뀐다.
 * 본문 XSS 는 src/lib/markdown.ts 에서 원천 차단하고 있으므로,
 * 여기서는 외부 스크립트 로드·프레이밍·폼 탈취를 막는 데 집중한다.
 *
 * img-src 가 https: 전체인 이유: 글 본문에 외부 이미지 URL 을 넣을 수 있고,
 * 작품 표지 기본값도 외부 주소다. 좁히면 기존 콘텐츠가 깨진다.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "media-src 'self' https:",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
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
