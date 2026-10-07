/**
 * 같은 브라우저에서 같은 것을 짧은 시간 안에 여러 번 세지 않게 막는다.
 *
 * 기록은 localStorage 에만 남으므로 기기·브라우저마다 따로다. 서버도 대상 하나당
 * 시간당 횟수를 따로 막는다(백엔드 ZutoPages/throttles.py).
 *
 * 글과 공지는 **저장 열쇠를 따로 쓴다.** 번호가 겹치기 때문이다 — 한 칸에 같이 넣으면
 * 3번 글을 본 사람이 3번 공지를 본 것으로 처리된다.
 */
export class ViewLimiter {
  private static CACHE_DURATION = 3600000; // 1시간 (필요시 조정)

  /**
   * @param storageKey localStorage 열쇠
   * @param label 콘솔에 찍을 이름("글"·"공지")
   */
  constructor(
    private storageKey: string,
    private label: string,
  ) {}

  // 로컬에서 먼저 확인 (불필요한 서버 요청 방지)
  canView(id: number): boolean {
    try {
      const viewData = localStorage.getItem(this.storageKey);
      if (!viewData) return true;

      const parsed = JSON.parse(viewData);
      const now = Date.now();

      // 해당 대상에 대한 기록이 없거나, 캐시 시간이 지났으면 조회 가능
      const lastViewTime = parsed[id];
      if (!lastViewTime) return true;

      const timeDiff = now - lastViewTime;
      console.log(
        `${this.label} ${id} 마지막 조회: ${timeDiff}ms 전, 제한: ${ViewLimiter.CACHE_DURATION}ms`,
      );

      return timeDiff >= ViewLimiter.CACHE_DURATION;
    } catch (error) {
      console.error("ViewLimiter.canView 에러:", error);
      return true;
    }
  }

  // 조회 성공 시 로컬에 기록
  recordView(id: number): void {
    try {
      const viewData = localStorage.getItem(this.storageKey);
      const parsed = viewData ? JSON.parse(viewData) : {};
      const now = Date.now();

      // 만료된 데이터 정리
      Object.keys(parsed).forEach((key) => {
        if (now - parsed[key] >= ViewLimiter.CACHE_DURATION) {
          delete parsed[key];
        }
      });

      parsed[id] = now;
      localStorage.setItem(this.storageKey, JSON.stringify(parsed));
      console.log(
        `${this.label} ${id} 조회 기록됨:`,
        new Date(now).toLocaleString(),
      );
    } catch (error) {
      console.error("조회 기록 저장 실패:", error);
    }
  }

  // 남은 시간 계산
  getTimeUntilNextView(id: number): number {
    try {
      const viewData = localStorage.getItem(this.storageKey);
      if (!viewData) return 0;

      const parsed = JSON.parse(viewData);
      if (!parsed[id]) return 0;

      const timeLeft = ViewLimiter.CACHE_DURATION - (Date.now() - parsed[id]);
      return Math.max(0, timeLeft);
    } catch {
      return 0;
    }
  }

  // 시간을 읽기 쉬운 형태로 변환
  formatTimeLeft(ms: number): string {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    } else if (minutes > 0) {
      return `${minutes}분 ${seconds}초`;
    } else {
      return `${seconds}초`;
    }
  }
}

/** 해석글 조회 제한. 이름과 쓰는 법은 예전 그대로다(PostDetailPage 가 쓴다). */
export const ViewLimitManager = new ViewLimiter("write_views_24h", "글");

/** 공지 조회 제한. */
export const NoticeViewLimitManager = new ViewLimiter(
  "notice_views_24h",
  "공지",
);
