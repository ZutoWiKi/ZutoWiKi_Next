import type { Work, Write } from "@/components/PostDetailPage";
import { categoryName } from "@/config/categories";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/config/site";
import {
  categoryPath,
  workPageTitle,
  workPath,
  writePath,
} from "@/lib/writeLink";

/**
 * 검색엔진용 구조화 데이터(JSON-LD).
 *
 * 페이지가 무엇인지(사이트·해석글·작품별 해석 모음)와 위치(윤슬 › 갈래 › 작품 › 글)를
 * 기계가 읽는 형식으로 알려준다. 구글은 이걸로 검색 결과에 사이트 이름과 경로를 보여주고,
 * 글쓴이·작성일을 화면 글자에서 추측하지 않고 그대로 읽는다.
 *
 * 주소는 전부 정본 도메인(SITE_URL) 기준 절대주소다.
 */

export type JsonLdData = Record<string, unknown>;

/** 검색 결과에 보일 사이트 이름. 제목 끝에 붙는 SITE_NAME(Yoonseul)은 다른 이름으로 함께 알린다. */
const BRAND_NAME = "윤슬";
const HOME_URL = `${SITE_URL}/`;
const LOGO_URL = `${SITE_URL}/yoonseul_logo2.png`;

const ORGANIZATION = {
  "@type": "Organization",
  name: BRAND_NAME,
  url: HOME_URL,
  logo: { "@type": "ImageObject", url: LOGO_URL },
};

/**
 * <script type="application/ld+json"> 에 넣을 문자열.
 *
 * 글 제목 같은 사용자 입력이 들어가므로 `<` 를 < 로 바꾼다. 그대로 두면 제목에
 * "</script>" 를 넣어 태그를 닫고 그 뒤에 진짜 스크립트를 심을 수 있다.
 * JSON 으로 읽을 때는 같은 글자다.
 */
export function serializeJsonLd(data: JsonLdData): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** 홈: 사이트 이름과 운영 주체. */
export function websiteJsonLd(): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${HOME_URL}#website`,
        name: BRAND_NAME,
        alternateName: SITE_NAME,
        url: HOME_URL,
        description: SITE_DESCRIPTION,
        inLanguage: "ko-KR",
        publisher: { "@id": `${HOME_URL}#organization` },
      },
      { ...ORGANIZATION, "@id": `${HOME_URL}#organization` },
    ],
  };
}

interface Crumb {
  name: string;
  path: string;
}

function breadcrumbList(crumbs: Crumb[]): JsonLdData {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  };
}

/** 윤슬 › 갈래 목록. 이름은 갈래 목록 페이지의 title 과 같다. */
function categoryCrumbs(type: string): Crumb[] {
  return [
    { name: BRAND_NAME, path: "/" },
    { name: `${categoryName(type)} 해석 목록`, path: categoryPath(type) },
  ];
}

/**
 * 해석 대상 작품의 종류. 딱 맞는 schema.org 종류가 없는 갈래(시·영화/드라마·공연·
 * 애니메이션·수필·웹툰)는 일반 창작물(CreativeWork)로 둔다.
 */
const WORK_SCHEMA_TYPES = new Map([
  ["novel", "Book"],
  ["music", "MusicComposition"],
  ["game", "VideoGame"],
]);

function aboutWork(type: string, work: Work): JsonLdData {
  return {
    "@type": WORK_SCHEMA_TYPES.get(type) ?? "CreativeWork",
    name: work.title,
  };
}

/** 갈래 목록 페이지. */
export function categoryJsonLd(type: string): JsonLdData {
  return {
    "@context": "https://schema.org",
    ...breadcrumbList(categoryCrumbs(type)),
  };
}

/** 작품 페이지: 경로와 이 작품에 달린 해석글 모음. */
export function workJsonLd(
  type: string,
  work: Work,
  writes: Write[],
): JsonLdData {
  const path = workPath(type, work.id);
  return {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbList([...categoryCrumbs(type), { name: work.title, path }]),
      {
        "@type": "CollectionPage",
        name: workPageTitle(work.title, categoryName(type)),
        url: `${SITE_URL}${path}`,
        description: (work.description ?? "").trim() || undefined,
        inLanguage: "ko-KR",
        about: aboutWork(type, work),
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: writes.length,
          itemListElement: writes.map((write, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${SITE_URL}${writePath(type, work.id, write.id)}`,
            name: write.title,
          })),
        },
      },
    ],
  };
}

/** 해석글 페이지: 경로와 글 정보. description 은 메타 설명과 같은 값을 넘긴다. */
export function writeJsonLd(
  type: string,
  work: Work,
  write: Write,
  description: string,
): JsonLdData {
  const path = writePath(type, work.id, write.id);
  const url = `${SITE_URL}${path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbList([
        ...categoryCrumbs(type),
        { name: work.title, path: workPath(type, work.id) },
        { name: write.title, path },
      ]),
      {
        "@type": "BlogPosting",
        headline: write.title,
        description,
        url,
        mainEntityOfPage: url,
        datePublished: write.created_at,
        author: { "@type": "Person", name: write.user_name },
        publisher: ORGANIZATION,
        // 표지가 없으면 사이트 대표 이미지. og:image 와 같은 규칙이다.
        image: work.coverImage || LOGO_URL,
        inLanguage: "ko-KR",
        // 글쓴이가 단 태그. 없으면 싣지 않는다.
        keywords: write.tags?.length ? write.tags : undefined,
        about: aboutWork(type, work),
      },
    ],
  };
}
