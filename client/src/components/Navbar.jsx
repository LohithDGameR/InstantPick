import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    setSearchQuery,
    searchQuery,
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
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery, navigate]);

  const navLinkClasses = `text-gray-100 hover:text-white font-medium relative transition-colors duration-200 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-white after:left-0 after:bottom-[-4px] hover:after:w-full after:transition-all after:duration-300`;

  return (
    <nav className="w-full bg-gradient-to-b from-green-800 to-green-600 px-4 md:px-10 lg:px-16 flex items-center justify-between shadow-sm relative">
      {/* Logo */}
      <NavLink to="/" onClick={() => setOpen(false)}>
        <img
          src={assets.logo}
          alt="Logo"
          className="h-18 w-auto object-contain"
        />
      </NavLink>

      {/* Desktop Nav */}
      <div className="hidden sm:flex items-center gap-6">
        <NavLink to="/" className={navLinkClasses}>
          Home
        </NavLink>
        <NavLink to="/products" className={navLinkClasses}>
          Products
        </NavLink>
        <NavLink to="/" className={navLinkClasses}>
          Contact
        </NavLink>
        {/* Wallet Link */}
        <NavLink to="/wallet" className={navLinkClasses}>
          <div className="flex items-center gap-1">
            <img src={assets.wallet_icon_white} alt="Wallet" className="w-5 h-5" />
            <span>Wallet Balance: {currency}{walletBalance.toFixed(2)}</span>
          </div>
        </NavLink>

        <div className="hidden lg:flex items-center bg-white rounded-full px-4 py-1 border border-green-300">
          <input
            type="text"
            placeholder="Search veggies..."
            className="outline-none text-sm bg-transparent w-40 text-gray-700"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <img
            src={assets.search_icon}
            alt="Search"
            className="w-4 h-4 ml-2 opacity-70"
          />
        </div>

        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer">
          <img src={assets.nav_cart_icon_white} alt="Cart" className="w-6 hover:scale-110" />
          <span className="absolute -top-2 -right-2 bg-cart text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
            {getCartCount()}
          </span>
        </div>

        {!user ? (
          <button
            onClick={() => setShowUserLogin(true)}
            className="bg-white text-green-600 px-5 py-1.5 rounded-full font-semibold hover:bg-green-100 transition cursor-pointer">
            Login
          </button>
        ) : (
          <div className="relative group">
            <img
              src={assets.profile_icon}
              className="w-10 rounded-full border-2 border-white cursor-pointer shadow-md"
              alt="profile"
            />
            <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow-xl border border-gray-200 py-2 w-36 rounded-lg text-sm text-gray-800 z-40 animate-fade-in">
              <li
                onClick={() => {
                  navigate("/seller");
                  setOpen(false);
                }}
                // Removed flex items-center gap-2 as icon is removed
                className="p-2 pl-4 hover:bg-green-50 cursor-pointer">
                {/* Removed img tag for orders_icon */}
                Admin Dashboard
              </li>
              <li
                onClick={() => {
                  navigate("/my-orders");
                  setOpen(false);
                }}
                // Removed flex items-center gap-2 as icon is removed
                className="p-2 pl-4 hover:bg-green-50 cursor-pointer">
                {/* Removed img tag for orders_icon */}
                My Orders
              </li>
              <li
                onClick={() => {
                  navigate("/wallet");
                  setOpen(false);
                }}
                // Removed flex items-center gap-2 as icon is removed
                className="p-2 pl-4 hover:bg-green-50 cursor-pointer">
                {/* Removed img tag for orders_icon */}
                My Wallet
              </li>
              <li
                onClick={logout}
                // Changed text color to red and removed flex items-center gap-2 as icon is removed
                className="p-2 pl-4 hover:bg-red-50 cursor-pointer text-red-600">
                {/* Removed img tag for logout_icon */}
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>


      {/* Mobile Controls */}
      <div className="flex sm:hidden items-center gap-4">
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer">
          <img src={assets.nav_cart_icon_white} alt="Cart" className="w-6 hover:scale-110" />
          <span className="absolute -top-2 -right-2 bg-cart text-black text-xs w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
            {getCartCount()}
          </span>
        </div>
        <button onClick={() => setOpen(!open)} aria-label="Menu">
          <img
            src={open ? assets.close_icon_white : assets.menu_icon}
            alt="Toggle menu"
            className="w-6 cursor-pointer"
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-green-200 sm:hidden flex flex-col gap-4 px-6 py-5 shadow-md z-50">
          <NavLink
            to="/"
            onClick={() => setOpen(false)}
            className="text-gray-900 hover:text-green-600 hover:underline transition-all duration-200">
            Home
          </NavLink>
          <NavLink
            to="/products"
            onClick={() => setOpen(false)}
            className="text-gray-700 hover:text-green-600 hover:underline transition-all duration-200">
            Products
          </NavLink>
          <NavLink
            to="/seller"
            onClick={() => setOpen(false)}
            className="text-gray-700 hover:text-green-600 hover:underline transition-all duration-200">
            Admin Dashboard
          </NavLink>
          {user && (
            <>
              <NavLink
                to="/my-orders"
                onClick={() => setOpen(false)}
                className="text-gray-700 hover:text-green-600 hover:underline transition-all duration-200">
                My Orders
              </NavLink>
              <NavLink
                to="/wallet"
                onClick={() => setOpen(false)}
                className="text-gray-700 hover:text-green-600 hover:underline transition-all duration-200">
                My Wallet
              </NavLink>
            </>
          )}
          <div className="flex items-center border border-green-200 px-4 py-2 rounded-full bg-green-50 mt-2">
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none w-full text-sm"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <img
              src={assets.search_icon}
              alt="Search"
              className="w-5 h-5 opacity-70 ml-2"
            />
          </div>
          {!user ? (
            <button
              onClick={() => {
                setShowUserLogin(true);
                setOpen(false);
              }}
              className="w-full bg-green-600 text-white py-2 rounded-full font-medium mt-3 cursor-pointer">
              Login
            </button>
          ) : (
            <button
              onClick={logout}
              className="w-full bg-red-500 text-white py-2 rounded-full font-medium mt-3 cursor-pointer">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
