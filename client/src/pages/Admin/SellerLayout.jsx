import React, { useRef, useEffect, useState, useCallback } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { Menu, X } from "lucide-react";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";

const SellerLayout = () => {
  const { axios, navigate } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const sidebarLinks = [
    {
      name: "Analytics",
      path: "/seller/analytics",
      icon: assets.analytics_icon,
    },
    { name: "Add Product", path: "/seller/add-product", icon: assets.add_icon },
    {
      name: "Product List",
      path: "/seller/product-list",
      icon: assets.product_list_icon,
    },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
  ];

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

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/seller/logout");
      if (data.success) {
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 text-base font-medium group hover:scale-105 transform ` +
    (isActive
      ? "bg-white text-green-700 shadow-lg"
      : "text-white hover:bg-green-600 hover:text-white hover:shadow-md");

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white font-inter relative">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden cursor-pointer fade-in"
          onClick={toggleSidebar}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`bg-gradient-to-b from-green-700 to-green-600 shadow-xl border-r border-green-800 flex flex-col p-6 overflow-y-auto
        ${
          isSidebarOpen
            ? "fixed top-0 left-0 h-full w-64 z-50 translate-x-0 transition-transform duration-300 ease-in-out md:relative md:min-h-screen md:flex-shrink-0 md:z-auto"
            : "hidden md:relative md:flex md:w-64 md:min-h-screen md:flex-shrink-0"
        }
        `}>
        <button
          onClick={toggleSidebar}
          className="md:hidden absolute top-4 right-4 text-white hover:text-gray-200 focus:outline-none hover:scale-110 transform transition">
          <X size={28} />
        </button>

        <div className="text-center mb-8 mt-4 md:mt-0 slide-down">
          <Link to="/" className="block">
            <img
              src={assets.logo}
              alt="logo"
              className="h-12 md:h-14 mx-auto mb-2 object-contain hover:scale-110 transition-transform"
            />
          </Link>
          <h1 className="text-xl font-bold text-white">Seller Panel</h1>
          <p className="text-sm text-white/70 mt-1">Manage your store</p>
        </div>

        <nav className="flex-grow">
          <ul className="space-y-2">
            {sidebarLinks.map((item, index) => (
              <li
                key={item.name}
                className="slide-in-right"
                style={{ animationDelay: `${index * 0.1}s` }}>
                <NavLink
                  to={item.path}
                  end={item.path === "/seller/analytics"}
                  className={linkClasses}
                  onClick={() => setIsSidebarOpen(false)}>
                  <img
                    src={item.icon}
                    alt={item.name}
                    className="w-5 h-5 group-hover:rotate-12 transition-transform"
                  />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto pt-6 border-t border-green-800 slide-up">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-600 text-white rounded-md shadow-lg hover:bg-red-700 hover:scale-105 transition-all">
            <img src={assets.logout_icon} alt="Logout" className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden md:ml-0">
        <header className="bg-white border-b border-gray-200 shadow-sm px-4 py-4 flex justify-between items-center slide-down sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 focus:outline-none hover:scale-110 transition">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-green-700 hidden sm:block">
              Seller Dashboard
            </h1>
          </div>
          <p className="text-sm text-gray-700 font-medium">Hi, Seller 👋</p>
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SellerLayout;
