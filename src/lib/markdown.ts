import { marked } from "marked";
import type { Tokens } from "marked";

/**
 * 사용자가 쓴 마크다운을 HTML 로 바꾼다. 본문 렌더와 에디터 미리보기가
 * 모두 이 함수를 쓴다.
 *
 * marked 는 마크다운 안에 섞인 원시 HTML 을 그대로 통과시킨다. 그걸
 * dangerouslySetInnerHTML 로 넣으면 아무나 글에 <script> 나
 * <img src=x onerror=...> 를 심어서, 그 글을 여는 모든 사람의 브라우저에서
 * 코드를 실행시킬 수 있다(저장형 XSS). 인증 토큰이 localStorage 에 있으니
 * 그대로 계정 탈취로 이어지고, 관리자가 글을 열면 관리자까지 털린다.
 *
 * marked v5 부터 sanitize 옵션이 없어졌으므로 renderer 단에서 직접 막는다.
 *   1) 원시 HTML 은 실행하지 않고 글자 그대로 보여준다.
 *   2) 링크·이미지 주소는 안전한 스킴만 허용한다 (javascript:, data: 차단).
 */

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch] ?? ch);
}

/**
 * 주소에서 제어문자를 걷어낸다.
 *
 * 브라우저는 URL 안의 탭·개행을 무시하고 읽기 때문에, 그대로 두면
 * "java(탭)script:alert(1)" 같은 식으로 스킴 검사를 피해갈 수 있다.
 */
function stripControlChars(value: string): string {
  return Array.from(value)
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code > 31 && code !== 127;
    })
    .join("");
}

/**
 * http(s) · mailto · tel 과 상대주소만 통과시킨다. 그 밖의 스킴은 null.
 *
 * `&` 도 escapeHtml 이 함께 이스케이프하므로 `&#106;avascript:` 같은
 * 엔티티 우회는 브라우저가 스킴으로 읽지 못한다.
 */
function safeUrl(href: string | null | undefined): string | null {
  if (!href) return null;

  const url = stripControlChars(href).trim();
  if (!url) return null;

  // 앵커 · 절대경로 · 상대경로는 그대로 허용
  if (/^[#/.?]/.test(url)) return url;

  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(url);
  if (!scheme) return url; // 스킴이 없으면 상대주소
  return /^(https?|mailto|tel)$/i.test(scheme[1]) ? url : null;
}

const renderer = new marked.Renderer();

renderer.list = (token: Tokens.List) => {
  const childrenHtml = token.items
    .map((li) => `<li>${marked.parseInline(li.text)}</li>`)
    .join("");
  return token.ordered
    ? `<ol class="list-decimal list-inside pl-5">${childrenHtml}</ol>`
    : `<ul class="list-disc list-inside pl-5">${childrenHtml}</ul>`;
};

// 원시 HTML 은 실행하지 않고 쓴 그대로 보여준다.
renderer.html = ({ text }) => escapeHtml(text);

// 링크 본문은 marked 기본 구현대로 this.parser 로 렌더한다.
// marked.parseInline(text) 로 다시 파싱하면 재귀에 빠질 수 있다.
renderer.link = function ({ href, title, tokens }) {
  const body = this.parser.parseInline(tokens);
  const url = safeUrl(href);
  // 위험한 주소면 링크를 벗기고 글자만 남긴다.
  if (!url) return body;
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
  return `<a href="${escapeHtml(url)}"${titleAttr} target="_blank" rel="noopener noreferrer nofollow">${body}</a>`;
};

renderer.image = ({ href, title, text }) => {
  const url = safeUrl(href);
  if (!url) return escapeHtml(text);
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
  return `<img src="${escapeHtml(url)}" alt="${escapeHtml(text)}"${titleAttr} loading="lazy">`;
};

marked.setOptions({ renderer, gfm: true, breaks: true });

/** 사용자 마크다운을 안전한 HTML 로 변환한다. */
export function renderMarkdown(source: string | null | undefined): string {
  return marked.parse(source ?? "") as string;
}
