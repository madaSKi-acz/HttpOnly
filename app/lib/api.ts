import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig, // Import this for the request config type
  AxiosError,
  AxiosResponse,
} from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// --- REQUEST INTERCEPTOR ---
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
   
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// --- RESPONSE INTERCEPTOR ---
api.interceptors.response.use(
  (response: AxiosResponse) => {

    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 401: console.warn('Unauthorized'); break;
        case 419: console.warn('CSRF mismatch'); break;
      }
    }
    return Promise.reject(error);
  }
);

export default api;