import axios from './axiosInstance';

export const getClinics = () => axios.get('/clinics');
export const addClinic = (data) => axios.post('/clinics', data);

export const getSensorKits = () => axios.get('/sensor-kits?status=IN_STOCK');
export const getSensorKitsByClinic = (clinicId) =>
  axios.get(`/sensor-kits?clinic_id=${clinicId}`);
export const addSensorKit = (data) => axios.post('/sensor-kits', data);

export const assignSensorKits = (clinicId, sensorKitIds) =>
  axios.post('/sensor-kits/assign-to-clinic', { clinicId, sensorKitIds });
