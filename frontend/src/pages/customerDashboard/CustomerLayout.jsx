import { useTheme } from "../agentDashboard/ThemeContext";
import ThemeToggle from "../agentDashboard/ThemeToggle";
import "../../styles/customer.css";
import { useState, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

const CustomerLayout = ({ children }) => {
  const { dark } = useTheme();
  const { logout, userDetails } = useContext(AuthContext);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className={dark ? "dark-theme" : "light-theme"} style={{ minHeight: "100vh" }}>
      <div className="d-flex">
        <div className="p-3 bg-primary text-white shadow" style={{ width: "220px", minHeight: "100vh" }}>
          <h4>Customer Panel</h4>
          <ul className="list-unstyled mt-4">
            <li><span role="button" onClick={() => setShowProfile(true)} className="text-white text-decoration-none d-block mb-2">👤 Profile</span></li>
            <li><a href="/customer" className="text-white text-decoration-none">🏠 Home</a></li>
            <li>
              <span role="button" onClick={() => {
                logout();
                window.location.href = "/login";
              }} className="text-white text-decoration-none d-block">
                🚪 Logout
              </span>
            </li>
          </ul>
          <div className="mt-4"><ThemeToggle /></div>
        </div>

        <div className="flex-grow-1 p-4">
          {children}
        </div>
      </div>

      <Modal show={showProfile} onHide={() => setShowProfile(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Customer Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Name:</strong> {userDetails?.name || "Loading..."}</p>
          <p><strong>Email:</strong> {userDetails?.email || "Loading..."}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfile(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomerLayout;
