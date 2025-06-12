import React, { useRef, useEffect, useState, useCallback } from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Import icons for navigation buttons

const BestSeller = () => {
  const { products } = useAppContext();
  const scrollContainerRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // States for manual drag scroll functionality
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const categories = ["All", ...new Set(products.map((product) => product.category))];

  const filteredProducts = products.filter((product) => {
    return (
      product.inStock &&
      (selectedCategory === "All" || product.category === selectedCategory)
    );
  });

  // Calculate the scroll amount for buttons (adjusted for desktop view, not mobile)
  const productCardWidth = 224; // Tailwind's w-56 in px
  const productGap = 32;       // Tailwind's gap-8 in px
  const productsPerPage = 5; // Used for desktop button jumps
  const scrollAmount = (productCardWidth + productGap) * productsPerPage;

  // --- Manual Drag Scroll Event Handlers ---
  const handleMouseDown = useCallback((e) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.cursor = 'grab';
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

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || !scrollContainerRef.current || e.touches.length === 0) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // --- Button-driven Scroll Functions ---
  const scrollNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollPrev = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [selectedCategory]);

  return (
    <div className="mt-16 relative">
      <p className="text-2xl md:text-3xl font-medium mb-6 text-center">
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
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="relative">
        {/* Left Scroll Button: Hidden on mobile (hidden) */}
        <button
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-green-700 text-white p-3 rounded-full shadow-lg hover:bg-green-800 focus:outline-none z-10 ml-2 transform active:scale-95 transition-transform hidden md:block"
          aria-label="Previous products"
        >
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
          onTouchEnd={handleTouchEnd}
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              // FIX: Changed default width from w-full to w-1/2.
              // Now, on all screen sizes below 'md', two cards will be visible.
              // md:w-56 takes over for medium screens and up.
              className="flex-none w-1/2 md:w-56"
            >
              <ProductCard product={product} bestSeller={true} />
            </div>
          ))}
        </div>

        {/* Right Scroll Button: Hidden on mobile (hidden) */}
        <button
          onClick={scrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-green-700 text-white p-3 rounded-full shadow-lg hover:bg-green-800 focus:outline-none z-10 mr-2 transform active:scale-95 transition-transform hidden md:block"
          aria-label="Next products"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default BestSeller;