/**
 * 검색엔진 로봇처럼 사람이 아닌 방문인지 브라우저 이름(User-Agent)으로 가린다.
 *
 * 조회수를 셀 때 쓴다. 구글 로봇은 자바스크립트를 실행해 페이지를 그려 보므로, 거르지
 * 않으면 로봇이 글을 읽을 때마다 조회수가 오른다. 흔한 로봇만 빼면 충분하고, 사람을
 * 로봇으로 잘못 보지 않는 쪽을 택했다.
 *
 * 사람이 쓰는 브라우저 이름에도 들어가는 단어는 넣지 않는다. 카카오톡 인앱 브라우저는
 * "KAKAOTALK", 다음 앱은 "DaumApps" 를 달고 오므로, 카카오 미리보기 로봇은
 * "kakaotalk-scrap", 다음 로봇은 "Daumoa" 로 정확히 적는다.
 */
const BOT_USER_AGENT =
  /bot|crawl|spider|slurp|yeti|daumoa|mediapartners|inspectiontool|lighthouse|headless|facebookexternalhit|kakaotalk-scrap/i;

export function isBotUserAgent(userAgent: string): boolean {
  return BOT_USER_AGENT.test(userAgent);
}
