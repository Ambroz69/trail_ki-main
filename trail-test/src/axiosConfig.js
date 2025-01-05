import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: `${backendUrl}`,
});

// Response interceptor for 401 - not logged in
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      cookies.remove('SESSION_TOKEN');
      window.location.href = '/users/login';
    }
    return Promise.reject(error);
  }
);

export default api;