import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/Login";
import Home from "./pages/Home";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
//import PatientProfile from "./pages/doctor/PatientProfile";
import RealTimeDashboard from "./pages/RealTimeDashboard";
import AboutUs from "./pages/AboutUs";
import ClinicDetailsPage from "./pages/root/ClinicDetailsPage";

// SEMESTER 6
import RoleBasedRoute from "./components/RoleBasedRoute";
import RootDashboard from "./pages/root/SystemAdminDashboard";
import AddClinicAdmin from "./pages/root/AddClinicAdmin";
import Unauthorized from "./pages/Unauthorized";
import PatientDashboard from "./pages/patient/PatientDashboard";
import Feedback from "./pages/patient/Feedback";
import ClinicDashboard from "./pages/clinic/ClinicAdminDashboard";
import AddDoctor from "./pages/clinic/DoctorManagementPage";
import GaitAnalysisTest from "./pages/patient/trash/GaitAnalysisTest";
import WebSocketDashboard from "./pages/patient/WebSocketDashboard";
import AddPatient from "./pages/clinic/AddPatientPage";
import PatientTestSession from "./pages/patient/PatientTestSession";
import PatientTestResultPage from "./pages/patient/PatientTestResultPage";

import DoctorPatientsPage from "./pages/doctor/DoctorPatientsPage";
import DoctorPatientProfilePage from "./pages/doctor/DoctorPatientProfilePage";
import ContactPage from "./pages/ContactPage";
import DoctorTestSessionReview from "./pages/doctor/DoctorTestSessionReview";
import SignupPage from "./pages/SignupPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Create a Query Client instance for managing API data fetching, caching, and state updates
const queryClient = new QueryClient();

export default function App() {
  return (
    // Wrap the entire app with QueryClientProvider to enable data fetching with React Query
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/*Home Page Route*/}
          <Route path="/" element={<Home />} />
          {/* Login Page Route */}
          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<SignupPage />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Contact Page Route */}
          <Route path="/contact" element={<ContactPage />} />

          {/* Doctor Patients Page Route */}

          {/* About Us Page Route */}
          <Route path="/about" element={<AboutUs />} />
          {/* doctor Dashboard Page Route */}
          <Route
            path="/doctor/dashboard"
            element={
              <RoleBasedRoute allowedRoles={["ROLE_DOCTOR"]}>
                <DoctorDashboard />
              </RoleBasedRoute>
            }
          />
          {/* Patient Profile Page Route */}
          <Route path="/patients/:id" element={<DoctorPatientProfilePage />} />
          {/* Real-time Dashboard Page Route */}
          <Route
            path="/patients/:id/realtime"
            element={
              <RealTimeDashboard
                allowedRoles={["ROLE_DOCTOR"]}
              ></RealTimeDashboard>
            }
          />
          {/* Patient Test Session Page Route */}
          <Route
            path="/patient/test-session"
            element={
              <RoleBasedRoute allowedRoles={["ROLE_PATIENT"]}>
                <PatientTestSession />
              </RoleBasedRoute>
            }
          />
          {/*Test session result page */}
          <Route
            path="/patient/test-session/:id"
            element={
              <RoleBasedRoute allowedRoles={["ROLE_PATIENT", "ROLE_DOCTOR"]}>
                <PatientTestResultPage />
              </RoleBasedRoute>
            }
          />

          {/* Gait Analysis Test Page Route */}

          {/* WebSocket Dashboard Page Route */}

          {/* Root (Superadmin) Pages */}
          <Route
            path="/root/dashboard"
            element={
              <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}>
                <RootDashboard />
              </RoleBasedRoute>
            }
          />

          <Route
            path="/root/clinics/:clinicId"
            element={
              <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}>
                <ClinicDetailsPage />
              </RoleBasedRoute>
            }
          />

          {/* Clinic Admin Pages */}
          <Route
            path="/clinic/dashboard"
            element={
              <RoleBasedRoute allowedRoles={["ROLE_CLINIC"]}>
                <ClinicDashboard />
              </RoleBasedRoute>
            }
          />

          {/* Add Doctor Page Route */}
          <Route
            path="/clinic/add-doctor"
            element={
              <RoleBasedRoute allowedRoles={["ROLE_CLINIC"]}>
                <AddDoctor />
              </RoleBasedRoute>
            }
          />

          {/* Add Patient Page Route */}
          <Route
            path="/clinic/add-patient"
            element={
              <RoleBasedRoute allowedRoles={["ROLE_CLINIC"]}>
                <AddPatient />
              </RoleBasedRoute>
            }
          />

          {/* Gait Analysis Test Page Route */}

          {/* Patient Dashboard Page Route */}
          <Route
            path="/patient/dashboard"
            element={
              <RoleBasedRoute allowedRoles={["ROLE_PATIENT"]}>
                <PatientDashboard />
              </RoleBasedRoute>
            }
          />

          {/* Patient test Page Route */}
          <Route
            path="/patient/test-session"
            element={
              <RoleBasedRoute allowedRoles={["ROLE_PATIENT"]}>
                <PatientTestSession />
              </RoleBasedRoute>
            }
          />

          {/* Test Result Page Route *
          <Route path="/patient/test/:id" element={
            <RoleBasedRoute allowedRoles={["ROLE_PATIENT"]}>
              <TestResult />
            </RoleBasedRoute>
          } /> /}

          {/* Feedback Page Route */}
          <Route
            path="/patient/feedback"
            element={
              <RoleBasedRoute allowedRoles={["ROLE_PATIENT"]}>
                <Feedback />
              </RoleBasedRoute>
            }
          />

          {/* Clinic Admin Pages */}
          <Route
            path="/root/add-clinic"
            element={
              <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}>
                <AddClinicAdmin />
              </RoleBasedRoute>
            }
          />

          <Route
            path="/doctor/test-session-review/:id"
            element={
              <RoleBasedRoute allowedRoles={["ROLE_DOCTOR"]}>
                <DoctorTestSessionReview />
              </RoleBasedRoute>
            }
          />

          {/* Unauthorized Access */}
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
