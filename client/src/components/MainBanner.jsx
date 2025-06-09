import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const MainBanner = () => {
  return (
    <div className="relative w-full overflow-hidden min-h-[250px] aspect-video
      sm:min-h-[300px] md:min-h-[380px] lg:min-h-[450px] xl:min-h-[500px]
      max-h-[600px] rounded-lg">
      <img
        src={assets.main_banner_bg}
        alt="banner background"
        className="absolute inset-0 w-full h-full object-cover object-right z-0" 
      />

      <div className="absolute inset-0 flex flex-col items-center md:items-start justify-center text-center md:text-left z-10 p-3 sm:p-6 md:p-8 lg:p-12 xl:pl-24 bg-black/10">
        
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl leading-snug md:leading-tight lg:leading-normal text-balance drop-shadow-lg text-white">
          Freshness You Can Trust, Savings You Can Love!
        </h1>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-4">
          {/* Shop now button */}
          <Link
            to={"/products"}
            className="group flex items-center justify-center gap-2 px-5 py-2 sm:px-7 sm:py-3.5 bg-primary hover:bg-primary-dull transition rounded-md text-white font-semibold text-base sm:text-lg whitespace-nowrap shadow-md hover:shadow-lg"
          >
            Shop now
            <img
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              src={assets.white_arrow_icon}
              alt="arrow"
            />
          </Link>

          {/* Explore deals button */}
          <Link
            to={"/products"}
            className="group flex items-center justify-center gap-2 px-5 py-2 sm:px-7 sm:py-3.5 border-2 border-white hover:border-primary hover:bg-white transition rounded-md font-semibold text-base sm:text-lg whitespace-nowrap shadow-md hover:shadow-lg text-white hover:text-primary"
          >
            Explore deals
            <img
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              src={assets.white_arrow_icon}
              alt="arrow"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;