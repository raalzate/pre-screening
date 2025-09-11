import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // In a real application, you would get the user from your authentication state.
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      config.headers['X-User-Id'] = user.id;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
