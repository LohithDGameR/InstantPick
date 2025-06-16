import React, { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ProductList = () => {
  // Now fetchProducts refers to fetchSellerProducts from context
  const {
    products,
    currency,
    axios,
    fetchSellerProducts,
    fetchAllProducts,
    isSeller,
    sellerData,
    setProducts,
  } = useAppContext(); // Added fetchAllProducts

  useEffect(() => {
    if (isSeller && sellerData) {
      fetchSellerProducts(); // Calls the seller-specific product list for admin dashboard
    } else {
      setProducts([]); // Clear products if not logged in or logged out
    }
  }, [isSeller, sellerData, fetchSellerProducts, setProducts]);

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post("/api/product/stock", { id, inStock });
      if (data.success) {
        fetchSellerProducts(); // Re-fetch seller products to update admin list
        fetchAllProducts(); // CRUCIAL FIX: Re-fetch ALL products to update public list
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-green-600 ml-2 relative mb-6">
          🌱 My Products
        </h2>

        <div className="overflow-x-auto rounded-lg border border-green-200 shadow-md bg-white">
          <table className="min-w-full divide-y divide-green-100">
            <thead className="bg-green-100 text-green-800 text-sm font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">
                  Selling Price
                </th>
                <th className="px-4 py-3 text-left">In Stock</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-green-100 text-green-800 text-sm">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-4 py-3 flex items-center gap-3">
                      <div className="w-16 h-16 overflow-hidden border border-green-200 rounded-md">
                        <img
                          src={product.image[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="truncate font-medium">
                        {product.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 capitalize">{product.category}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-green-700 font-medium">
                        {currency}
                        {product.offerPrice}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={product.inStock}
                          onChange={() =>
                            toggleStock(product._id, !product.inStock)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-12 h-7 bg-green-200 peer-focus:outline-none peer-checked:bg-green-600 rounded-full transition duration-300"></div>
                        <div className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-5"></div>
                      </label>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No products added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
