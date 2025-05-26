import axiosInstance from './axiosInstance.js';

export const getClinics = () => axiosInstance.get('/clinics');
export const addClinic = (data) => axiosInstance.post('/clinics', data);

export const getSensorKits = () => axiosInstance.get('/sensor-kits?status=IN_STOCK');
export const getSensorKitsByClinic = (clinicId) =>
  axiosInstance.get(`/sensor-kits?clinic_id=${clinicId}`);
export const addSensorKit = (data) => axiosInstance.post('/sensor-kits', data);

export const assignSensorKits = (clinicId, sensorKitIds) =>
  axiosInstance.post('/sensor-kits/assign-to-clinic', { clinicId, sensorKitIds });
