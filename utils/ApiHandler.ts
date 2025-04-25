import { API_ENDPOINTS } from "@/constants/api";
import axiosClient, { ApiResponseStructure } from "./AxiosClient";
import Logger from "./Logger";
import { ApiResponse, PaginatedResponse } from "@/types/global.type";

type HttpMethod = 'get' | 'post' | 'put' | 'delete';

interface ApiOptions {
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

class ApiHandler {
  /**
   * Execute an API request with logging
   * @param url The complete endpoint URL
   * @param data Request payload data
   * @param method HTTP method (get, post, put, delete)
   * @param options Additional request options
   */
  public async Execute<T = any>(
    url: string,
    data?: any,
    method: HttpMethod = 'get',
    options?: ApiOptions
  ): Promise<ApiResponse<T>> {
    Logger.info(`Base endpoint: ${url}`);
    Logger.info(`Executing ${method.toUpperCase()} request to ${url}`, { data });
    
    try {
      const response = await axiosClient(url, {
        method,
        data,
        params: options?.params,
        headers: options?.headers
      }) as ApiResponseStructure<T | PaginatedResponse<T>>;
      
      Logger.debug(`${method.toUpperCase()} ${url} completed successfully`);
      
      // Check if the response is paginated
      const isPaginated = response.data && 
                         typeof response.data === 'object' && 
                         response.data !== null &&
                         'meta' in response.data && 
                         'result' in response.data;
      
      if (isPaginated) {
        const paginatedData = response.data as PaginatedResponse<T>;
        
        return {
          data: paginatedData.result as any,
          success: response.statusCode >= 200 && response.statusCode < 300,
          message: response.message,
          statusCode: response.statusCode,
          meta: paginatedData.meta
        };
      }
      
      // Regular response
      return {
        data: response.data as T,
        success: response.statusCode >= 200 && response.statusCode < 300,
        message: response.message,
        statusCode: response.statusCode
      };
    } catch (error) {
      let errorMessage: string;
      let errorData: any;
      
      if (error instanceof Error) {
        try {
          // Try to parse the error message as JSON
          errorData = JSON.parse(error.message);
          errorMessage = errorData.message || error.message;
        } catch {
          errorMessage = error.message;
          errorData = { message: error.message };
        }
      } else {
        errorMessage = 'Lỗi không xác định';
        errorData = { message: errorMessage };
      }
      
      Logger.error(`${method.toUpperCase()} ${url} failed: ${errorMessage}`, errorData);
      
      return {
        data: null as any,
        success: false,
        message: errorMessage,
        statusCode: errorData.statusCode || 500
      };
    }
  }
  
  /**
   * Convenience method for GET requests
   */
  public async Get<T = any>(url: string, params?: Record<string, any>, options?: ApiOptions): Promise<ApiResponse<T>> {
    return this.Execute<T>(url, undefined, 'get', { ...options, params });
  }
  
  /**
   * Convenience method for POST requests
   */
  public async Post<T = any>(url: string, data?: any, options?: ApiOptions): Promise<ApiResponse<T>> {
    return this.Execute<T>(url, data, 'post', options);
  }
  
  /**
   * Convenience method for PUT requests
   */
  public async Put<T = any>(url: string, data?: any, options?: ApiOptions): Promise<ApiResponse<T>> {
    return this.Execute<T>(url, data, 'put', options);
  }
  
  /**
   * Convenience method for DELETE requests
   */
  public async Delete<T = any>(url: string, options?: ApiOptions): Promise<ApiResponse<T>> {
    return this.Execute<T>(url, undefined, 'delete', options);
  }
}

export default new ApiHandler();