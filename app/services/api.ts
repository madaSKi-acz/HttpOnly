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
  (config: InternalAxiosRequestConfig) => {
    // You can log the method, URL, and data/params
    console.log(config, "cc req");
    
    // This is also where you would typically inject an Auth token
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// --- RESPONSE INTERCEPTOR ---
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(
      `%c [Response] ${response.status} <- ${response.config.url}`, 
      'color: #28a745; font-weight: bold;', 
      response.data
    );
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;
      // ... your existing switch logic
      switch (status) {
        case 401: console.warn('Unauthorized'); break;
        case 419: console.warn('CSRF mismatch'); break;
        // ... rest of cases
      }
    }
    return Promise.reject(error);
  }
);

export default api;