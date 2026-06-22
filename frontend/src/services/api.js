import axios from 'axios';

// Create a central Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Our Spring Boot backend URL
});

// Request Interceptor: Automatically attach the JWT token to every outgoing request
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

export default api;
