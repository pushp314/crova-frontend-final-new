import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL + '/api/v1';

const api = axios.create({
    baseURL,
    withCredentials: true, // For cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 (Unauthorized)
        if (error.response && error.response.status === 401) {
            // Clear invalid token
            localStorage.removeItem('token');
            // Notify AuthContext to update state
            window.dispatchEvent(new Event('auth:unauthorized'));
        }
        return Promise.reject(error);
    }
);

export default api;
