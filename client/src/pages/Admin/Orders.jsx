import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";

const Orders = () => {
  const { currency, axios } = useAppContext();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/seller");
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message); // Displays error message from backend or network
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* H2 heading styling */}
        <h2 className="text-2xl font-semibold text-green-800 mb-6">📦Orders List</h2>

        <div className="space-y-4 py-2">
          {orders.map((order, index) => (
            <div
              key={order._id || index} // Use unique ID if available, fallback to index
              
              className="flex flex-col md:items-center md:flex-row gap-3 md:gap-5 justify-between
                         py-4 px-4 bg-white rounded-md border border-green-100 shadow-md // Individual card styling
                         text-green-800 text-sm md:text-base // Apply base text styles here
                         "
            >
              {/* --- Product Items Section --- */}
              <div className="flex gap-3 md:gap-5 items-center min-w-[200px] md:min-w-[220px] lg:min-w-[250px]">
                <img
                  className="w-12 h-12 object-cover rounded-md border border-green-200"
                  src={assets.box_icon}
                  alt="boxIcon"
                />
                <div>
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex flex-col">
                      <p className="font-medium">
                        {item.product?.name}{" "}
                        <span className="text-primary">x {item.quantity}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* --- Address Details Section --- */}
              <div className="flex-1 min-w-[150px] md:min-w-[180px] text-green-700">
                <p className="text-green-800 font-medium">
                  {order.address?.firstName} {order.address?.lastName}
                </p>
                <p>
                  {order.address?.street}, {order.address?.city}
                </p>
                <p>
                  {order.address?.state}, {order.address?.zipcode},{" "}
                  {order.address?.country}
                </p>
                <p>{order.address?.phone}</p>
              </div>

              {/* --- Order Amount Section --- */}
              <p className="font-semibold text-lg my-auto text-green-800 min-w-[80px] text-right">
                {currency}
                {order.amount}
              </p>

              {/* --- Payment/Method/Date Details Section --- */}
              <div className="flex flex-col min-w-[120px] text-green-700 text-right md:text-left">
                <p>Method: {order.paymentType}</p>
                <p>Date: {order.createAt ? new Date(order.createAt).toLocaleDateString() : 'N/A'}</p>
                <p>Payment: {order.isPaid ? <span className="text-green-600 font-medium">Paid</span> : <span className="text-orange-500 font-medium">Pending</span>}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;