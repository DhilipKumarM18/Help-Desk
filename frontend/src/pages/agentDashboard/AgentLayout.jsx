import { useTheme } from "./ThemeContext";
import ThemeToggle from "./ThemeToggle";
import { useState, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const AgentLayout = ({ children }) => {
  const { dark } = useTheme();
  const { logout, userDetails } = useContext(AuthContext);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className={dark ? "dark-theme" : "light-theme"} style={{ minHeight: "100vh" }}>
      <div className="d-flex">
        <div className="p-3 bg-secondary text-white shadow" style={{ width: "220px", minHeight: "100vh" }}>
          <h4>Agent Panel</h4>
          <ul className="list-unstyled mt-4">
            <li>
              <Link to="/agent" className="text-white text-decoration-none">📋 Tickets</Link>
            </li>
            <li>
              <span role="button" onClick={() => setShowProfile(true)} className="text-white text-decoration-none d-block mb-2">
                👤 Profile
              </span>
            </li>
            <li>
              <span
                role="button"
                onClick={() => {
                  logout();
                  window.location.href = "/login";
                }}
                className="text-white text-decoration-none d-block"
              >
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
          <Modal.Title>Agent Profile</Modal.Title>
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

export default AgentLayout;
