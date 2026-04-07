import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/configs/env.config';
import type { ApiError } from '@/types';
import type { ApiResponse } from '@/types';
import type { RefreshResponseData } from '@/types/auth.types';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 30_000,
  headers: {
    Accept: 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// ─── Request Interceptor ───────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// ─── Token Refresh Logic ───────────────────────────────────────────────────
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else if (token) resolve(token);
  });
  pendingQueue = [];
}

// ─── Response Interceptor ──────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    // Build ApiError for non-401 cases
    if (status !== 401) {
      const apiError: ApiError = {
        message:
          (error.response?.data as { message?: string })?.message ??
          error.message ??
          'An unexpected error occurred',
        statusCode: status ?? 500,
        errors: (error.response?.data as { errors?: Record<string, string[]> })?.errors,
      };
      return Promise.reject(apiError);
    }

    // 401 on the refresh endpoint itself → force logout
    if (originalRequest.url?.includes('/auth/refresh')) {
      const { useAuthStore } = await import('@/store/auth.store');
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Already retried → give up
    if (originalRequest._retry) {
      const { useAuthStore } = await import('@/store/auth.store');
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Queue concurrent requests while refreshing
    if (isRefreshing) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        pendingQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          },
          reject,
        });
      });
    }

    // Start refresh
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await axiosInstance.post<ApiResponse<RefreshResponseData>>(
        '/auth/refresh',
        null,
        { withCredentials: true }
      );
      const newToken = res.data.data.access_token;

      const { useAuthStore } = await import('@/store/auth.store');
      useAuthStore.getState().setAccessToken(newToken);

      axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;
      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      processQueue(null, newToken);
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      const { useAuthStore } = await import('@/store/auth.store');
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
