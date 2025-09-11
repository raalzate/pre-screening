import axios from 'axios';
import { AuthContextType } from '@/context/AuthContext'; // Assuming AuthContextType is exported

const createApiClient = (authContext: AuthContextType | null) => {
  const api = axios.create({
    baseURL: '/api',
  });

  api.interceptors.request.use(
    (config) => {
      if (authContext?.user?.id) {
        config.headers['X-User-ID'] = authContext.user.id;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return api;
};

export default createApiClient;
