import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Seller from "../models/sellerModel.js";

// Seller Registration : /api/seller/register
export const sellerRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body; // Destructure name

    // Check if a seller with this email already exists
    let seller = await Seller.findOne({ email });
    if (seller) {
      return res.json({
        success: false,
        message: "Seller with this email already exists",
      });
    }

    // Create a new seller instance with name, email, and password
    seller = await Seller.create({ name, email, password });

    return res
      .status(201)
      .json({ success: true, message: "Seller registered successfully" });
  } catch (error) {
    console.error("Error during seller registration:", error.message);
    res.json({ success: false, message: "Seller registration failed" });
  }
};

// Login Seller : /api/seller/login
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const seller = await Seller.findOne({ email });

    if (!seller || !(await seller.comparePassword(password))) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    // Include seller's name in the JWT payload if you want to use it on the frontend
    const token = jwt.sign(
      { id: seller._id, email: seller.email, name: seller.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("sellerToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: "Logged In" });
  } catch (error) {
    console.error("Error during seller login:", error.message);
    res.json({ success: false, message: "Login failed" });
  }
};

// Seller isAuth : /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
  try {
    // req.seller contains decoded token payload if authSeller middleware succeeded
    return res.json({ success: true, seller: req.seller }); // Optionally send seller data back to frontend
  } catch (error) {
    console.error("Error checking seller authentication:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// Logout Seller : /api/seller/logout
export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    console.error("Error during seller logout:", error.message);
    res.json({ success: false, message: error.message });
  }
};
