import { useTheme } from "../agentDashboard/ThemeContext";
import ThemeToggle from "../agentDashboard/ThemeToggle"; // Reuse existing toggle
import "../../styles/customer.css";
import { Link } from "react-router-dom";

const CustomerLayout = ({ children }) => {
  const { dark } = useTheme();

  return (
    <div className={dark ? "dark-theme" : "light-theme"} style={{ minHeight: "100vh" }}>
      <div className="d-flex">
        <div className="p-3 bg-primary text-white shadow" style={{ width: "220px", minHeight: "100vh" }}>
          <h4>Customer Panel</h4>
          <ul className="list-unstyled mt-4">
            <li><Link to="/customer" className="text-white text-decoration-none">🏠 Home</Link></li>
            {/* <li><Link to="/profile" className="text-white text-decoration-none">👤 Profile</Link></li> */}
            <li><Link to="/login" className="text-white text-decoration-none">🚪 Logout</Link></li>
          </ul>
          <div className="mt-4"><ThemeToggle /></div>
        </div>

        <div className="flex-grow-1 p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;
