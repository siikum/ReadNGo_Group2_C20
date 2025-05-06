import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:7149/api", // base path
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;