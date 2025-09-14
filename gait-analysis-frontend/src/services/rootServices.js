import axiosInstance from './axiosInstance.js';

export const getClinics = (queryParams = '') => axiosInstance.get(`/api/clinics${queryParams}`);
export const addClinic = (data) => axiosInstance.post('/api/clinics', data);

export const getSensorKits = () => axiosInstance.get('/api/sensor-kits');
export const getInStockSensorKits = () => axiosInstance.get('/api/sensor-kits?status=IN_STOCK');

export const getSensorKitsByClinic = (clinicId) =>
  axiosInstance.get(`/api/sensor-kits?clinic_id=${clinicId}`);
export const addSensorKit = (data) => axiosInstance.post('/api/sensor-kits', data);

export const assignSensorKits = (clinicId, sensorKitIds) =>
  axiosInstance.post('/api/sensor-kits/assign-to-clinic', { clinicId, sensorKitIds });