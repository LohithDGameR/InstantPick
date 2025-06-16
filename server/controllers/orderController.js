import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import stripe from "stripe";
import User from "../models/User.js";
import mongoose from "mongoose";

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, address, paymentType } = req.body;

    if (!userId || !address || items.length === 0) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Invalid order data, user not authenticated, or missing address/items.",
        });
    }

    const enrichedItems = [];
    let subtotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(400)
          .json({ success: false, message: `Product with ID ${item.product} not found.` });
      }
      enrichedItems.push({
        product: product._id,
        quantity: item.quantity,
        sellerId: product.sellerId,
      });
      subtotal += product.offerPrice * item.quantity;
    }

    const totalAmountWithTax = subtotal + subtotal * 0.02;
    const finalOrderAmount = Math.round(totalAmountWithTax * 100) / 100;

    await User.findByIdAndUpdate(userId, { cartItems: {} });

    await Order.create({
      userId,
      items: enrichedItems,
      amount: finalOrderAmount,
      address: address,
      paymentType: paymentType || "COD",
      isPaid: true, // COD orders are considered paid upon creation
      status: "Order Placed", // Set status to Confirmed for COD/Wallet
    });

    return res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    console.error("Error placing COD order:", error.message);
    if (error.name === "ValidationError") {
      const errors = Object.keys(error.errors).map(
        (key) => error.errors[key].message
      );
      return res
        .status(400)
        .json({
          success: false,
          message: `Validation Error: ${errors.join(", ")}`,
        });
    }
    return res
      .status(500)
      .json({ success: false, message: "Failed to place order: " + error.message });
  }
};

// Place Order Stripe : /api/order/stripe (Frontend -> Backend)
export const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, address } = req.body;
    const { origin } = req.headers;

    if (!userId || !address || items.length === 0) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Invalid order data, user not authenticated, or missing address/items.",
        });
    }

    let productDataForStripe = [];
    const enrichedItems = [];
    let subtotalForDb = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(400)
          .json({
            success: false,
            message: `Product with ID ${item.product} not found during Stripe order initiation.`,
          });
      }
      enrichedItems.push({
        product: product._id,
        quantity: item.quantity,
        sellerId: product.sellerId,
      });
      subtotalForDb += product.offerPrice * item.quantity;

      productDataForStripe.push({
        price_data: {
          currency: "usd", // IMPORTANT: This must match your Stripe account's configured currency
          product_data: {
            name: product.name,
          },
          unit_amount:
            Math.floor(product.offerPrice + product.offerPrice * 0.02) * 100, // Tax applied per item
        },
        quantity: item.quantity,
      });
    }

    const totalAmountWithTaxForDb = subtotalForDb + subtotalForDb * 0.02;
    const finalOrderAmountForDb =
      Math.round(totalAmountWithTaxForDb * 100) / 100;

    const order = await Order.create({
      userId,
      items: enrichedItems,
      amount: finalOrderAmountForDb,
      address: address,
      paymentType: "Online",
      isPaid: true,
      status: "Order Placed", // Initial status for online orders
    });
    if (!order) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to create order in database." });
    }
    // Clear user cart after order creation
    await User.findByIdAndUpdate(userId, { cartItems: {} });
    
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripeInstance.checkout.sessions.create({
      line_items: productDataForStripe,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },
    });

    return res.json({ success: true, url: session.url });
  } catch (error) {
    console.error(
      "[Stripe Checkout Init] Error placing Stripe order:",
      error.message
    );
    if (error.name === "ValidationError") {
      const errors = Object.keys(error.errors).map(
        (key) => error.errors[key].message
      );
      return res
        .status(400)
        .json({
          success: false,
          message: `Validation Error: ${errors.join(", ")}`,
        });
    }
    return res
      .status(500)
      .json({ success: false, message: "Failed to place order: " + error.message });
  }
};

// Stripe Webhooks to Verify Payments Action : '/stripe' (Stripe -> Backend)
export const stripeWebhooks = async (request, response) => {
  const rawBody = request.body;
  const sig = request.headers["stripe-signature"];
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(
      `Stripe Webhook Error: Signature verification failed or malformed event: ${error.message}`
    );
    response.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      try {
        const sessionsList = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
          limit: 1,
        });

        if (!sessionsList || sessionsList.data.length === 0) {
          console.warn(
            `No Checkout Session found for paymentIntentId: ${paymentIntentId}. Cannot get metadata.`
          );
          response.status(400).send("No session found for payment intent");
          return;
        }

        const session = sessionsList.data[0];
        const { orderId, userId } = session.metadata;

        if (!orderId) {
          console.error("Error: orderId is missing from session metadata.");
          response.status(400).send("Missing orderId in metadata.");
          return;
        }
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
          console.error(
            `Invalid orderId format received from Stripe metadata: "${orderId}"`
          );
          response.status(400).send("Invalid Order ID format.");
          return;
        }
        const orderObjectId = new mongoose.Types.ObjectId(orderId);

        // Find and update the order to isPaid: true and status: "Confirmed"
        const updatedOrder = await Order.findByIdAndUpdate(
          orderObjectId,
          { isPaid: true, status: "Order Placed" }, // Update status here
          { new: true, runValidators: true }
        );

        if (updatedOrder) {
          // Clear user cart only after successful payment update
          await User.findByIdAndUpdate(userId, { cartItems: {} });
        } else {
          console.warn(
            `Order ${orderId} not found by findByIdAndUpdate during success webhook.`
          );
        }
      } catch (dbError) {
        console.error(
          `Database UPDATE FAILED for order ${orderId} (payment_intent.succeeded): ${dbError.message}`
        );
        console.error("Full DB Error object (payment_intent.succeeded):", dbError);
      }
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      try {
        const sessionsList = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
          limit: 1,
        });

        if (!sessionsList || sessionsList.data.length === 0) {
          console.warn(
            `No Checkout Session found for failed paymentIntentId: ${paymentIntentId}. Cannot get metadata.`
          );
          response.status(400).send("No session found for failed payment intent");
          return;
        }

        const session = sessionsList.data[0];
        const { orderId } = session.metadata;

        await Order.findByIdAndDelete(orderId);
      } catch (dbError) {
        console.error(
          `Database operation failed for Stripe webhook (payment_intent.payment_failed): ${dbError.message}`
        );
        console.error(
          "Full DB Error object (failed payment):",
          dbError
        );
      }
      break;
    }
    case "checkout.session.completed": {
      // Keep this as a warning, as we are primarily listening for payment_intent.succeeded
      console.warn(
        `Received checkout.session.completed event, but primary handler is payment_intent.succeeded. Ensure your Stripe webhook is configured for 'payment_intent.succeeded' events primarily.`
      );
      break;
    }
    default:
      console.warn(`Unhandled event type ${event.type}.`);
      break;
  }
  // Always send a 200 response to Stripe to acknowledge receipt
  response.json({ received: true });
};

// Get Orders by User ID : /api/order/user (Customer facing)
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User ID not found." });
    }

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }, { paymentType: "Wallet" }],
    })
      .populate({ path: "items.product", select: "name image offerPrice" })
      .sort({ createAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error getting user orders:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Seller Specific Orders (for admin) : /api/order/seller
export const getSellerSpecificOrders = async (req, res) => {
  try {
    const sellerId = req.seller.id;
    if (!sellerId) {
      return res
        .status(401)
        .json({ success: false, message: "Seller not authenticated or ID missing." });
    }

    const orders = await Order.find({ "items.sellerId": sellerId })
      .populate({
        path: "items.product",
        model: "Product",
        select: "name offerPrice image",
      })
      .sort({ createAt: -1 });

    const filteredOrders = orders.map((order) => ({
      ...order.toObject(),
      items: order.items.filter(
        (item) => item.sellerId.toString() === sellerId.toString()
      ),
    }));

    res.json({ success: true, orders: filteredOrders });
  } catch (error) {
    console.error("Error getting seller-specific orders:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch seller-specific orders." });
  }
};
