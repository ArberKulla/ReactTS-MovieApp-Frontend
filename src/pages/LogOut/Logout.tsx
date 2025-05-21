import { useState } from "react";
import { FaUser, FaKey } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

type LoginModalProps = {
  onClose: () => void;
};

export default function LoginModal({ onClose }: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);

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

        {/* Username */}
        <div className="flex items-center bg-[#2d2d2d] rounded-md px-3 py-2 mb-4">
          <FaUser className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Username"
            className="bg-transparent focus:outline-none w-full text-white placeholder-gray-400"
          />
        </div>

        {/* Password */}
        <div className="flex items-center bg-[#2d2d2d] rounded-md px-3 py-2 mb-4">
          <FaKey className="text-gray-400 mr-2" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
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
        <button className="bg-white text-black font-semibold py-2 w-full rounded-md mb-4 hover:bg-gray-200 transition">
          Login
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <span className="text-white font-semibold cursor-pointer hover:underline">
            SignUp
          </span>
        </p>
      </div>
    </div>
  );
}
