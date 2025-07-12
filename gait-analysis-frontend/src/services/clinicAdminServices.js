import axiosInstance from "./axiosInstance";

// Get all doctors for the logged in clinic
export const getDoctors = () => axiosInstance.get("/api/clinics/me/doctors");

// Add a new doctor
export const addDoctor = (doctorData) =>
  axiosInstance.post("/api/doctors", doctorData);

// Get all patients for the clinic
export const getPatients = () => axiosInstance.get("/api/clinics/me/patients");

// Add a new patient
export const addPatient = (patientData) =>
  axiosInstance.post("/api/patients", patientData);

// // Assign a patient to a doctor
// export const assignPatientToDoctor = (patientId, doctorId) =>
//   axiosInstance.post('/clinic/assign-patient', { patientId, doctorId });

// Get available sensor kits assigned to this clinic
export const getAvailableSensorKits = () =>
  axiosInstance.get("/api/clinics/me/sensor-kits?status=AVAILABLE");

// // Assign a sensor kit to a patient
// export const assignSensorKitToPatient = (patientId, sensorKitId) =>
//   axiosInstance.post('/clinic/assign-sensor-kit', { patientId, sensorKitId });
