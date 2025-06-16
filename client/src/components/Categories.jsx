import React, { useRef, useEffect, useState, useCallback } from "react";
import { categories } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Categories = () => {
  const { navigate } = useAppContext();
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const scrollSpeedRef = useRef(0.5); // Controls auto-scroll speed

  // States for manual drag scroll functionality (mouse and touch)
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // --- Auto-Scrolling Logic ---
  useEffect(() => {
    const container = scrollRef.current;
    let animationFrameId;

    const scroll = () => {
      // Auto-scroll only if not hovered AND not currently dragging manually
      if (container && !isHovered && !isDragging) {
        container.scrollLeft += scrollSpeedRef.current;

        // Reset when end is reached to create a continuous loop
        if (
          Math.ceil(container.scrollLeft + container.clientWidth) >=
          container.scrollWidth
        ) {
          container.scrollLeft = 0;
        }
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll); // Start auto-scroll on mount

    return () => cancelAnimationFrame(animationFrameId); // Clean up on unmount
  }, [isHovered, isDragging]); // Depend on isHovered and isDragging to control auto-scroll

  // --- Manual Drag Scroll Event Handlers (Mouse) ---
  const handleMouseDown = useCallback((e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    // Apply grabbing cursor directly to the container for immediate feedback
    scrollRef.current.style.cursor = "grabbing";
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !scrollRef.current) return;
      e.preventDefault(); // Prevent default browser drag behaviors (e.g., image selection)
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX) * 1.5; // Adjust scroll speed for manual drag
      scrollRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grab"; // Revert cursor to grab
    }
  }, []);

  // --- Combined Mouse Leave Handler for Auto-scroll and Dragging ---
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false); // Resume auto-scroll
    // If dragging stops because mouse left the container, reset drag state
    if (isDragging) {
      setIsDragging(false);
      if (scrollRef.current) {
        scrollRef.current.style.cursor = "grab"; // Revert cursor
      }
    }
  }, [isDragging]); // setIsHovered is a setter, so it's stable and doesn't need to be a dependency.

  // --- Touch Event Handlers (for Mobile/Tablet) ---
  const handleTouchStart = useCallback((e) => {
    if (!scrollRef.current || e.touches.length === 0) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  }, []);

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging || !scrollRef.current || e.touches.length === 0) return;
      // e.preventDefault(); // Prevent vertical scrolling interference if needed, but often not
      const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX) * 1.5;
      scrollRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="mt-16 relative">
      <p className="text-2xl md:text-3xl font-medium mb-6 text-center text-gray-800">
        Explore Our <span className="text-primary">Categories</span>
      </p>

      <div
        ref={scrollRef}
        className="flex overflow-x-scroll no-scrollbar gap-6 py-2 px-4 scroll-smooth cursor-grab"
        onMouseEnter={() => setIsHovered(true)}
        // Attach the combined mouse leave handler
        onMouseLeave={handleMouseLeave}
        // Attach manual scrolling event handlers
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}>
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex-none w-40 sm:w-48 group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center text-center shadow-sm hover:shadow-md hover:scale-108 transition-all duration-300"
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              window.scrollTo(0, 0);
            }}>
            <img
              src={category.image}
              alt={category.text}
              className="group-hover:scale-108 transition-transform duration-300 max-w-28 mb-2"
            />
            <p className="text-base font-medium text-gray-800">
              {category.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
