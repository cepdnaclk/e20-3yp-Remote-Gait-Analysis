import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const login = async (username, password) => {
  return axios.post(`${BASE_URL}/api/auth/signin`, {
    username,
    password,
  });
};
