import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const login = async (username, password) => {
  return axios.post(`${BASE_URL}/api/auth/signin`, {
    username,
    password,
  });
};

export const invitationSignup = async (signupData) => {
  return axios.post(`${BASE_URL}/api/auth/signup`, signupData);
};

export const forgotPassword = async (email) => {
  return axios.post(`${BASE_URL}/api/auth/forgot-password`, {
    email,
  });
};

export const resetPassword = async (token, newPassword) => {
  return axios.post(`${BASE_URL}/api/auth/reset-password`, {
    token,
    newPassword,
  });
};
