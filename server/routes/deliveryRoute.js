import express from "express";
import {
  registerDeliveryBoy,
  loginDeliveryBoy,
  logoutDeliveryBoy,
  getAssignedOrders,
  updateOrderStatus,
  isDeliveryAuthenticated,
  getAllDeliveryBoys, // Import the new function
} from "../controllers/deliveryController.js";
import authDelivery from "../middleware/authDelivery.js";
import authSeller from "../middleware/authSeller.js"; // Import authSeller to protect this admin route

const deliveryRouter = express.Router();

deliveryRouter.post("/register", registerDeliveryBoy);
deliveryRouter.post("/login", loginDeliveryBoy);
deliveryRouter.get("/logout", authDelivery, logoutDeliveryBoy);
deliveryRouter.get("/orders", authDelivery, getAssignedOrders);
deliveryRouter.post("/update-status", authDelivery, updateOrderStatus);
deliveryRouter.get("/is-auth", authDelivery, isDeliveryAuthenticated);
// *** NEW: Route to get all delivery boys (for admin to assign) ***
deliveryRouter.get("/all", authSeller, getAllDeliveryBoys); // Protect this route with authSeller
// ***************************************************************

export default deliveryRouter;
