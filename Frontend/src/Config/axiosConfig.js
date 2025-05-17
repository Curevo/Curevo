import axios from "axios";
import { useNavigate } from 'react-router-dom';
import.meta.env.VITE_BACKEND_URL;

const axiosInstance = axios.create({
    baseURL: 'VITE_BACKEND_URL',
    timeout: 10000,
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {

            // Token is invalid or expired, remove it and redirect to login
            localStorage.removeItem('jwt');

            // Redirect to login page
            const navigate = useNavigate();
            navigate('/login'); // Redirect user to login page
        }
        return Promise.reject(error);
    }
);
export default axiosInstance;