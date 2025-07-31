
export interface UpdateWriteData {
  title: string;
  content: string;
}

export const UpdateWrite = async (writeId: number, data: UpdateWriteData, token: string) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/post/write/${writeId}/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '글 수정에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('글 수정 에러:', error);
    throw error;
  }
};