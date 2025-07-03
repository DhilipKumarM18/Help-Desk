// src/pages/agentDashboard/ThemeToggle.jsx
import { useTheme } from "./ThemeContext";

const ThemeToggle = () => {
  const { dark, toggle } = useTheme();

  return (
    <button
      className="btn btn-sm btn-outline-light rounded-circle shadow"
      style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 1000 }}
      onClick={toggle}
      title="Toggle Theme"
    >
      {dark ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;
