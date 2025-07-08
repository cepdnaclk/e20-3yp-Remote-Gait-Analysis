// src/services/doctorServices.js
import axiosInstance from './axiosInstance';

// Updated function to support pagination parameters
export const getDoctorPatients = (params = {}) => {
  // Handle both string and object parameters
  if (typeof params === 'string') {
    // If params is a query string, use it directly
    return axiosInstance.get(`/api/doctors/me/patients?${params}`);
  }
  
  // If params is an object or empty, construct query parameters
  const queryParams = new URLSearchParams({
    page: params.page?.toString() || '0',
    size: params.size?.toString() || '10',
    ...(params.search && { search: params.search })
  });
  
  return axiosInstance.get(`/api/doctors/me/patients?${queryParams.toString()}`);
};

// Alternative function with explicit parameters for better type safety
export const getDoctorPatientsWithPagination = (page = 0, size = 10, search = '') => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  
  if (search && search.trim()) {
    params.append('search', search.trim());
  }
  
  return axiosInstance.get(`/api/doctors/me/patients?${params.toString()}`);
};

// Function to find patient by ID using pagination (since no single patient endpoint exists)
export const findPatientById = async (patientId, maxPages = 20) => {
  let page = 0;
  const pageSize = 50;
  
  while (page < maxPages) {
    try {
      const response = await getDoctorPatients({ page, size: pageSize });
      
      if (!response.data.content || response.data.content.length === 0) {
        break; // No more patients
      }
      
      const patient = response.data.content.find(p => p.id === parseInt(patientId));
      if (patient) {
        return { data: patient };
      }
      
      if (response.data.last) {
        break; // Reached last page
      }
      
      page++;
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      break;
    }
  }
  
  throw new Error('Patient not found');
};

// Your actual backend endpoint - this should match your backend URL exactly
export const getPatientTestSession = (patientId) =>
  axiosInstance.get(`/api/test-sessions/doctors/me/patients/${patientId}`);

// Based on your backend controller, you also have this endpoint:
// GET /api/doctors/me/patients/{patient-id} that returns List<TestSessionDetailsResponse>
// If you want to use that endpoint instead, you can add:
export const getPatientTestSessionsAlternative = (patientId) =>
  axiosInstance.get(`/api/doctors/me/patients/${patientId}`);