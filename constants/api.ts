export const API_URL = process.env.EXPO_PUBLIC_API_URL

export const API_ENDPOINTS = {
  AUTH: `${API_URL}/api/v1/auth`,
  USERS: `${API_URL}/api/v1/users`,
  CATEGORIES: `${API_URL}/api/v1/categories`,
  QUESTIONS: `${API_URL}/api/v1/questions`,
  TESTS: `${API_URL}/api/v1/tests`,
  RESULT: `${API_URL}/api/v1/results`,
  LECTURES: `${API_URL}/api/v1/lectures`,
  COMMENTS: `${API_URL}/api/v1/comments`,
  NOTIFICATIONS: `${API_URL}/api/v1/notifications`,
  RECOMMENDATIONS: `${API_URL}/api/v1/recommendations`,
  CHATGPT: `${API_URL}/api/v1/chatgpt`
};

export const OAUTH2_URL = process.env.EXPO_PUBLIC_OAUTH2_URL!

export const OAUTH2_REDIRECT_URL = process.env.EXPO_PUBLIC_OAUTH2_REDIRECT_URL!

export const TIMEOUT = 5000; // Thời gian timeout cho các yêu cầu
