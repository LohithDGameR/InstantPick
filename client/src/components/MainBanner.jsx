import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const MainBanner = () => {
  return (
    
    <div className="relative w-full overflow-hidden min-h-[250px] sm:min-h-[350px] md:min-h-[450px] lg:min-h-[500px] pt-8 pb-12 md:p-0 rounded-lg">
      
      <img
        src={assets.main_banner_bg}
        alt="banner background"
        className="absolute inset-0 w-full h-full object-cover object-right-bottom z-0" // object-right-bottom to ensure veggies are visible
      />

      
      <div className="absolute inset-0 flex flex-col items-center md:items-start justify-center text-center md:text-left z-10 p-4 sm:p-6 md:p-8 lg:p-12 xl:pl-24 bg-black/10">
        
        <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl leading-snug md:leading-tight lg:leading-normal text-balance drop-shadow-lg">
          Freshness You Can Trust, Savings You will Love!
        </h1>

        
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4"> 
          {/* Shop now button */}
          <Link
            to={"/products"}
            className="group flex items-center justify-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 bg-primary hover:bg-primary-dull transition rounded-md text-white font-semibold text-lg whitespace-nowrap shadow-md hover:shadow-lg"
          >
            Shop now
            {/* Arrow icon always visible, styled for hover */}
            <img
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              src={assets.white_arrow_icon}
              alt="arrow"
            />
          </Link>

          {/* Explore deals button */}
          <Link
            to={"/products"}
            className="group flex items-center justify-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 border-2 hover:border-white hover:bg-white transition rounded-md font-semibold text-lg whitespace-nowrap shadow-md hover:shadow-lg"
          >
            Explore deals
            {/* Arrow icon always visible, styled for hover */}
            <img
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              src={assets.black_arrow_icon} // Use white arrow for consistency
              alt="arrow"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;