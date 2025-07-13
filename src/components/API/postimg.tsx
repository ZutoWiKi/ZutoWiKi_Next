"use server";

// 사용자 정보 가져오기
export async function GetUserInfo(token: string) {
  try {
    const response = await fetch("http://127.0.0.1:8000/api_/mypage/", {
      credentials: "include",
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("사용자 정보를 가져올 수 없습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("사용자 정보 조회 실패:", error);
    throw error;
  }
}

// 이미지 업로드
export async function UploadImage(formData: FormData) {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/post/upload/", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("이미지 업로드에 실패했습니다.");
    }

    return await res.json();
  } catch (error) {
    console.error("이미지 업로드 실패:", error);
    throw error;
  }
}
