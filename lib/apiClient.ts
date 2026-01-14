import axios from 'axios';

const createApiClient = () => {
  const api = axios.create({
    baseURL: '/api',
  });

  return api;
};

export default createApiClient;
