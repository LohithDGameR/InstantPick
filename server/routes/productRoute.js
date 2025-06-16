import express from "express";
import { upload } from "../configs/multer.js"; // Assuming you have a multer config for file uploads
import {
  addProduct,
  getSellerProducts, // Function for seller-specific list
  getAllProducts, // Function for public list
  productById,
  changeStock,
} from "../controllers/productController.js";
import authSeller from "../middleware/authSeller.js"; // For seller-specific routes

const productRouter = express.Router();

// Seller-specific routes (protected by authSeller)
// These routes require an authenticated seller token
productRouter.post("/add", authSeller, upload.array("images", 4), addProduct);
productRouter.get("/seller-list", authSeller, getSellerProducts); // Admin's product list
productRouter.post("/id", authSeller, productById); // Assuming this is for admin to view/edit their product detail
productRouter.post("/stock", authSeller, changeStock);

// Public-facing routes (DO NOT use authSeller here)
// These routes are accessible to all users (customers, visitors)
productRouter.get("/all", getAllProducts); // The route to fetch ALL products for the storefront

export default productRouter;
