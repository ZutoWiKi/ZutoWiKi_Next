const API_BASE_URL = "http://127.0.0.1:8000/api";

export const apiGet = async (endpoint: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API GET Error:", error);
    throw error;
  }
};

export const apiPost = async (endpoint: any, data: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || "Request failed");
    }

    return responseData;
  } catch (error) {
    console.error("API POST Error:", error);
    throw error;
  }
};
