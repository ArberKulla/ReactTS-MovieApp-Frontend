import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { TMDB } from "../../configs/tmdb"; 


type UserRole = "USER" | "ADMIN";

const LoginTest: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const BACKENDURL = TMDB.BACKEND_BASE
  // Shared
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register only
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<UserRole>("USER");

  const { login: loginToContext } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(BACKENDURL+"auth/authenticate", {
        email,
        password,
      });

      const token = res.data.access_token;
      if (token) {
        loginToContext(token);
        console.log("Login success:", res.data);
        navigate("/"); // redirect after login
      } else {
        console.warn("Login response didn't include a token.");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post(BACKENDURL+"auth/register", {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        role,
      });
      console.log("Register success:", res.data);
      setIsLogin(true); // switch to login after successful registration
    } catch (err) {
      console.error("Register error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="input mb-2"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="input mb-2"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="input mb-2"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="input mb-2"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input mb-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input mb-4"
        />

        <button
          onClick={isLogin ? handleLogin : handleRegister}
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p className="mt-4 text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginTest;
