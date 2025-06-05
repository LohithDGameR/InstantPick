import React, { useRef, useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";

const BestSeller = () => {
  const { products } = useAppContext();
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const scrollSpeedRef = useRef(0.5); // Adjust scroll speed here

  useEffect(() => {
    const container = scrollRef.current;
    let animationFrameId;

    const scroll = () => {
      if (container && !isHovered) {
        container.scrollLeft -= scrollSpeedRef.current;

        // Reset when scrolled to the start
        if (container.scrollLeft <= 0) {
          container.scrollLeft = container.scrollWidth - container.clientWidth;
        }
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  return (
    <div className="mt-16 relative">
      <p className="text-2xl md:text-3xl font-medium mb-6 text-center">
        Best Sellers
      </p>

      <div
        ref={scrollRef}
        className="flex overflow-x-scroll no-scrollbar gap-8 px-4 scroll-smooth"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {products
          .filter((product) => product.inStock)
          .slice(0, 20) // You can change the number of items
          .map((product, index) => (
            <div key={index} className="flex-none w-56">
              <ProductCard product={product} bestSeller={true}/>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BestSeller;
