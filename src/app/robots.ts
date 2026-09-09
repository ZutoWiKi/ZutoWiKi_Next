// app/robots.ts
import { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 로그인이 필요하거나 색인 가치가 없는 경로
      disallow: ["/user/", "/api_/", "/post/*/*/write", "/post/*/*/edit/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
