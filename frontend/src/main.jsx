import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./pages/agentDashboard/ThemeContext";
import "./index.css";
import './styles/agent.css';


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
<ThemeProvider><App /></ThemeProvider>  </React.StrictMode>
);
