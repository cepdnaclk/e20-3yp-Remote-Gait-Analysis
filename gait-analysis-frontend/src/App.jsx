import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Router>
    
      <Routes>
        {/*Home Page Route*/}
        <Route path="/" element={<Home/>} />
        {/* Login Page Route */}
        <Route path="/login" element={<Login />} />
        {/* Dashboard Page Route */}
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </Router>
  );
}


