import { NextResponse } from "next/server";
import type { AllWrite } from "@/components/API/GetAllWrites";
import { categoryName } from "@/config/categories";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/config/site";
import { markdownToPlainText, truncateText } from "@/lib/plainText";
import { fetchWriteIndex, WRITE_EXCERPT_LENGTH } from "@/lib/serverApi";
import { writePath, writeTitle } from "@/lib/writeLink";

/** 피드에 싣는 최근 글 수. 수집기는 최신 글만 보므로 전부 실을 필요가 없다. */
const FEED_ITEM_LIMIT = 50;

const FEED_TITLE = `윤슬 | ${SITE_NAME}`;

/**
 * XML 1.0 에 넣을 수 없는 문자: 탭·줄바꿈을 뺀 제어문자, 짝 없는 서로게이트, U+FFFE/U+FFFF.
 * 사용자가 쓴 글에 이런 문자가 하나라도 섞이면 피드 전체가 파싱되지 않는다.
 */
const INVALID_XML_CHARS = new RegExp(
  "[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\uFFFE\\uFFFF]" +
    "|[\\uD800-\\uDBFF](?![\\uDC00-\\uDFFF])" +
    "|(?<![\\uD800-\\uDBFF])[\\uDC00-\\uDFFF]",
  "g",
);

/**
 * 글자를 XML 에 안전하게 넣는다.
 *
 * 예전에는 CDATA 로 감싸기만 해서, 제목이나 본문에 "]]>" 가 들어가면 거기서 CDATA 가
 * 닫히고 피드 전체가 깨졌다. CDATA 대신 전부 이스케이프한다.
 */
function xml(value: string): string {
  return value
    .replace(INVALID_XML_CHARS, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * 본문 앞부분(excerpt)을 피드 요약문으로 만든다.
 *
 * excerpt 는 마크다운 원문을 앞 200자에서 자른 것이라 "# 제목", "**", 이미지 문법이
 * 그대로 들어 있다. 평문으로 바꾸고, 뒤가 더 있는 글에만 …를 붙인다.
 */
function summary(write: AllWrite): string {
  const source = write.excerpt ?? write.content ?? "";
  // 백엔드는 본문을 앞 200자에서 자른다. 200자를 꽉 채웠으면 뒤가 더 있는 글이다.
  const cut = Array.from(source).length >= WRITE_EXCERPT_LENGTH;
  const plain = truncateText(
    markdownToPlainText(source, { cutOff: cut }),
    WRITE_EXCERPT_LENGTH,
  );
  if (!plain) {
    return write.work_title
      ? `${write.work_title}에 대한 해석입니다.`
      : "윤슬에 올라온 해석입니다.";
  }
  return cut && !plain.endsWith("…") ? `${plain}…` : plain;
}

function itemXml(write: AllWrite): string {
  const url = `${SITE_URL}${writePath(write.type_index, write.work_id, write.id)}`;
  const lines = [
    `<title>${xml(writeTitle(write.title, write.work_title))}</title>`,
    `<link>${xml(url)}</link>`,
    `<guid isPermaLink="true">${xml(url)}</guid>`,
    `<pubDate>${new Date(write.created_at).toUTCString()}</pubDate>`,
    write.user_name ? `<dc:creator>${xml(write.user_name)}</dc:creator>` : "",
    `<category>${xml(categoryName(write.type_index))}</category>`,
    write.work_title ? `<category>${xml(write.work_title)}</category>` : "",
    `<description>${xml(summary(write))}</description>`,
  ].filter(Boolean);

  return [
    "    <item>",
    ...lines.map((line) => `      ${line}`),
    "    </item>",
  ].join("\n");
}

export async function GET() {
  const writes = await fetchWriteIndex();

  // 못 받았으면 빈 피드 대신 503 을 준다. 빈 피드를 주면 수집기가 글이 모두 사라진 것으로 볼 수 있다.
  if (writes === null) {
    return new NextResponse(
      "피드를 만들지 못했습니다. 잠시 후 다시 시도해 주세요.",
      {
        status: 503,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Retry-After": "600",
        },
      },
    );
  }

  const latest = [...writes]
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
    .slice(0, FEED_ITEM_LIMIT);

  // 마지막 갱신 시각은 가장 최근 글의 작성일이다. 요청 시각을 넣으면 매번 바뀐 피드로 보인다.
  const lastBuildDate = latest[0]
    ? new Date(latest[0].created_at).toUTCString()
    : null;

  const channel = [
    `<title>${xml(FEED_TITLE)}</title>`,
    `<link>${SITE_URL}</link>`,
    `<description>${xml(SITE_DESCRIPTION)}</description>`,
    `<language>ko</language>`,
    `<atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />`,
    lastBuildDate ? `<lastBuildDate>${lastBuildDate}</lastBuildDate>` : "",
  ].filter(Boolean);

  const rss = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">`,
    "  <channel>",
    ...channel.map((line) => `    ${line}`),
    ...latest.map(itemXml),
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new NextResponse(rss, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
