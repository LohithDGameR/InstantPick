// src/context/DeliveryContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios"; // This axios instance should inherit global defaults from AppContext
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// axios.defaults.withCredentials = true; // This should ideally be set once globally in AppContext or main entry.
// axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'; // Same for baseURL.

export const DeliveryContext = createContext();

export const DeliveryContextProvider = ({ children }) => {
  const [deliveryBoy, setDeliveryBoy] = useState(null);
  const [isDeliveryAuthenticated, setIsDeliveryAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // New loading state for auth check
  const navigate = useNavigate();

  // Function to check delivery boy's authentication status
  const checkDeliveryAuth = useCallback(async () => {
    setIsAuthLoading(true); // Start loading
    try {
      // This endpoint is crucial for persistence on refresh
      const { data } = await axios.get("/api/delivery/is-auth");
      if (data.success) {
        setDeliveryBoy(data.deliveryBoy);
        setIsDeliveryAuthenticated(true);
      } else {
        setDeliveryBoy(null);
        setIsDeliveryAuthenticated(false);
      }
    } catch (error) {
      console.error(
        "Error checking delivery boy authentication:",
        error.response?.data?.message || error.message
      );
      setDeliveryBoy(null);
      setIsDeliveryAuthenticated(false);
    } finally {
      setIsAuthLoading(false); // End loading
    }
  }, []);

  // Login function for delivery boys
  const loginDelivery = useCallback(
    async (email, password) => {
      try {
        const { data } = await axios.post("/api/delivery/login", {
          email,
          password,
        });
        if (data.success) {
          setDeliveryBoy(data.deliveryBoy);
          setIsDeliveryAuthenticated(true);
          toast.success("Delivery boy logged in successfully!");
          navigate("/delivery"); // Redirect to the delivery layout base path
        } else {
          toast.error(data.message || "Login failed.");
          setDeliveryBoy(null);
          setIsDeliveryAuthenticated(false);
        }
        return data.success;
      } catch (error) {
        console.error(
          "Delivery boy login error:",
          error.response?.data?.message || error.message
        );
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "An error occurred during login."
        );
        return false;
      }
    },
    [navigate]
  );

  // Logout function for delivery boys
  const logoutDelivery = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/delivery/logout");
      if (data.success) {
        setDeliveryBoy(null);
        setIsDeliveryAuthenticated(false);
        toast.success("Delivery boy logged out.");
        navigate("/delivery/login"); // Redirect to login page
      } else {
        toast.error(data.message || "Logout failed.");
      }
    } catch (error) {
      console.error(
        "Delivery boy logout error:",
        error.response?.data?.message || error.message
      );
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "An error occurred during logout."
      );
    }
  }, [navigate]);

  // Check authentication status on component mount
  useEffect(() => {
    checkDeliveryAuth();
  }, [checkDeliveryAuth]);

  const value = {
    deliveryBoy,
    setDeliveryBoy,
    isDeliveryAuthenticated,
    isAuthLoading, // Expose loading state
    loginDelivery,
    logoutDelivery,
    checkDeliveryAuth,
    axios, // Expose axios instance if needed for direct calls
  };

  return (
    <DeliveryContext.Provider value={value}>
      {children}
    </DeliveryContext.Provider>
  );
};

export const useDeliveryContext = () => {
  return useContext(DeliveryContext);
};
