/**
 * 날짜를 "2026. 9. 13." 형식으로 쓴다.
 *
 * toLocaleDateString() 을 인자 없이 쓰면 실행하는 곳의 언어·시간대를 따른다.
 * 서버(Vercel)는 영어·UTC, 브라우저는 보통 한국어·KST 라서, 서버가 그린 글자와
 * 브라우저가 다시 그린 글자가 달라지고 React 가 hydration 오류를 낸다.
 * 언어와 시간대를 고정해 어디서 그려도 같게 한다.
 */
export function formatDate(value: string | number | Date): string {
  return new Date(value).toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul",
  });
}
