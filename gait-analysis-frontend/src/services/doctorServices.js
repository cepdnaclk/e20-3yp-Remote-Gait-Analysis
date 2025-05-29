// src/services/doctorServices.js
import axiosInstance from './axiosInstance';

export const getDoctorPatients = () => axiosInstance.get('/api/doctors/me/patients');
