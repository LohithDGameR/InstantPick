import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Analytics = () => {
  const { axios, currency } = useAppContext();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/seller/analytics");
      if (data.success) {
        setAnalyticsData(data.data);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch analytics data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[95vh] text-green-700">
        <p className="text-xl animate-pulse">Loading Analytics...</p>
      </div>
    );
  }

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll p-4 md:p-10 bg-white fade-in">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-green-600 ml-2 relative mb-6 slide-down">
          📊 Sales Analytics
        </h2>

        {analyticsData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: "Total Products", value: analyticsData.totalProducts },
              { label: "Total Orders", value: analyticsData.totalOrders },
              {
                label: "Total Revenue",
                value: `${currency}${analyticsData.totalRevenue.toFixed(2)}`,
              },
              {
                label: "Products In Stock",
                value: analyticsData.productsInStock,
              },
              {
                label: "Products Out of Stock",
                value: analyticsData.productsOutOfStock,
              },
              { label: "Pending Orders", value: analyticsData.pendingOrders },
            ].map((item, index) => (
              <div
                key={item.label}
                className="bg-white rounded-lg shadow-md p-6 border border-green-100 slide-in-right"
                style={{ animationDelay: `${index * 0.1}s` }}>
                <h3 className="text-lg font-medium text-green-600 ml-2 relative mb-2">
                  {item.label}
                </h3>
                <p className="text-4xl font-bold text-gray-800">{item.value}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-10 fade-in">
            No analytics data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Analytics;
