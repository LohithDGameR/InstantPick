import React, { useRef, useEffect, useState } from "react";
import { categories } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Categories = () => {
  const { navigate } = useAppContext();
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const scrollSpeedRef = useRef(0.5); // Controls speed

  useEffect(() => {
    const container = scrollRef.current;
    let animationFrameId;

    const scroll = () => {
      if (container && !isHovered) {
        container.scrollLeft += scrollSpeedRef.current;

        // Reset when end is reached
        if (
          Math.ceil(container.scrollLeft + container.clientWidth) >=
          container.scrollWidth
        ) {
          container.scrollLeft = 0;
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
        Explore Our Categories
      </p>

      <div
        ref={scrollRef}
        className="flex overflow-x-scroll no-scrollbar gap-6 py-2 px-4 scroll-smooth"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex-none w-40 sm:w-48 group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center text-center shadow-sm hover:shadow-md hover:scale-108 transition-all duration-300"
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              window.scrollTo(0, 0);
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
