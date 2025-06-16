import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    setSearchQuery,
    searchQuery, // <--- Make sure you are destructing searchQuery from useAppContext()
    getCartCount,
    axios,
    walletBalance,
    currency,
  } = useAppContext();

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate("/");
        setIsMobileMenuOpen(false); // Close mobile menu on logout
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Effect to navigate to products page when search query is entered
  useEffect(() => {
    // Only navigate if searchQuery has a value and it's not just whitespace
    if (searchQuery && searchQuery.trim().length > 0) {
      navigate("/products");
    }
  }, [searchQuery, navigate]); // <--- Corrected: depend on 'searchQuery' state

  // Common Tailwind CSS classes for navigation links
  const baseNavLinkClasses = `text-gray-200 hover:text-white font-medium relative
                            transition-all duration-300 ease-in-out
                            after:content-[''] after:absolute after:w-0 after:h-[2px]
                            after:bg-white after:left-0 after:bottom-[-4px]
                            hover:after:w-full after:transition-all after:duration-300
                            transform hover:scale-105`;

  return (
    <nav className="w-full bg-gradient-to-b from-green-800 to-green-600 px-4 md:px-10 lg:px-16 flex items-center justify-between shadow-md h-20 relative z-50">
      {/* Logo */}
      <NavLink
        to="/"
        onClick={() => setIsMobileMenuOpen(false)}
        className="transform hover:scale-105 transition-transform duration-200 py-2"
      >
        <img
          src={assets.logo}
          alt="GreenGrocer Logo"
          className="h-16 w-auto object-contain filter brightness-110"
        />
      </NavLink>

      {/* Desktop Navigation Links and Controls */}
      <div className="hidden sm:flex items-center gap-6">
        <NavLink to="/" className={baseNavLinkClasses}>
          Home
        </NavLink>
        <NavLink to="/products" className={baseNavLinkClasses}>
          Products
        </NavLink>
        <NavLink to="/contact-us" className={baseNavLinkClasses}>
          Contact Us
        </NavLink>

        {/* Wallet Link */}
        <NavLink
          to="/wallet"
          className={`${baseNavLinkClasses} flex items-center gap-2 px-3 py-1.5 rounded-full
                      bg-green-700/30 backdrop-blur-sm border border-green-500/20
                      hover:bg-green-600/40 transition-all duration-300`}
        >
          <img
            src={assets.wallet_icon_white}
            alt="Wallet"
            className="w-4 h-4 opacity-90"
          />
          <span className="text-sm">
            <span className="text-gray-300">Balance:</span>
            <span className="text-white font-bold ml-1">
              {currency}
              {walletBalance.toFixed(2)}
            </span>
          </span>
        </NavLink>

        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex items-center bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 border border-green-300/50 shadow-md hover:shadow-lg transition-all duration-300 hover:bg-white focus-within:ring-2 focus-within:ring-green-400/50">
          <input
            type="text"
            placeholder="Search veggies..."
            className="outline-none text-sm bg-transparent w-40 text-gray-700 placeholder-gray-500"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery} // Add value prop to input to control it
          />
          <img
            src={assets.search_icon}
            alt="Search"
            className="w-4 h-4 ml-2 opacity-60 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
          />
        </div>

        {/* Cart Icon - Desktop */}
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer transform hover:scale-110 transition-all duration-200 group"
        >
          <img
            src={assets.nav_cart_icon_white}
            alt="Cart"
            className="w-6 filter brightness-110"
          />
          <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform duration-200 border-2 border-white">
            {getCartCount()}
          </span>
        </div>

        {/* User Authentication Buttons/Profile */}
        {!user ? (
          <button
            onClick={() => {
              setShowUserLogin(true);
              setIsMobileMenuOpen(false); // Close mobile menu if login is clicked while open
            }}
            className="bg-white text-green-700 px-6 py-2 rounded-full font-semibold
                       hover:bg-green-50 hover:text-green-800 transition-all duration-300
                       cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105
                       border-2 border-transparent hover:border-green-200"
          >
            Login
          </button>
        ) : (
          <div className="relative group z-50">
            <img
              src={assets.profile_icon}
              className="w-10 h-10 rounded-full border-3 border-white cursor-pointer
                         shadow-lg hover:shadow-xl transition-all duration-300
                         transform hover:scale-105 ring-2 ring-green-400/30"
              alt="Profile"
            />
            <ul
              className="invisible group-hover:visible opacity-0 group-hover:opacity-100
                          absolute top-12 right-0 bg-white shadow-2xl border border-gray-200
                          py-2 w-40 rounded-xl text-sm z-50 transition-all duration-200
                          transform origin-top-right scale-95 group-hover:scale-100"
            >
              <li
                onClick={() => {
                  navigate("/my-orders");
                  setIsMobileMenuOpen(false);
                }}
                className="px-4 py-2.5 hover:bg-green-50 cursor-pointer text-gray-700
                           hover:text-green-700 transition-all duration-200 font-medium"
              >
                My Orders
              </li>
              <li
                onClick={() => {
                  navigate("/wallet");
                  setIsMobileMenuOpen(false);
                }}
                className="px-4 py-2.5 hover:bg-green-50 cursor-pointer text-gray-700
                           hover:text-green-700 transition-all duration-200 font-medium"
              >
                My Wallet
              </li>
              <li
                onClick={logout}
                className="px-4 py-2.5 hover:bg-red-50 cursor-pointer text-red-600
                           hover:text-red-700 transition-all duration-200 font-medium"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Controls (Cart & Hamburger) */}
      <div className="flex sm:hidden items-center gap-4">
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer transform hover:scale-110 transition-all duration-200 group"
        >
          <img
            src={assets.nav_cart_icon_white}
            alt="Cart"
            className="w-6 filter brightness-110"
          />
          <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform duration-200 border-2 border-white">
            {getCartCount()}
          </span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          className="transform hover:scale-110 transition-all duration-200 p-1"
        >
          <img
            src={isMobileMenuOpen ? assets.close_icon_white : assets.menu_icon}
            alt={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="w-6 cursor-pointer filter brightness-110"
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-md
                        border-t border-green-200/50 sm:hidden flex flex-col gap-4
                        px-6 py-6 shadow-xl z-40 transform translate-y-0
                        transition-all duration-300 animate-slide-down"
        >
          <NavLink
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-gray-800 hover:text-green-600 hover:pl-2 transition-all
                       duration-300 font-medium py-1 border-l-3 border-transparent
                       hover:border-green-500"
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-gray-700 hover:text-green-600 hover:pl-2 transition-all
                       duration-300 font-medium py-1 border-l-3 border-transparent
                       hover:border-green-500"
          >
            Products
          </NavLink>
          {user && (
            <>
              <NavLink
                to="/my-orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-green-600 hover:pl-2 transition-all
                           duration-300 font-medium py-1 border-l-3 border-transparent
                           hover:border-green-500"
              >
                My Orders
              </NavLink>
              <NavLink
                to="/wallet"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-green-600 hover:pl-2 transition-all
                           duration-300 font-medium py-1 border-l-3 border-transparent
                           hover:border-green-500"
              >
                <div className="flex items-center gap-2">
                  <span>My Wallet</span>
                  <span className="text-green-600 font-bold text-sm">
                    {currency}
                    {walletBalance.toFixed(2)}
                  </span>
                </div>
              </NavLink>
            </>
          )}
          {/* Search Bar - Mobile */}
          <div className="flex items-center border border-green-300/50 px-4 py-3 rounded-full
                          bg-green-50/80 backdrop-blur-sm mt-2 focus-within:ring-2
                          focus-within:ring-green-400/50 transition-all duration-300"
          >
            <input
              type="text"
              placeholder="Search veggies..."
              className="bg-transparent outline-none w-full text-sm text-gray-700
                         placeholder-gray-500"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery} // Add value prop to input to control it
            />
            <img
              src={assets.search_icon}
              alt="Search"
              className="w-5 h-5 opacity-60 ml-2 hover:opacity-80 transition-opacity duration-200"
            />
          </div>
          {!user ? (
            <button
              onClick={() => {
                setShowUserLogin(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3
                         rounded-full font-semibold mt-3 cursor-pointer shadow-md
                         hover:shadow-lg transition-all duration-300
                         transform hover:scale-[1.02]"
            >
              Login
            </button>
          ) : (
            <button
              onClick={logout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3
                         rounded-full font-semibold mt-3 cursor-pointer shadow-md
                         hover:shadow-lg transition-all duration-300
                         transform hover:scale-[1.02]"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;