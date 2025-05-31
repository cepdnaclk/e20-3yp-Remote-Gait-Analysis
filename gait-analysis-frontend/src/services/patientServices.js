import axios from './axiosInstance';

// GET /api/patients/me — Get logged-in patient profile
export const getPatientProfile = () => {
  return axios.get("/api/patients/me");
};

// GET /api/doctors/me/patients — Get patients assigned to the logged-in doctor
export const getDoctorsPatients = () => {
  return axios.get("/api/doctors/me/patients");
};

// GET /api/clinics/me/patients — Get patients belonging to the logged-in clinic
export const getClinicsPatients = () => {
  return axios.get("/api/clinics/me/patients");
};

// POST /api/patients — Register a new patient (Clinic Only)
export const registerPatient = (patientData) => {
  return axios.post("/api/patients", patientData);
};

// GET /api/patients/{id} — Get patient by ID
export const getPatientById = (id) => {
  return axios.get(`/api/patients/${id}`);
};

// PUT /api/patients/{id} — Update patient details
export const updatePatient = (id, updateData) => {
  return axios.put(`/api/patients/${id}`, updateData);
};

// DELETE /api/patients/{id} — Delete patient from clinic
export const deletePatient = (id) => {
  return axios.delete(`/api/patients/${id}`);
};

// GET /api/patients/test-sessions/me — Get all test sessions for a patient
export const getMyTestSessions = () => {
  return axios.get("/api/test-sessions/me");
};
