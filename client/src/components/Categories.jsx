import React, { useRef, useEffect, useState, useCallback } from "react";
import { categories } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Categories = () => {
  const { navigate } = useAppContext();
  const scrollRef = useRef(null); // Reference to the scrollable container

  // States for automatic scrolling
  const [isHovered, setIsHovered] = useState(false); // True when mouse is over container
  const scrollSpeedRef = useRef(0.5); // Controls automatic scroll speed

  // States for manual drag scroll functionality
  const [isDragging, setIsDragging] = useState(false); // True when the user is actively dragging
  const [startX, setStartX] = useState(0); // Stores the initial X position of the mouse/touch
  const [scrollLeft, setScrollLeft] = useState(0); // Stores the initial scrollLeft position of the container

  // --- Automatic Scrolling Logic ---
  useEffect(() => {
    const container = scrollRef.current;
    let animationFrameId;

    const scroll = () => {
      // Auto-scroll only if not hovered AND not currently dragging
      if (container && !isHovered && !isDragging) {
        container.scrollLeft += scrollSpeedRef.current;

        // Reset when end is reached
        // Added a small buffer (e.g., 1px) to prevent floating point issues with Math.ceil
        if (
          Math.ceil(container.scrollLeft + container.clientWidth) >=
          container.scrollWidth - 1 // -1 for a tiny buffer
        ) {
          container.scrollLeft = 0;
        }
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, isDragging]); // Dependency array includes isDragging to react to its changes

  // --- Manual Drag Scroll Event Handlers ---

  // handleMouseDown: Initiates the drag operation on mouse click
  const handleMouseDown = useCallback((e) => {
    if (!scrollRef.current) return;
    setIsDragging(true); // Set dragging to true
    // Calculate startX relative to the scroll container's left edge
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = 'grabbing'; // Change cursor
  }, []);

  // handleMouseMove: Scrolls the container while dragging
  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault(); // Prevent unwanted actions like text selection during drag
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Calculate how much to scroll based on mouse movement (1.5x speed multiplier)
    scrollRef.current.scrollLeft = scrollLeft - walk; // Update scroll position
  }, [isDragging, startX, scrollLeft]);

  // handleMouseUp: Ends the drag operation on mouse release
  const handleMouseUp = useCallback(() => {
    setIsDragging(false); // Set dragging to false
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab'; // Reset cursor
    }
  }, []);

  // handleMouseLeave: Ends the drag operation if the mouse leaves the container
  const handleMouseLeave = useCallback(() => {
    if (isDragging) { // Only reset if dragging was active when mouse left
      setIsDragging(false);
      if (scrollRef.current) {
        scrollRef.current.style.cursor = 'grab'; // Reset cursor
      }
    }
    setIsHovered(false); // Also handle mouse leave for auto-scroll pause
  }, [isDragging]);

  // --- Touch Event Handlers for Mobile Drag Scroll ---

  // handleTouchStart: Initiates the drag operation on touch start
  const handleTouchStart = useCallback((e) => {
    if (!scrollRef.current || e.touches.length === 0) return;
    setIsDragging(true); // Set dragging to true
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  }, []);

  // handleTouchMove: Scrolls the container while touching and dragging
  const handleTouchMove = useCallback((e) => {
    if (!isDragging || !scrollRef.current || e.touches.length === 0) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Adjust scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  // handleTouchEnd: Ends the drag operation on touch release
  const handleTouchEnd = useCallback(() => {
    setIsDragging(false); // Set dragging to false
  }, []);


  return (
    <div className="mt-16 relative">
      <p className="text-2xl md:text-3xl font-medium mb-6 text-center">
        Explore Our Categories
      </p>

      <div
        ref={scrollRef}
        // `overflow-x-scroll` allows native scrolling.
        // `no-scrollbar` hides the scrollbar (optional, but keeps clean look).
        // `scroll-smooth` makes programmatic scrolls (if any were added) smooth.
        // `cursor-grab` provides visual feedback that the element is draggable.
        className="flex overflow-x-scroll no-scrollbar gap-6 py-2 px-4 scroll-smooth cursor-grab"
        // Event handlers for automatic scrolling pause on hover
        onMouseEnter={() => setIsHovered(true)}
        // `onMouseLeave` is now combined with `handleMouseLeave` to avoid conflicts
        // onMouseLeave={() => setIsHovered(false)} // Removed, handled in handleMouseLeave
        // Attach manual drag scroll event listeners
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave} // This now also handles setting isHovered to false
        // Attach touch scroll event listeners for mobile devices
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex-none w-40 sm:w-48 group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center text-center shadow-sm hover:shadow-md hover:scale-108 transition-all duration-300"
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              window.scrollTo(0, 0); // Scrolls to the top of the page when navigating
            }}
          >
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