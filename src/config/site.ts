// 사이트 전역 주소 상수.
// SITE_URL: 실제 서비스 도메인. yoonseul.app 은 www 로 307 리다이렉트되므로 www 가 정본이다.
// API_URL: Railway 에 배포된 Django 백엔드.
// 제목 끝에 붙는 이름. layout 의 title.template 과 화면 전환 시 쓰는 값이
// 같아야 해서 여기 한 곳에 둔다.
export const SITE_NAME = "Yoonseul";
/** 사이트 소개문. 메타 설명·OG·RSS 채널 설명이 같이 쓴다. */
export const SITE_DESCRIPTION =
  "같은 파도에도 윤슬은 저마다 다르게 반짝입니다. 같은 작품에 대한 당신만의 시선을 나누고, 문학의 경계를 지워보세요.";
export const SITE_URL = "https://www.yoonseul.app";
export const API_URL =
  "https://hospitable-illumination-production-e611.up.railway.app";
