import { v2 as cloudinary } from "cloudinary";
import Product from "../models/productModel.js";

// Add Product : /api/product/add
export const addProduct = async (req, res) => {
  try {
    const sellerId = req.seller.id; // Get seller ID from authenticated request (set by authSeller middleware)
    if (!sellerId) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Seller not authenticated or ID missing.",
        });
    }

    let productData = JSON.parse(req.body.productData);
    const images = req.files;

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    // Create product with assigned sellerId
    await Product.create({
      ...productData,
      image: imagesUrl,
      sellerId: sellerId,
    });

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.error("Error adding product:", error.message); // Use console.error for errors
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Seller-Specific Products : /api/product/seller-list (Protected by authSeller)
// This will now fetch products only for the logged-in seller
export const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.seller.id; // Get seller ID from authenticated request
    if (!sellerId) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Seller not authenticated or ID missing.",
        });
    }

    const products = await Product.find({ sellerId: sellerId }); // Filter by sellerId
    res.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching seller products:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get ALL Products (Public-facing) : /api/product/all (Not protected by authSeller)
export const getAllProducts = async (req, res) => {
  try {
    // This route fetches ALL products for customer-facing pages, no seller filtering.
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching all products:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single Product : /api/product/id
// This endpoint is used by frontend product details for any user.
export const productById = async (req, res) => {
  try {
    const { id } = req.body; // Assuming ID is sent in the body
    // OR const { id } = req.params; // If ID is in URL params (more typical)

    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    // No sellerId check here, as this is assumed to be a public product detail view.
    // If you have a separate admin-only product detail route, apply seller auth there.

    res.json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product by ID:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Change Product inStock : /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const sellerId = req.seller.id; // Get seller ID from authenticated request
    if (!sellerId) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Seller not authenticated or ID missing.",
        });
    }

    const { id, inStock } = req.body;

    // Find and update, ensuring the product belongs to the logged-in seller
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, sellerId: sellerId }, // Add sellerId to the query filter
      { inStock },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Product not found or not owned by this seller.",
        });
    }

    res.json({ success: true, message: "Stock Updated" });
  } catch (error) {
    console.error("Error changing product stock:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
