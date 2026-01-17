import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface RefreshTokenResponse {
  accessToken?: string;
  access?: string;
  [key: string]: any;
}

class ApiClient {
  private client: ReturnType<typeof axios.create>;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: any) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        // Don't set Content-Type for FormData - let browser handle it with boundary
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        }
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: any) => response,
      async (error: any) => {
        const originalRequest = error.config;

        // Handle token expiration
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await axios.post<RefreshTokenResponse>(
              `${API_BASE_URL}/auth/refresh`,
              { refreshToken }
            );

            // Backend returns: { status: 'success', data: { accessToken: '...' } }
            const responseData = response.data as any;
            const accessToken = responseData.data?.accessToken || responseData.accessToken || responseData.access;
            
            if (!accessToken) {
              throw new Error('No access token in refresh response');
            }
            
            localStorage.setItem('accessToken', accessToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }
            
            // Recreate the request properly
            return this.client({
              ...originalRequest,
              headers: {
                ...originalRequest.headers,
                Authorization: `Bearer ${accessToken}`
              }
            });
          } catch (refreshError) {
            // Redirect to login if refresh fails
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // Handle other errors
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else if (error.message) {
          toast.error(error.message);
        }

        return Promise.reject(error);
      }
    );
  }

  async get(url: string, config?: any): Promise<any> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post(url: string, data?: any, config?: any): Promise<any> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put(url: string, data?: any, config?: any): Promise<any> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async patch(url: string, data?: any, config?: any): Promise<any> {
    const response = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete(url: string, config?: any): Promise<any> {
    const response = await this.client.delete(url, config);
    return response.data;
  }
}

export const api = new ApiClient();