"use client";

import { useEffect, useState } from "react";

// 빌드 시점에 next.config.ts 가 Vercel 커밋 해시를 여기에 박아 넣는다.
const FRONT_VERSION = process.env.NEXT_PUBLIC_BUILD_SHA || "dev";

/** 푸터에 배포된 프론트·백엔드 버전을 작게 보여준다. 배포 확인용. */
export default function VersionTag() {
  const [backVersion, setBackVersion] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api_/version/", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled) setBackVersion(data?.commit ?? "?");
      })
      .catch(() => {
        if (!cancelled) setBackVersion("?");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <p className="font-mono text-[10px] sm:text-[11px] text-gray-400 tracking-tight select-all">
      front {FRONT_VERSION} · back {backVersion ?? "…"}
    </p>
  );
}
