import axios, { InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080"
    });

axiosInstance.interceptors.request.use(
    (config:InternalAxiosRequestConfig) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }

)

export const setupResponseInterceptors = (navigate: (path: string) => void) => {
    axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response?.status === 401) {
                navigate("/login");
            }
            return Promise.reject(error);
        }
    )
}

export default axiosInstance;