import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL, // fix env variable usage
    timeout: 10000,
});

// Request interceptor to add JWT token
axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Token sent:', localStorage.getItem('token'));

    }
    return config;
});

// Response interceptor to catch 401 errors
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401 || error.response?.status === 403) {

            localStorage.removeItem('token');

            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
