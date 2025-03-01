import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import PatientProfile from "./pages/PatientProfile";
import RealTimeDashboard from "./pages/RealTimeDashboard";
import Signup from "./pages/Signup";

// Create a Query Client instance for managing API data fetching, caching, and state updates
const queryClient = new QueryClient();

export default function App() {
  return (

    // Wrap the entire app with QueryClientProvider to enable data fetching with React Query
    <QueryClientProvider client={queryClient}>

      <Router>
    
        <Routes>
          {/*Home Page Route*/}
          <Route path="/" element={<Home/>} />
          {/* Login Page Route */}
          <Route path="/login" element={<Login />} />
          {/* SignUp Page Route */}
          <Route path="/Signup" element={<Signup />} />
          {/* Dashboard Page Route */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Patient Profile Page Route */}
          <Route path="/patients/:id" element={<PatientProfile />} />
          {/* Real-time Dashboard Page Route */}
          <Route path="/patients/:id/realtime" element={<RealTimeDashboard />} />

        </Routes>
      </Router>
    </QueryClientProvider>
  );
}


