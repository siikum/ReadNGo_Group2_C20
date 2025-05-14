import axios from 'axios';

// Create an axios instance with base configuration
const api = axios.create({
    baseURL: 'https://localhost:7149', // Update with your API base URL
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor for adding authorization header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle error
        if (error.response && error.response.status === 401) {
            // Redirect to login or handle token expiration
            localStorage.removeItem('token');
            // history.push('/login'); // If using react-router
        }
        return Promise.reject(error);
    }
);

export default api;