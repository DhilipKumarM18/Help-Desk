import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/customerDashboard/CustomerDashboard";
import AgentDashboard from "./pages/agentDashboard/AgentDashboard";
import AgentProfile from "./pages/agentDashboard/AgentProfile";
import PrivateRoute from "./auth/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./pages/customerDashboard/ThemeContext"; // or centralize under /context if used app-wide
import 'bootstrap/dist/css/bootstrap.min.css';
import Admin_Register from "./pages/Admin_Register";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/ad_register" element={<Admin_Register />} />
            <Route path="/profile" element={<AgentProfile />} />
            <Route path="/customer" element={
              <PrivateRoute role="CUSTOMER">
                <CustomerDashboard />
              </PrivateRoute>
            } />
            <Route path="/agent" element={
              <PrivateRoute role="AGENT">
                <AgentDashboard />
              </PrivateRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
