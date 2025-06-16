import React, { useRef, useEffect, useState, useCallback } from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BestSeller = () => {
  // Using 'allProducts' for public view, which is the correct data source.
  const { allProducts } = useAppContext();
  const scrollContainerRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // States for manual drag scroll functionality
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Create categories from allProducts to ensure all available categories are listed.
  const categories = [
    "All",
    ...new Set(allProducts.map((product) => product.category)),
  ];

  // Filter products based on selected category and stock status.
  const filteredProducts = allProducts.filter((product) => {
    return (
      product.inStock && // Only show products that are in stock.
      (selectedCategory === "All" || product.category === selectedCategory) // Filter by selected category or show all.
    );
  });

  // Define dimensions for scroll calculation.
  const productCardWidth = 224; // Corresponds to Tailwind's w-56.
  const productGap = 32; // Corresponds to Tailwind's gap-8.
  const productsPerPage = 5; // Defines how many products to jump on button click (for desktop).
  const scrollAmount = (productCardWidth + productGap) * productsPerPage;

  // --- Manual Drag Scroll Event Handlers (for mouse) ---
  const handleMouseDown = useCallback((e) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = "grabbing"; // Change cursor to grabbing when dragging.
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !scrollContainerRef.current) return;
      e.preventDefault(); // Prevent text selection or other default browser behaviors.
      const x = e.pageX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startX) * 1.5; // Adjust scroll speed.
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grab"; // Revert cursor to grab.
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.cursor = "grab"; // Revert cursor if mouse leaves while dragging.
      }
    }
  }, [isDragging]);

  // --- Touch Event Handlers for Mobile Drag Scroll ---
  const handleTouchStart = useCallback((e) => {
    if (!scrollContainerRef.current || e.touches.length === 0) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  }, []);

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging || !scrollContainerRef.current || e.touches.length === 0)
        return;
      const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startX) * 1.5; // Adjust scroll speed for touch.
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // --- Button-driven Scroll Functions ---
  const scrollNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth", // Smooth scroll animation.
      });
    }
  };

  const scrollPrev = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth", // Smooth scroll animation.
      });
    }
  };

  // Reset scroll position when category changes.
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [selectedCategory]);

  return (
    <div className="mt-16 relative">
      <p className="text-2xl md:text-3xl font-medium mb-6 text-center text-gray-800">
        Best Sellers
      </p>

      {/* Category Selection Buttons */}
      <div className="flex justify-center flex-wrap gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
              ${
                selectedCategory === category
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-green-100 text-green-800 hover:bg-green-200"
              }`}>
            {category}
          </button>
        ))}
      </div>

      <div className="relative">
        {/* Left Scroll Button: Hidden on mobile (hidden) */}
        <button
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-green-700 text-white p-3 rounded-full shadow-lg hover:bg-green-800 focus:outline-none z-10 ml-2 transform active:scale-95 transition-transform hidden md:block"
          aria-label="Previous products">
          <ChevronLeft size={24} />
        </button>

        {/* Product Display Area */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-scroll no-scrollbar gap-8 px-4 scroll-smooth cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                // Applied the style: w-1/2 on small screens, md:w-56 on medium and up.
                className="flex-none w-1/2 md:w-56">
                <ProductCard product={product} bestSeller={true} />
              </div>
            ))
          ) : (
            <div className="w-full text-center py-8 text-gray-500">
              No best-selling products found in this category.
            </div>
          )}
        </div>

        {/* Right Scroll Button: Hidden on mobile (hidden) */}
        <button
          onClick={scrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-green-700 text-white p-3 rounded-full shadow-lg hover:bg-green-800 focus:outline-none z-10 mr-2 transform active:scale-95 transition-transform hidden md:block"
          aria-label="Next products">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default BestSeller;
