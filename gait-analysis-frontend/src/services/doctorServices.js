// src/services/doctorServices.js
import axiosInstance from './axiosInstance';

export const getDoctorPatients = () => axiosInstance.get('/api/doctors/me/patients');

export const getPatientTestSession = (patientId) =>
  axiosInstance.get(`/api/test-sessions/doctors/me/patients/${patientId}`);
