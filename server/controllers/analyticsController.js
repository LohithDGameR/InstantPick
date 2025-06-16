import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import mongoose from "mongoose"; // Import mongoose to use Types.ObjectId for aggregation

// Get Seller Analytics : /api/seller/analytics
export const getSellerAnalytics = async (req, res) => {
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

    // 1. Total Products by this seller
    const totalProducts = await Product.countDocuments({ sellerId: sellerId });

    // 2. Products in Stock by this seller
    const productsInStock = await Product.countDocuments({
      sellerId: sellerId,
      inStock: true,
    });

    // 3. Products Out of Stock by this seller
    const productsOutOfStock = await Product.countDocuments({
      sellerId: sellerId,
      inStock: false,
    });

    // 4. Total Orders where at least one item belongs to this seller
    const totalOrdersResult = await Order.aggregate([
      { $match: { "items.sellerId": new mongoose.Types.ObjectId(sellerId) } }, // Match orders that contain items from this seller
      { $count: "totalOrders" },
    ]);
    const totalOrders =
      totalOrdersResult.length > 0 ? totalOrdersResult[0].totalOrders : 0;

    // 5. Total Revenue for this seller's products in paid orders
    const totalRevenueResult = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          "items.sellerId": new mongoose.Types.ObjectId(sellerId),
        },
      }, // Match paid orders with items from this seller
      { $unwind: "$items" }, // Deconstruct the items array
      { $match: { "items.sellerId": new mongoose.Types.ObjectId(sellerId) } }, // Filter unwound items again for current seller
      {
        $lookup: {
          // Join with products collection to get product price
          from: "products", // The collection name for products (usually lowercase plural of model name)
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" }, // Deconstruct product details
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $multiply: ["$items.quantity", "$productDetails.offerPrice"],
            },
          }, // Sum revenue based on this seller's items
        },
      },
    ]);
    const totalRevenue =
      totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;

    // 6. Pending Orders for this seller's products
    const pendingOrdersResult = await Order.aggregate([
      {
        $match: {
          isPaid: false,
          "items.sellerId": new mongoose.Types.ObjectId(sellerId),
        },
      },
      { $count: "pendingOrders" },
    ]);
    const pendingOrders =
      pendingOrdersResult.length > 0 ? pendingOrdersResult[0].pendingOrders : 0;

    const analyticsData = {
      totalProducts,
      totalOrders,
      totalRevenue,
      productsInStock,
      productsOutOfStock,
      pendingOrders,
    };

    return res.json({
      success: true,
      message: "Analytics data fetched successfully",
      data: analyticsData,
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch analytics data" });
  }
};
