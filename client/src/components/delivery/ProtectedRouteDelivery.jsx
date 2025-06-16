// src/components/delivery/ProtectedRouteDelivery.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDeliveryContext } from "../../context/DeliveryContext";
import Loading from "../Loading"; // Assuming you have a Loading component

const ProtectedRouteDelivery = () => {
  const { isDeliveryAuthenticated, isAuthLoading } = useDeliveryContext();

  if (isAuthLoading) {
    return <Loading />; // Show a loading spinner while authentication is being checked
  }

  // If authenticated, render the child routes, otherwise navigate to login
  return isDeliveryAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/delivery/login" replace />
  );
};

export default ProtectedRouteDelivery;
