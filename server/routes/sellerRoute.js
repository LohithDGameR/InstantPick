import express from "express";
import {
  isSellerAuth,
  sellerLogin,
  sellerLogout,
  sellerRegister, // Import the new sellerRegister function
} from "../controllers/sellerController.js";
import authSeller from "../middleware/authSeller.js"; // Assuming this middleware exists and correctly authenticates
import { getSellerAnalytics } from "../controllers/analyticsController.js";

const sellerRouter = express.Router();

sellerRouter.post("/register", sellerRegister); // New registration route
sellerRouter.post("/login", sellerLogin);
sellerRouter.get("/is-auth", authSeller, isSellerAuth);
sellerRouter.get("/logout", sellerLogout);

sellerRouter.get("/analytics", authSeller, getSellerAnalytics); // This is the route for fetching analytics

export default sellerRouter;
