// src/pages/delivery/DeliveryRegister.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const DeliveryRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/delivery/register", {
        name,
        email,
        password,
      });
      if (data.success) {
        toast.success("Registration successful! Please login.");
        navigate("/delivery/login");
      } else {
        toast.error(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error(
        "Delivery boy registration error:",
        error.response?.data?.message || error.message
      );
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "An error occurred during registration."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl border border-green-200">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-6">
          Delivery Boy Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-400"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-400"
              placeholder="delivery@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-400"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
            disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/delivery/login"
            className="font-medium text-green-700 hover:text-green-800 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default DeliveryRegister;
