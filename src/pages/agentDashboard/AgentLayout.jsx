import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./ThemeContext";

const AgentLayout = ({ children }) => {
  const { dark } = useTheme();

  return (
    <div className={dark ? "bg-dark text-white" : "bg-light text-dark"} style={{ minHeight: "100vh" }}>
      <ThemeToggle />
      <div className="d-flex">
        {/* Sidebar */}
        <div className="p-3 bg-secondary text-white shadow" style={{ width: "220px", minHeight: "100vh" }}>
          <h4>Agent Panel</h4>
          <ul className="list-unstyled mt-4">
            <li>
              <Link to="/agent" className="text-white text-decoration-none">📋 Tickets</Link>
            </li>
            <li>
              <Link to="/profile" className="text-white text-decoration-none">👤 Profile</Link>
            </li>
            <li>
              <Link to="/login" className="text-white text-decoration-none">🚪 Logout</Link>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 p-4 position-relative">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AgentLayout;
