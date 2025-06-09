import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const MainBanner = () => {
  return (
    // Outer container:
    // - relative: for absolute positioning of children.
    // - w-full: takes full width.
    // - rounded-lg: corner radius.
    // - min-h-[250px] for a base height (mobile).
    // - aspect-video: maintains a 16:9 aspect ratio (height proportional to width).
    //   This is crucial for consistency across various screen widths.
    // - ADJUSTED: Reduced min-h values for sm, md, lg breakpoints to make it slightly shorter on larger screens.
    <div className="relative w-full overflow-hidden min-h-[250px] sm:min-h-[300px] md:min-h-[380px] lg:min-h-[420px] aspect-video rounded-lg">
      
      {/* Background Image */}
      {/* - absolute inset-0: covers the entire parent div.
        - w-full h-full: ensures image fills the container.
        - object-cover: scales the image to cover the entire container while maintaining its aspect ratio.
        - object-right: Prioritizes showing the right side of the image (where the vegetables are) as it scales.
        - z-0: ensures it stays in the background.
      */}
      <img
        src={assets.main_banner_bg}
        alt="banner background"
        className="absolute inset-0 w-full h-full object-cover object-right z-0" 
      />

      {/* Overlay for content */}
      {/* - absolute inset-0: covers the entire banner.
        - flex, flex-col: for vertical stacking.
        - items-center md:items-start: centers content horizontally on mobile, left-aligns on desktop.
        - justify-center: vertically centers content.
        - p-3 sm:p-6 md:p-8 lg:p-12 xl:pl-24: Padding for content spacing, adjusted for mobile.
        - bg-black/10: subtle dark overlay for text readability.
        - z-10: ensures content is above the image.
      */}
      <div className="absolute inset-0 flex flex-col items-center md:items-start justify-center text-center md:text-left z-10 p-3 sm:p-6 md:p-8 lg:p-12 xl:pl-24 bg-black/10">
        
        {/* Main Heading */}
        {/* - text-xl to xl:text-5xl: Font scaling, starting smaller on mobile.
          - max-w-xs to xl:max-w-2xl: Responsive max-width for text to control line breaks.
          - font-bold, leading-snug/tight/normal: font styles.
          - text-balance: CSS property to balance lines of text.
          - drop-shadow-lg: visual effect for readability.
          - text-white: ensures text is visible on the dark overlay.
        */}
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl leading-snug md:leading-tight lg:leading-normal text-balance drop-shadow-lg text-white">
          Freshness You Can Trust, Savings You Can Love!
        </h1>

        {/* Buttons Container */}
        {/* - flex flex-col sm:flex-row: stacks buttons vertically on mobile, side-by-side on small screens and up.
          - items-center: vertically aligns items in flex container.
          - gap-3 sm:gap-4: Gap between buttons, reduced for mobile.
          - mt-4: top margin.
        */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-4">
          {/* Shop now button */}
          {/* - px-5 py-2 sm:px-7 sm:py-3.5: Padding for buttons, adjusted for mobile.
            - text-base sm:text-lg: Font size for buttons, adjusted for mobile.
            - bg-primary hover:bg-primary-dull: color.
            - rounded-md, text-white, font-semibold, whitespace-nowrap, shadow-md: styling.
          */}
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
          {/* - Same padding and font size adjustments as the first button.
            - border-2 border-white: initial white border.
            - hover:border-primary hover:bg-white: hover effects.
            - text-white hover:text-primary: text color changes.
          */}
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