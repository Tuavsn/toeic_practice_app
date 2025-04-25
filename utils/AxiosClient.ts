import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import queryString from "query-string";
import { API_URL } from "@/constants/api";
import Logger from "./Logger";

// Standard API response structure based on the example
export interface ApiResponseStructure<T = any> {
  statusCode: number;
  message: string;
  data: T;
  error: string | null;
}

// Define error response type to fix TypeScript errors
interface ErrorResponse {
  message?: string;
  statusCode?: number;
}

const axiosClient = axios.create({
    baseURL: API_URL,
    paramsSerializer: params => queryString.stringify(params)
});

// Request interceptor
axiosClient.interceptors.request.use(async (config: any) => {
    const startTime = Date.now();
    
    // Add request timestamp to config for calculating duration later
    (config as any).metadata = { startTime };
    
    // Log the request
    Logger.logRequest(
        `${config.url}`, 
        config.method?.toUpperCase() || 'GET',
        config.headers as Record<string, string>,
        config.data
    );

    // const token = await AsyncStorage.getItem('token');
    
    config.headers = {
        Authorization: '', // Set token here when available
        Accept: 'application/json',
        ...config.headers
    };

    return config;
}, (error: AxiosError) => {
    Logger.error('Request error interceptor', error);
    return Promise.reject(error);
});

// Response interceptor
axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // Calculate request duration
        const duration = Date.now() - ((response.config as any).metadata?.startTime || Date.now());
        
        // Log successful response
        Logger.logResponse(
            `${response.config.url}`,
            response.status,
            response.data,
            duration
        );
        
        // Return the entire response data to handle in ApiHandler
        return response.data;
    }, 
    (error: AxiosError) => {
        // Calculate request duration
        const duration = Date.now() - ((error.config as any)?.metadata?.startTime || Date.now());
        
        // Log error response
        if (error.response) {
            Logger.logResponse(
                `${error.config?.baseURL}${error.config?.url}`,
                error.response.status,
                error.response.data,
                duration
            );
            
            // Fix for TypeScript error by properly typing the error response data
            const errorData = error.response.data as ErrorResponse;
            
            const messageError = {
                message: errorData?.message || 'Lỗi không xác định',
                statusCode: errorData?.statusCode || error.response.status
            };
            
            Logger.error(`API Error: ${JSON.stringify(messageError)}`);
            throw new Error(JSON.stringify(messageError));
        } else {
            // Network error or request cancelled
            Logger.error(`API Connection Error: ${error.message}`, error);
            throw new Error(JSON.stringify({
                message: 'Lỗi kết nối đến máy chủ',
                statusCode: 500
            }));
        }
    }
);

export default axiosClient;