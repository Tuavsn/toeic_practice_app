export const API_URL = process.env.EXPO_PUBLIC_API_URL

export const API_ENDPOINTS = {
    AUTH: `${API_URL}/api/v1/auth`,
    USERS: `${API_URL}/api/v1/users`,
    QUESTIONS: `${API_URL}/api/v1/questions`,
    TESTS: `${API_URL}/api/v1/tests`,
};

export const OAUTH2_URL = process.env.EXPO_PUBLIC_OAUTH2_URL!

export const OAUTH2_REDIRECT_URL = process.env.EXPO_PUBLIC_OAUTH2_REDIRECT_URL!

export const TIMEOUT = 5000; // Thời gian timeout cho các yêu cầu
