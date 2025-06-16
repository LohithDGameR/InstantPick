import React, { useEffect, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import { categories } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductCategory = () => {
  const { allProducts } = useAppContext();
  const { category } = useParams();

  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.classList.add("fade-in-up");
    }
  }, [category]);

  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category
  );

  const filteredProducts = allProducts.filter(
    (product) => product.category.toLowerCase() === category
  );

  return (
    <div
      ref={containerRef}
      className="mt-16 opacity-0 translate-y-5 transition-all duration-700 ease-out">
      {searchCategory && (
        <div className="flex flex-col items-end w-max">
          <p className="text-3xl md:text-4xl font-semibold text-green-600 ml-2 relative">
            {searchCategory.text.toUpperCase()}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full mt-2" />
        </div>
      )}

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-2xl font-medium text-gray-700">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
