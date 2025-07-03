import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [userDetails, setUserDetails] = useState(null);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setUserDetails(null);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = user?.token;
      if (token) {
        console.log(token)
        try {
          const res = await axios.get("http://localhost:8080/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(res.data)
          setUserDetails(res.data); 
        } catch (error) {
          console.error("Failed to fetch user details:", error);
        }
      }
    };

    fetchUserDetails();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, userDetails }}>
      {children}
    </AuthContext.Provider>
  );
};
