import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from "stripe";
import User from "../models/User.js";

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        // Assuming authUser middleware is used and sets req.userId
        const userId = req.userId; // *** CRUCIAL FIX: Get userId from req.userId ***
        const { items, address } = req.body;

        if (!userId || !address || items.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid order data or user not authenticated." });
        }

        // Calculate Amount Using Items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            if (!product) {
                // It's good to throw an error if a product is not found
                throw new Error(`Product with ID ${item.product} not found during order calculation.`);
            }
            return (await acc) + product.offerPrice * item.quantity;
        }, Promise.resolve(0)); // Use Promise.resolve(0) for initial accumulator with async/await reduce

        // Add Tax Charge (2%)
        amount += Math.floor(amount * 0.02);

        // Clear user cart after placing order
        await User.findByIdAndUpdate(userId, { cartItems: {} });

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
            isPaid: true, // COD orders are considered paid upon creation
        });

        return res.json({ success: true, message: "Order Placed Successfully" });
    } catch (error) {
        console.error("Error placing COD order:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Place Order Stripe : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const userId = req.userId; // *** CRUCIAL FIX: Get userId from req.userId ***
        const { items, address } = req.body;
        const { origin } = req.headers;

        if (!userId || !address || items.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid order data or user not authenticated." });
        }

        let productData = [];

        // Calculate Amount Using Items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            if (!product) {
                throw new Error(`Product with ID ${item.product} not found during Stripe order calculation.`);
            }
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });
            return (await acc) + product.offerPrice * item.quantity;
        }, Promise.resolve(0)); // Use Promise.resolve(0) for initial accumulator with async/await reduce

        // Add Tax Charge (2%)
        amount += Math.floor(amount * 0.02);

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
            isPaid: false, // Online orders are initially unpaid
        });

        // Stripe Gateway Initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        // create line items for stripe
        const line_items = productData.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02) * 100, // Original logic for tax on individual items
                },
                quantity: item.quantity,
            };
        });

        // create session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            },
        });

        return res.json({ success: true, url: session.url });
    } catch (error) {
        console.error("Error placing Stripe order:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Stripe Webhooks to Verify Payments Action : /stripe
export const stripeWebhooks = async (request, response) => {
    // Stripe Gateway Initialize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const sig = request.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error("Stripe Webhook Error:", error.message);
        response.status(400).send(`Webhook Error: ${error.message}`);
        return; // Added return to prevent further execution
    }

    // Handle the event
    switch (event.type) {
        case "payment_intent.succeeded": { // *** REVERTED TO YOUR ORIGINAL EVENT TYPE ***
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // Getting Session Metadata
            // This assumes your original flow retrieves session metadata via payment_intent ID
            // If you are directly using Checkout Sessions, you might access metadata differently (e.g., event.data.object.metadata)
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            // Ensure session data exists before accessing metadata
            if (!session || session.data.length === 0) {
                console.warn(`No session found for paymentIntentId: ${paymentIntentId}`);
                response.status(400).send('No session found for payment intent');
                return;
            }

            const { orderId, userId } = session.data[0].metadata; // Access metadata as per your original logic
            
            try {
                // Mark Payment as Paid
                await Order.findByIdAndUpdate(orderId, { isPaid: true });
                // Clear user cart
                await User.findByIdAndUpdate(userId, { cartItems: {} });
                console.log(`Order ${orderId} marked as paid and cart cleared for user ${userId} via payment_intent.succeeded`);
            } catch (dbError) {
                console.error("Database update failed for Stripe webhook (payment_intent.succeeded):", dbError.message);
            }
            break;
        }
        case "payment_intent.payment_failed": { // *** REVERTED TO YOUR ORIGINAL EVENT TYPE ***
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // Getting Session Metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            if (!session || session.data.length === 0) {
                console.warn(`No session found for failed paymentIntentId: ${paymentIntentId}`);
                response.status(400).send('No session found for failed payment intent');
                return;
            }

            const { orderId } = session.data[0].metadata; // Access metadata as per your original logic
            try {
                await Order.findByIdAndDelete(orderId);
                console.log(`Order ${orderId} deleted due to payment_intent.payment_failed.`);
            } catch (dbError) {
                console.error("Database deletion failed for Stripe webhook (payment_intent.payment_failed):", dbError.message);
            }
            break;
        }

        default:
            console.warn(`Unhandled event type ${event.type}`); // Changed to warn for unhandled events
            break;
    }
    response.json({ received: true });
};

// Get Orders by User ID : /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        // Retrieve userId from req.userId, which is set by the authUser middleware
        const userId = req.userId; // *** CRUCIAL FIX: Get userId from req.userId ***

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID not found." });
        }

        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }],
        })
            .populate("items.product address")
            .sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (error) {
        console.error("Error getting user orders:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Orders ( for seller / admin) : /api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }],
        })
            .populate("items.product address")
            .sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Error getting all orders:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};