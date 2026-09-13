import { serializeJsonLd } from "@/lib/jsonLd";
import type { JsonLdData } from "@/lib/jsonLd";

/**
 * 구조화 데이터(JSON-LD)를 첫 HTML 에 싣는다.
 *
 * 서버 컴포넌트(page.tsx)에서만 쓴다. 브라우저에서 나중에 붙이면 JS 를 실행하지 않는
 * 검색엔진이 읽지 못한다.
 */
export default function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
