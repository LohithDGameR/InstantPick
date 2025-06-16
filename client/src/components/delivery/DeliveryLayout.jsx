import React, { useRef, useEffect, useState, useCallback } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useDeliveryContext } from "../../context/DeliveryContext";
import { assets } from "../../assets/assets";
import { Menu, X } from "lucide-react";

const DeliveryLayout = () => {
  const { logoutDelivery, deliveryBoy } = useDeliveryContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside of it on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 text-base font-medium group hover:scale-105 transform ` +
    (isActive
      ? "bg-white text-green-800 shadow-lg"
      : "text-white/90 hover:bg-green-700 hover:text-white hover:shadow-md");

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-inter relative">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden cursor-pointer animate-fadeIn"
          onClick={toggleSidebar}></div>
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          bg-gradient-to-b from-green-800 to-green-600 shadow-xl border-r border-green-700 flex flex-col p-6 overflow-y-auto
          ${
            isSidebarOpen
              ? "fixed top-0 left-0 h-full w-64 z-50 transform translate-x-0 transition-transform duration-300 ease-in-out md:relative md:min-h-screen md:flex-shrink-0 md:z-auto"
              : "hidden md:relative md:flex md:w-64 md:min-h-screen md:flex-shrink-0"
          }
        `}>
        {/* Close button for mobile sidebar */}
        <button
          onClick={toggleSidebar}
          className="md:hidden absolute top-4 right-4 text-white hover:text-gray-200 focus:outline-none transition-colors duration-200 hover:scale-110 transform"
          aria-label="Close menu">
          <X size={28} />
        </button>

        {/* Logo Section */}
        <div className="text-center mb-8 mt-4 md:mt-0 animate-slideDown">
          <div className="mb-2">
            <img
              src={assets.logo}
              alt="logo"
              className="h-12 md:h-14 w-auto object-contain mx-auto hover:scale-110 transform transition-transform duration-200"
            />
          </div>
          <h1 className="text-xl font-bold text-white">InstantPick</h1>
          <p className="text-sm text-green-200 mt-1">Delivery Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-grow">
          <ul className="space-y-2">
            <li className="animate-slideInRight">
              <NavLink
                to="/delivery"
                end
                className={linkClasses}
                onClick={() => setIsSidebarOpen(false)}>
                <img
                  src={assets.dashboard_icon}
                  alt="Dashboard"
                  className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200"
                />
                Dashboard
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="mt-auto pt-6 border-t border-green-700 animate-slideUp">
          <button
            onClick={logoutDelivery}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-600 text-white rounded-md shadow-lg hover:bg-red-700 hover:scale-105 transform transition-all duration-200 font-medium">
            <img src={assets.logout_icon} alt="Logout" className="w-5 h-5" />
            Logout
          </button>
          {deliveryBoy && (
            <p className="text-center text-xs text-green-200 mt-3 animate-fadeIn">
              Logged in as:{" "}
              <span className="font-medium text-white">{deliveryBoy.name}</span>
            </p>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden md:ml-0">
        {/* Header */}
        <header className="bg-white backdrop-blur-sm border-b border-gray-200 shadow-sm px-4 py-4 flex justify-between items-center animate-slideDown sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Hamburger menu button for mobile */}
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 focus:outline-none hover:scale-110 transform transition-all duration-200"
              aria-label="Open menu">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-green-600 hidden sm:block">
              Delivery Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-800 font-medium">
              Hi, {deliveryBoy?.name || "Delivery Partner"} 👋
            </p>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 animate-fadeIn">
          <Outlet />
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DeliveryLayout;
