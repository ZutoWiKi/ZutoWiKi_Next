export class ViewLimitManager {
  private static STORAGE_KEY = "write_views_24h";
  private static CACHE_DURATION = 3600000; //1시간 //86400000; // 24시간

  // 로컬에서 먼저 확인 (불필요한 서버 요청 방지)
  static canView(writeId: number): boolean {
    try {
      const viewData = localStorage.getItem(this.STORAGE_KEY);
      if (!viewData) return true;

      const parsed = JSON.parse(viewData);
      const now = Date.now();

      return !parsed[writeId] || now - parsed[writeId] >= this.CACHE_DURATION;
    } catch {
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

    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    }
    return `${minutes}분`;
  }
}
