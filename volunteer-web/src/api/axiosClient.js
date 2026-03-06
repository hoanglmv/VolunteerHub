// src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080', // Link Backend của bạn
    headers: {
        'Content-Type': 'application/json',
    },
});

// Tự động thêm Token vào Header trước khi gửi request
axiosClient.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;