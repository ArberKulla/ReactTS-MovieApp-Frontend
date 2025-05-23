import { useState } from "react";
import { FaUser, FaKey } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { TMDB } from "../../configs/tmdb"; 

type LoginModalProps = {
  onClose: () => void;
  onSwitchToSignup: () => void;
};

export default function LoginModal({ onClose, onSwitchToSignup }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login: loginToContext } = useAuth();
  const navigate = useNavigate();

   const BACKENDURL = TMDB.BACKEND_BASE

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in both fields.");
      return;
    }

    try {
      const res = await axios.post(BACKENDURL+"auth/authenticate", {
        email,
        password,
      });

      const token = res.data.access_token;
      if (token) {
        loginToContext(token);
        toast.success("Login successful!");
        onClose();
        navigate("/");
      } else {
        toast.error("Login failed: no token received.");
        console.warn("Login response didn't include a token.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Invalid email or password.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur bg-white/10"
      onClick={onClose}
    >
      <div
        className="bg-[#1c1c1c] p-6 rounded-xl w-[350px] relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-white text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

        {/* Email */}
        <div className="flex items-center bg-[#2d2d2d] rounded-md px-3 py-2 mb-4">
          <FaUser className="text-gray-400 mr-2" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent focus:outline-none w-full text-white placeholder-gray-400"
          />
        </div>

        {/* Password */}
        <div className="flex items-center bg-[#2d2d2d] rounded-md px-3 py-2 mb-4">
          <FaKey className="text-gray-400 mr-2" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent focus:outline-none w-full text-white placeholder-gray-400"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400"
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="bg-white text-black font-semibold py-2 w-full rounded-md mb-4 hover:bg-gray-200 transition"
        >
          Login
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <span
            className="text-white font-semibold cursor-pointer hover:underline"
            onClick={onSwitchToSignup}
          >
            SignUp
          </span>
        </p>
      </div>
    </div>
  );
}
