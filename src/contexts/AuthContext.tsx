import React, { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;
  authorities: string[];
  userName: string;
  [key: string]: any;
}

interface AuthContextType {
  token: string | null;
  role: string | null;
  userName: string | null;
  login: (newToken: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("authToken"));
  const [role, setRole] = useState<string | null>(localStorage.getItem("role") || "Default");
  const [userName, setUserName] = useState<string | null>(localStorage.getItem("userName"));

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const decodedRole = decodedToken.authorities?.[0] || "Default";
        const decodedUserName = decodedToken.sub;

        setRole(decodedRole);
        setUserName(decodedUserName);

        localStorage.setItem("role", decodedRole);
        localStorage.setItem("userName", decodedUserName);
      } catch (err) {
        console.error("Invalid JWT token:", err);
        logout();
      }
    }
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem("authToken", newToken);
    setToken(newToken);

    try {
      const decodedToken = jwtDecode<DecodedToken>(newToken);
      const decodedRole = decodedToken.authorities?.[0] || "Default";
      const decodedUserName = decodedToken.userName ;

      setRole(decodedRole);
      setUserName(decodedUserName);

      localStorage.setItem("role", decodedRole);
      localStorage.setItem("userName", decodedUserName);
    } catch (err) {
      console.error("Failed to decode token on login:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");

    setToken(null);
    setRole(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
