import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

const AllProducts = () => {
  const { allProducts, searchQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredProducts(
        allProducts.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(allProducts);
    }
  }, [allProducts, searchQuery]);

  return (
    <div className="mt-16 flex flex-col max-w-7xl mx-auto px-4 md:px-6">
      {/* Page Title */}
      <div className="flex flex-col items-start w-max animate-products-fade-in">
        <p className="text-3xl md:text-4xl font-semibold text-black">
          All <span className="text-green-600">Products</span>
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full mt-2"></div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6 animate-products-scale-in">
        {filteredProducts
          .filter((product) => product.inStock)
          .map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
      </div>

      {/* No Products Message */}
      {filteredProducts.filter((product) => product.inStock).length === 0 && (
        <div className="flex items-center justify-center h-[60vh] animate-products-fade-in">
          <p className="text-2xl font-medium text-gray-500">
            No products available at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
