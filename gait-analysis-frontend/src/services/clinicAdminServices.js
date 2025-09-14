import axiosInstance from "./axiosInstance";

// Get all doctors for the logged in clinic with pagination
export const getDoctors = (params = {}) => {
  const searchParams = new URLSearchParams();
  
  // Add pagination parameters
  if (params.page !== undefined) {
    searchParams.append('page', params.page);
  }
  if (params.size !== undefined) {
    searchParams.append('size', params.size);
  }
  
  // Add search parameter if provided
  if (params.search) {
    searchParams.append('search', params.search);
  }
  
  // Add sorting parameters if provided
  if (params.sort) {
    searchParams.append('sort', params.sort);
  }
  if (params.direction) {
    searchParams.append('direction', params.direction);
  }
  
  const queryString = searchParams.toString();
  const url = `/api/clinics/me/doctors${queryString ? `?${queryString}` : ''}`;
  
  return axiosInstance.get(url);
};

// Add a new doctor
export const addDoctor = (doctorData) =>
  axiosInstance.post("/api/doctors", doctorData);

// Get all patients for the clinic with pagination
export const getPatients = (params = {}) => {
  const searchParams = new URLSearchParams();
  
  // Add pagination parameters
  if (params.page !== undefined) {
    searchParams.append('page', params.page);
  }
  if (params.size !== undefined) {
    searchParams.append('size', params.size);
  }
  
  // Add search parameter if provided
  if (params.search) {
    searchParams.append('search', params.search);
  }
  
  // Add sorting parameters if provided
  if (params.sort) {
    searchParams.append('sort', params.sort);
  }
  if (params.direction) {
    searchParams.append('direction', params.direction);
  }
  
  const queryString = searchParams.toString();
  const url = `/api/clinics/me/patients${queryString ? `?${queryString}` : ''}`;
  
  return axiosInstance.get(url);
};

// Add a new patient
export const addPatient = (patientData) =>
  axiosInstance.post("/api/patients", patientData);

// Get available sensor kits assigned to this clinic
export const getAvailableSensorKits = () =>
  axiosInstance.get("/api/clinics/me/sensor-kits?status=AVAILABLE");

// Helper function to get all doctors (for dropdowns, etc.) - fetches all pages
export const getAllDoctors = async () => {
  try {
    let allDoctors = [];
    let page = 0;
    let hasMore = true;
    
    while (hasMore) {
      const response = await getDoctors({ page, size: 100 });
      const { content, last } = response.data;
      
      allDoctors = [...allDoctors, ...content];
      hasMore = !last;
      page++;
    }
    
    return { data: allDoctors };
  } catch (error) {
    throw error;
  }
};

// Helper function to get all patients (for statistics, etc.) - fetches all pages
export const getAllPatients = async () => {
  try {
    let allPatients = [];
    let page = 0;
    let hasMore = true;
    
    while (hasMore) {
      const response = await getPatients({ page, size: 100 });
      const { content, last } = response.data;
      
      allPatients = [...allPatients, ...content];
      hasMore = !last;
      page++;
    }
    
    return { data: allPatients };
  } catch (error) {
    throw error;
  }
};

// Get clinic statistics (you might want to create a separate endpoint for this)
export const getClinicStats = async () => {
  try {
    const [doctorsResponse, patientsResponse, kitsResponse] = await Promise.all([
      getDoctors({ page: 0, size: 1 }), // Just get first page to get totalElements
      getPatients({ page: 0, size: 1 }), // Just get first page to get totalElements
      getAvailableSensorKits(),
    ]);
    
    return {
      data: {
        totalDoctors: doctorsResponse.data.totalElements,
        totalPatients: patientsResponse.data.totalElements,
        totalSensorKits: kitsResponse.data.length,
      }
    };
  } catch (error) {
    throw error;
  }
};

// // Assign a patient to a doctor
// export const assignPatientToDoctor = (patientId, doctorId) =>
//   axiosInstance.post('/clinic/assign-patient', { patientId, doctorId });

// // Assign a sensor kit to a patient
// export const assignSensorKitToPatient = (patientId, sensorKitId) =>
//   axiosInstance.post('/clinic/assign-sensor-kit', { patientId, sensorKitId });