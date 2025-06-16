import React, { useEffect, useState, useCallback } from "react";
import { useAppContext } from "../../context/AppContext";
import { format } from "date-fns";
import toast from "react-hot-toast";

const Orders = () => {
  const { axios, sellerData } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliveryBoys, setDeliveryBoys] = useState([]);

  // Fetch orders relevant to the logged-in seller
  const fetchSellerOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get("/api/order/seller");

      if (data.success) {
        const sortedOrders = data.orders.sort(
          (a, b) => new Date(b.createAt) - new Date(a.createAt)
        );
        setOrders(sortedOrders);
      } else {
        toast.error(data.message || "Failed to fetch orders.");
        setError(data.message || "Failed to fetch orders.");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while fetching orders."
      );
      setError(
        err.response?.data?.message || err.message || "Failed to fetch orders."
      );
    } finally {
      setLoading(false);
    }
  }, [axios]);

  // Fetch all delivery boys for assignment dropdown
  const fetchDeliveryBoys = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/delivery/all");
      if (data.success) {
        setDeliveryBoys(data.deliveryBoys);
      } else {
        toast.error(data.message || "Failed to fetch delivery boys.");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while fetching delivery boys."
      );
    }
  }, [axios]);

  // Handle assigning delivery boy to an order
  const handleAssignDeliveryBoy = async (orderId, deliveryBoyId) => {
    try {
      const { data } = await axios.post("/api/order/assign-delivery", {
        orderId,
        deliveryBoyId,
      });
      if (data.success) {
        toast.success(data.message);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { ...order, deliveryBoyId: deliveryBoyId }
              : order
          )
        );
      } else {
        toast.error(data.message || "Assignment failed.");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "An error occurred during assignment."
      );
    }
  };

  // Handle updating general order status (e.g., Confirmed, Cancelled from seller side)
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const { data } = await axios.post("/api/delivery/update-status", {
        orderId,
        status: newStatus,
      });
      if (data.success) {
        toast.success("Order status updated successfully!");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        toast.error(data.message || "Failed to update status.");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while updating status."
      );
    }
  };

  // Effect to fetch data when component mounts or sellerData changes
  useEffect(() => {
    if (sellerData?.id) {
      fetchSellerOrders();
      fetchDeliveryBoys();
    }
  }, [sellerData, fetchSellerOrders, fetchDeliveryBoys]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] text-lg text-gray-600">
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[80vh] text-red-600 text-lg">
        <p>Error: {error}</p>
        <button
          onClick={fetchSellerOrders}
          className="mt-4 px-6 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold text-green-600 ml-2 relative mb-6">
        Seller Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md border border-green-200">
          <p className="text-xl text-gray-500">
            No orders for your products yet.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md border border-green-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-100 text-green-800 text-sm font-semibold">
                <tr>
                  <th className="px-4 py-3 text-left">Order ID</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">
                    Address
                  </th>
                  <th className="px-4 py-3 text-left">Items</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Payment</th>
                  <th className="px-4 py-3 text-left">Placed On</th>
                  <th className="px-4 py-3 text-left">Order Status</th>
                  <th className="px-4 py-3 text-left">Delivery Boy</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.address?.firstName} {order.address?.lastName}
                      <br />
                      <span className="text-xs text-gray-500">
                        {order.address?.phone}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-700 max-w-xs">
                      {order.address?.street}, {order.address?.city},{" "}
                      {order.address?.state}, {order.address?.zipcode},{" "}
                      {order.address?.country}
                    </td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-700">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center mb-1">
                          <img
                            src={item.product?.image[0]}
                            alt={item.product?.name}
                            className="w-8 h-8 rounded mr-2 object-cover"
                          />
                          <span>
                            {item.product?.name} x {item.quantity}
                          </span>
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ${order.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.paymentType} {order.isPaid ? "(Paid)" : "(Unpaid)"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {format(new Date(order.createAt), "MMM d,PPPP")}
                      <br />
                      <span className="text-xs text-gray-500">
                        {format(new Date(order.createAt), "h:mm a")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${
                            order.status === "Confirmed"
                              ? "bg-green-100 text-green-800"
                              : ""
                          }
                          ${
                            order.status === "Processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : ""
                          }
                          ${
                            order.status === "Out for Delivery"
                              ? "bg-blue-100 text-blue-800"
                              : ""
                          }
                          ${
                            order.status === "Delivered"
                              ? "bg-purple-100 text-purple-800"
                              : ""
                          }
                          ${
                            order.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : ""
                          }
                          ${
                            order.status === "Pending Payment"
                              ? "bg-orange-100 text-orange-800"
                              : ""
                          }
                        `}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        value={order.deliveryBoyId || ""}
                        onChange={(e) =>
                          handleAssignDeliveryBoy(
                            order._id,
                            e.target.value || null
                          )
                        }>
                        <option value="">-- Unassigned --</option>
                        {deliveryBoys.map((db) => (
                          <option key={db._id} value={db._id}>
                            {db.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <select
                        className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateOrderStatus(order._id, e.target.value)
                        }>
                        <option value="Processing">Processing</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Out for Delivery">
                          Out for Delivery
                        </option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {" "}
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-4 rounded-lg shadow-md border border-green-200">
                <div className="flex justify-between items-center mb-3 border-b pb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Order ID:{" "}
                    <span className="font-normal text-gray-600">
                      {order._id.substring(0, 8)}...
                    </span>
                  </h3>
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${
                        order.status === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : ""
                      }
                      ${
                        order.status === "Processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : ""
                      }
                      ${
                        order.status === "Out for Delivery"
                          ? "bg-blue-100 text-blue-800"
                          : ""
                      }
                      ${
                        order.status === "Delivered"
                          ? "bg-purple-100 text-purple-800"
                          : ""
                      }
                      ${
                        order.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : ""
                      }
                      ${
                        order.status === "Pending Payment"
                          ? "bg-orange-100 text-orange-800"
                          : ""
                      }
                    `}>
                    {order.status}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="font-medium text-gray-700">Customer:</p>
                  <p className="text-gray-600 text-sm">
                    {order.address?.firstName} {order.address?.lastName}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {order.address?.phone}
                  </p>
                </div>

                <div className="mb-3">
                  <p className="font-medium text-gray-700">Address:</p>
                  <p className="text-gray-600 text-sm">
                    {order.address?.street}, {order.address?.city},{" "}
                    {order.address?.state}, {order.address?.zipcode},{" "}
                    {order.address?.country}
                  </p>
                </div>

                <div className="mb-3">
                  <p className="font-medium text-gray-700">Items:</p>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center text-sm text-gray-600 mt-1">
                      <img
                        src={item.product?.image[0]}
                        alt={item.product?.name}
                        className="w-8 h-8 rounded mr-2 object-cover"
                      />
                      <span>
                        {item.product?.name} x {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mb-3">
                  <p className="font-medium text-gray-700">
                    Amount:{" "}
                    <span className="text-gray-600">
                      ${order.amount.toFixed(2)}
                    </span>
                  </p>
                  <p className="font-medium text-gray-700">
                    Payment:{" "}
                    <span className="text-gray-600">
                      {order.paymentType} {order.isPaid ? "(Paid)" : "(Unpaid)"}
                    </span>
                  </p>
                  <p className="font-medium text-gray-700">
                    Placed On:{" "}
                    <span className="text-gray-600">
                      {format(new Date(order.createAt), "MMM d,PPPP")} at{" "}
                      {format(new Date(order.createAt), "h:mm a")}
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                  <div>
                    <label
                      htmlFor={`deliveryBoy-${order._id}`}
                      className="block text-sm font-medium text-gray-700 mb-1">
                      Assign Delivery Boy:
                    </label>
                    <select
                      id={`deliveryBoy-${order._id}`}
                      className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      value={order.deliveryBoyId || ""}
                      onChange={(e) =>
                        handleAssignDeliveryBoy(
                          order._id,
                          e.target.value || null
                        )
                      }>
                      <option value="">-- Unassigned --</option>
                      {deliveryBoys.map((db) => (
                        <option key={db._id} value={db._id}>
                          {db.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor={`orderStatus-${order._id}`}
                      className="block text-sm font-medium text-gray-700 mb-1">
                      Update Order Status:
                    </label>
                    <select
                      id={`orderStatus-${order._id}`}
                      className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      value={order.status}
                      onChange={(e) =>
                        handleUpdateOrderStatus(order._id, e.target.value)
                      }>
                      <option value="Processing">Processing</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;
