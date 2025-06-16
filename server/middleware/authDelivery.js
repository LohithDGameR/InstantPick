// middleware/authDelivery.js
import jwt from "jsonwebtoken";

const authDelivery = async (req, res, next) => {
  const { deliveryToken } = req.cookies;
  if (!deliveryToken)
    return res.json({ success: false, message: "Not Authorized" });

  try {
    const decoded = jwt.verify(deliveryToken, process.env.JWT_SECRET);
    req.deliveryBoyId = decoded.id;
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default authDelivery;
