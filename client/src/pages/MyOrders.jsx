import React, { useEffect, useState, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency, axios, user } = useAppContext();
  const containerRef = useRef(null);

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user");
      if (data.success) {
        setMyOrders(data.orders);
      } else {
        console.error("Failed to fetch user orders:", data.message);
      }
    } catch (error) {
      console.error(
        "Error fetching user orders:",
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user, axios]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.classList.add("fade-in-up");
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col mt-8 md:mt-12 max-w-6xl mx-auto px-4 md:px-8 gap-8 pb-16 opacity-0 translate-y-5">
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-2xl md:text-3xl font-semibold mb-2 text-black">
          My<span className="text-green-600 ml-2 relative">Orders</span>
        </p>
        <div className="w-16 h-0.5 bg-green-600 rounded-full"></div>
      </div>

      {myOrders.length === 0 && (
        <p className="text-center text-gray-500 text-lg">
          No orders found yet!
        </p>
      )}

      {myOrders.map((order, index) => (
        <div
          key={order._id || index}
          className="border border-gray-200 rounded-xl shadow-md mb-8 p-6 bg-white">
          {/* Order Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 text-black text-sm md:text-base font-medium mb-4 pb-2 border-b border-gray-200 gap-2">
            <span className="text-left">
              <span className="font-semibold text-green-700">Order ID:</span>{" "}
              {order._id}
            </span>
            <span className="md:text-center text-left lg:text-right">
              <span className="font-semibold text-green-700">Payment:</span>{" "}
              {order.paymentType}
            </span>
            <span className="md:text-right text-left">
              <span className="font-semibold text-green-700">
                Total Amount:
              </span>{" "}
              {currency}
              {order.amount}
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {order.items.map((item, itemIndex) => (
              <div
                key={item.product._id || itemIndex}
                className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] items-center py-4 gap-4">
                {/* Product Details */}
                <div className="flex items-center flex-grow">
                  <div className="w-20 h-20 flex items-center justify-center border border-gray-200 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.image[0]}
                      alt={item.product.name}
                      className="max-w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h2 className="text-lg font-semibold text-green-700">
                      {item.product.name}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Category: {item.product.category}
                    </p>
                  </div>
                </div>

                {/* Quantity / Status / Date */}
                <div className="flex flex-col text-gray-700 items-center md:items-center text-md gap-1">
                  <p>
                    <span className="font-medium">Quantity:</span>{" "}
                    {item.quantity || "1"}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`font-semibold ${
                        order.status === "Delivered"
                          ? "text-green-600"
                          : "text-orange-500"
                      }`}>
                      {order.status}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(order.createAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Amount */}
                <p className="text-green-700 text-lg font-bold text-left md:text-right">
                  {currency}
                  {(item.product.offerPrice * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
