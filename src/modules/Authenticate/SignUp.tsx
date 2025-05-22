import { useState } from "react";
import { FaUser, FaEnvelope, FaKey, FaPhone } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";

type SignupModalProps = {
  onClose: () => void;
  onSwitchToLogin: () => void;
};

export default function SignupModal({ onClose, onSwitchToLogin }: SignupModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role] = useState<"USER" | "ADMIN">("USER");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword || !phoneNumber) {
      toast.error("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        role,
      });

      toast.success("Registration successful!");
      onSwitchToLogin(); // Switch to login modal
      onClose(); // Close signup modal
      console.log("Register success:", res.data);
    } catch (err) {
      console.error("Register error:", err);
      toast.error("Registration failed. Please try again.");
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
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        {/* First Name */}
        <div className="flex items-center bg-[#2d2d2d] rounded-md px-3 py-2 mb-4">
          <FaUser className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="bg-transparent focus:outline-none w-full text-white placeholder-gray-400"
          />
        </div>

        {/* Last Name */}
        <div className="flex items-center bg-[#2d2d2d] rounded-md px-3 py-2 mb-4">
          <FaUser className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="bg-transparent focus:outline-none w-full text-white placeholder-gray-400"
          />
        </div>

        {/* Email */}
        <div className="flex items-center bg-[#2d2d2d] rounded-md px-3 py-2 mb-4">
          <FaEnvelope className="text-gray-400 mr-2" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent focus:outline-none w-full text-white placeholder-gray-400"
          />
        </div>

        {/* Phone Number */}
        <div className="flex items-center bg-[#2d2d2d] rounded-md px-3 py-2 mb-4">
          <FaPhone className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
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
          <button onClick={() => setShowPassword(!showPassword)} className="text-gray-400">
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="flex items-center bg-[#2d2d2d] rounded-md px-3 py-2 mb-4">
          <FaKey className="text-gray-400 mr-2" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-transparent focus:outline-none w-full text-white placeholder-gray-400"
          />
          <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-400">
            {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>

        {/* Signup Button */}
        <button
          onClick={handleRegister}
          className="bg-white text-black font-semibold py-2 w-full rounded-md mb-4 hover:bg-gray-200 transition"
        >
          Sign Up
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <span
            className="text-white font-semibold cursor-pointer hover:underline"
            onClick={onSwitchToLogin}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
