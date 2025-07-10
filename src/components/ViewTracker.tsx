export class ViewLimitManager {
  private static STORAGE_KEY = "write_views_24h";
  private static CACHE_DURATION = 3600000; // 1시간 (필요시 조정)

  // 로컬에서 먼저 확인 (불필요한 서버 요청 방지)
  static canView(writeId: number): boolean {
    try {
      const viewData = localStorage.getItem(this.STORAGE_KEY);
      if (!viewData) return true;

      const parsed = JSON.parse(viewData);
      const now = Date.now();

      // 해당 글에 대한 기록이 없거나, 캐시 시간이 지났으면 조회 가능
      const lastViewTime = parsed[writeId];
      if (!lastViewTime) return true;

      const timeDiff = now - lastViewTime;
      console.log(
        `글 ${writeId} 마지막 조회: ${timeDiff}ms 전, 제한: ${this.CACHE_DURATION}ms`,
      );

      return timeDiff >= this.CACHE_DURATION;
    } catch (error) {
      console.error("ViewLimitManager.canView 에러:", error);
      return true;
    }
  }

  // 조회 성공 시 로컬에 기록
  static recordView(writeId: number): void {
    try {
      const viewData = localStorage.getItem(this.STORAGE_KEY);
      const parsed = viewData ? JSON.parse(viewData) : {};
      const now = Date.now();

      // 만료된 데이터 정리
      Object.keys(parsed).forEach((id) => {
        if (now - parsed[id] >= this.CACHE_DURATION) {
          delete parsed[id];
        }
      });

      parsed[writeId] = now;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(parsed));
      console.log(`글 ${writeId} 조회 기록됨:`, new Date(now).toLocaleString());
    } catch (error) {
      console.error("조회 기록 저장 실패:", error);
    }
  }

  // 남은 시간 계산
  static getTimeUntilNextView(writeId: number): number {
    try {
      const viewData = localStorage.getItem(this.STORAGE_KEY);
      if (!viewData) return 0;

      const parsed = JSON.parse(viewData);
      if (!parsed[writeId]) return 0;

      const timeLeft = this.CACHE_DURATION - (Date.now() - parsed[writeId]);
      return Math.max(0, timeLeft);
    } catch {
      return 0;
    }
  }

  // 시간을 읽기 쉬운 형태로 변환
  static formatTimeLeft(ms: number): string {
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
