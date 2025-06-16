import express from "express";
import {
  getSellerSpecificOrders,
  getUserOrders,
  placeOrderCOD,
  placeOrderStripe,
} from "../controllers/orderController.js"; // Import getSellerSpecificOrders
import authSeller from "../middleware/authSeller.js";
import authUser from "../middleware/authUser.js"; // Assuming you have an authUser middleware
import { assignDeliveryBoy } from "../controllers/cartController.js";

const orderRouter = express.Router();

orderRouter.post("/cod", authUser, placeOrderCOD);
orderRouter.get("/user", authUser, getUserOrders);
orderRouter.post("/stripe", authUser, placeOrderStripe); // Stripe payment initiation route

// Change the route for seller orders to use getSellerSpecificOrders
orderRouter.get("/seller", authSeller, getSellerSpecificOrders);

orderRouter.post("/assign-delivery", authSeller, assignDeliveryBoy);

export default orderRouter;
