const env = process.env

export const API_URL = env.API_URL

// const API_KEY = env.API_KEY

export const API_ENDPOINTS = {
    AUTH: `${API_URL}/api/v1/auth`,
    USERS: `${API_URL}/api/v1/users`,
};

// export const API_KEYS = {
//   API_KEY: 'your_api_key_here',
// };

export const TIMEOUT = 5000; // Thời gian timeout cho các yêu cầu
