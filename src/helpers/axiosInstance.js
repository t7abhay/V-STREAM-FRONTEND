import axios from "axios";
import { BASE_URL } from "../constants.js";

const getCsrfToken = () => {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
};


const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});


axiosInstance.interceptors.request.use(
    (config) => {
        const csrfToken = getCsrfToken();
        if (csrfToken) {
            config.headers["X-XSRF-TOKEN"] = csrfToken;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
