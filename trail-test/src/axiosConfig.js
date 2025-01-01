import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const api = axios.create({
  baseURL: 'http://localhost:5555',
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