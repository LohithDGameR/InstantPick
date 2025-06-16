import DeliveryBoy from "../models/DeliveryBoy.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Order from "../models/orderModel.js";

export const registerDeliveryBoy = async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await DeliveryBoy.findOne({ email });
  if (existing)
    return res.json({ success: false, message: "Already registered" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const deliveryBoy = await DeliveryBoy.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ id: deliveryBoy._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("deliveryToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ success: true, deliveryBoy: { name, email } });
};

export const loginDeliveryBoy = async (req, res) => {
  const { email, password } = req.body;
  const deliveryBoy = await DeliveryBoy.findOne({ email });
  if (!deliveryBoy || !(await bcrypt.compare(password, deliveryBoy.password))) {
    return res.json({ success: false, message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: deliveryBoy._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("deliveryToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ success: true, deliveryBoy: { name: deliveryBoy.name, email } });
};

export const logoutDeliveryBoy = async (req, res) => {
  res.clearCookie("deliveryToken");
  res.json({ success: true, message: "Logged Out" });
};

export const isDeliveryAuthenticated = async (req, res) => {
  if (req.deliveryBoyId) {
    try {
      const deliveryBoy = await DeliveryBoy.findById(req.deliveryBoyId).select(
        "-password"
      );
      if (deliveryBoy) {
        return res.json({
          success: true,
          deliveryBoy: {
            name: deliveryBoy.name,
            email: deliveryBoy.email,
            _id: deliveryBoy._id,
          },
        });
      }
    } catch (error) {
      console.error(
        "Error fetching delivery boy data in isDeliveryAuthenticated:",
        error
      );
    }
  }
  res.json({ success: false, message: "Not authenticated" });
};

export const getAssignedOrders = async (req, res) => {
  const deliveryBoyId = req.deliveryBoyId;
  try {
    const orders = await Order.find({ deliveryBoyId: deliveryBoyId }).populate(
      "items.product address"
    );
    res.json({ success: true, orders });
  } catch (error) {
    console.error(
      "Error getting assigned orders for delivery boy:",
      error.message
    );
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status and conditionally update isPaid
export const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;
  try {
    let updateFields = { status };

    // If the new status is 'Delivered', and it's a COD order, mark as paid
    // (Assuming COD orders are the primary ones where payment happens at delivery)
    const order = await Order.findById(orderId);
    if (order && order.paymentType === "COD" && status === "Delivered") {
      updateFields.isPaid = true;
    }
    // For online orders, isPaid should already be true via webhook

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateFields, {
      new: true,
    });
    if (updatedOrder) {
      res.json({
        success: true,
        message: "Order status updated",
        order: updatedOrder,
      });
    } else {
      res.status(404).json({ success: false, message: "Order not found." });
    }
  } catch (error) {
    console.error("Error updating order status:", error.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update order status: " + error.message,
      });
  }
};

export const getAllDeliveryBoys = async (req, res) => {
  try {
    const deliveryBoys = await DeliveryBoy.find({}).select("-password");
    res.json({ success: true, deliveryBoys });
  } catch (error) {
    console.error("Error getting all delivery boys:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch delivery boys." });
  }
};
