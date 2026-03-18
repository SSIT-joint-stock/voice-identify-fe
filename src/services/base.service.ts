import axiosInstance from '@/api/axios.instance';
import type { AxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@/types';

/**
 * Base service with generic CRUD methods.
 * Extend this class for each domain service.
 */
export class BaseService {
  protected readonly basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.get<ApiResponse<T>>(url, config);
    return response.data.data;
  }

  protected async post<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await axiosInstance.post<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  protected async put<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await axiosInstance.put<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  protected async patch<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await axiosInstance.patch<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.delete<ApiResponse<T>>(url, config);
    return response.data.data;
  }
}
