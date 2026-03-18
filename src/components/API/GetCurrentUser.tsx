export interface CurrentUser {
  id: number;
  username: string;
  email: string;
  date_joined: string;
}

export const GetCurrentUser = async (token: string): Promise<CurrentUser | null> => {
  try {
    const response = await fetch("/api_/mypage/", {
      credentials: "include",
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('사용자 정보를 가져올 수 없습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('현재 사용자 정보 조회 에러:', error);
    return null;
  }
};