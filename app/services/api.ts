import axios, { 
  AxiosInstance, 
  AxiosError, 
  InternalAxiosRequestConfig, 
  AxiosResponse 
} from 'axios';

// 1. Create the Axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor (Attach Tokens)
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Check if running on client-side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor (Handle Global Errors)
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return the response directly if successful
    return response;
  },
  (error: AxiosError) => {
    // Handle error responses
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          // Handle Unauthorized (e.g., token expired)
          console.warn('Unauthorized - Redirecting to login...');
          // Optional: Clear storage and redirect
          // if (typeof window !== 'undefined') {
          //   localStorage.removeItem('accessToken');
          //   window.location.href = '/login';
          // }
          break;
        case 403:
          console.error('Forbidden - You do not have permission.');
          break;
        case 404:
          console.error('Resource not found.');
          break;
        case 500:
          console.error('Server error - Please try again later.');
          break;
        default:
          console.error('An unexpected error occurred.');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;