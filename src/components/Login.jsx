import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

import VerifyOtpPopup from "./VerifyOtpPopup";
import ForgotPasswordPopup from "./ForgotPasswordPopup";

const Login = () => {
  const userType = import.meta.env.VITE_USER_TYPE;
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const { login, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [showForgotPopup, setShowForgotPopup] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");

  useEffect(() => {
    if (user?.role === "admin" || user?.role === "superAdmin") {
      navigate("/", { replace: true });
    } else if (user) {
      navigate(`/affiliate-list/${user?.id}`, { replace: true });
    }
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingLogin(true);
    setError("");
    try {
      if (!form.username || !form.password)
        throw new Error("All fields required");
      await login({
        userNameOrEmailorPhone: form.username,
        password: form.password,
        userType: userType === "affiliate" ? "affiliate" : "admin",
      });
      setIsLoadingLogin(false);
    } catch (err) {
      setIsLoadingLogin(false);
      const resData = err.response?.data;
      if (resData?.requiresVerification) {
        setVerifyEmail(resData.email);
        setShowOtpPopup(true);
        toast.info(resData.message || "Please verify your email");
      } else {
        setError(resData?.message || "Login failed");
        toast.error(resData?.message || "Login failed");
      }
    }
  };

  const handleVerifySuccess = () => {
    setShowOtpPopup(false);
    toast.success("Verification successful! You can now log in.");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-center text-green-700 mb-2">
          {userType === "affiliate"
            ? "Affiliate Sign In"
            : userType === "agent"
              ? "Agent Sign In"
              : "Admin Sign In"}
        </h2>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Email or Username
          </label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter your email or username"
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 pr-10"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowForgotPopup(true)}
              className="text-sm font-medium text-green-600 hover:text-green-700 underline"
            >
              Forgot Password?
            </button>
          </div>
        </div>
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg py-2 transition disabled:opacity-60"
          disabled={isLoading || isLoadingLogin}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {showOtpPopup && (
        <VerifyOtpPopup
          email={verifyEmail}
          onClose={() => setShowOtpPopup(false)}
          onSuccess={handleVerifySuccess}
        />
      )}

      {showForgotPopup && (
        <ForgotPasswordPopup onClose={() => setShowForgotPopup(false)} />
      )}
    </div>
  );
};

export default Login;
