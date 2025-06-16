// src/pages/delivery/DeliveryDashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useDeliveryContext } from "../../context/DeliveryContext";
import { format } from "date-fns";
import toast from "react-hot-toast";

const DeliveryDashboard = () => {
  const { deliveryBoy, axios } = useDeliveryContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssignedOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get("/api/delivery/orders");
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
      console.error(
        "Error fetching assigned orders:",
        err.response?.data?.message || err.message
      );
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await axios.post("/api/delivery/update-status", {
        orderId,
        status: newStatus,
      });
      if (data.success) {
        toast.success("Order status updated successfully!");
        // Optimistically update the UI to reflect the new status AND isPaid if Delivered
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status: newStatus,
                  // If the new status is 'Delivered', set isPaid to true in UI
                  isPaid: newStatus === "Delivered" ? true : order.isPaid,
                }
              : order
          )
        );
      } else {
        toast.error(data.message || "Failed to update status.");
      }
    } catch (err) {
      console.error(
        "Error updating order status:",
        err.response?.data?.message || err.message
      );
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while updating status."
      );
    }
  };

  // New function to handle marking as Delivered
  const handleMarkAsDelivered = async (orderId) => {
    if (
      window.confirm(
        "Are you sure you want to mark this order as 'Delivered'? This action cannot be undone."
      )
    ) {
      await handleStatusChange(orderId, "Delivered");
    }
  };

  useEffect(() => {
    if (deliveryBoy) {
      fetchAssignedOrders();
    }
  }, [deliveryBoy, fetchAssignedOrders]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] text-lg text-gray-600">
        Loading assigned orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[80vh] text-red-600 text-lg">
        <p>Error: {error}</p>
        <button
          onClick={fetchAssignedOrders}
          className="mt-4 px-6 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-green-600 ml-2 relative mb-6">
        Assigned Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md border border-green-200">
          <p className="text-xl text-gray-500">
            No orders currently assigned to you.
          </p>
          <p className="text-sm text-gray-400 mt-2">Check back later!</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-green-200">
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
                                              order.status ===
                                              "Out for Delivery"
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex flex-col gap-2">
                    <select
                      className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }>
                      <option value="Processing">Processing</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    {order.status !== "Delivered" && (
                      <button
                        onClick={() => handleMarkAsDelivered(order._id)}
                        className="mt-2 w-full bg-green-600 text-white py-2 px-3 rounded-md shadow-sm hover:bg-green-700 transition">
                        Mark as Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;
