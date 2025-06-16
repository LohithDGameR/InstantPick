import User from "../models/User.js";
import Order from "../models/orderModel.js"; // Make sure Order model is imported here

// Update User CartData : /api/cart/update
export const updateCart = async (req, res) => {
  try {
    const { userId, cartItems } = req.body;
    await User.findByIdAndUpdate(userId, { cartItems });
    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Assign Delivery Boy to an Order (now updates the main Order document)
export const assignDeliveryBoy = async (req, res) => {
  const { orderId, deliveryBoyId } = req.body; // deliveryBoyId can be null to unassign

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { deliveryBoyId: deliveryBoyId || null }, // Set to null if deliveryBoyId is empty/null
      { new: true } // Return the updated document
    );

    if (updatedOrder) {
      res.json({
        success: true,
        message: "Delivery boy assigned successfully!",
        order: updatedOrder,
      });
    } else {
      res.status(404).json({ success: false, message: "Order not found." });
    }
  } catch (error) {
    console.error("Error assigning delivery boy:", error.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to assign delivery boy: " + error.message,
      });
  }
};
