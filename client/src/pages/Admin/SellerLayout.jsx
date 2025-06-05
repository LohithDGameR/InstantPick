import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const SellerLayout = () => {
  const { axios, navigate } = useAppContext();

  const sidebarLinks = [
    { name: "Add Product", path: "/seller", icon: assets.add_icon },
    {
      name: "Product List",
      path: "/seller/product-list",
      icon: assets.product_list_icon,
    },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
  ];

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

  return (
    <div className="min-h-screen flex bg-white text-emerald-900">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 bg-gradient-to-b from-green-800 to-green-600 text-white shadow-lg">
        <div className="flex flex-col h-full">
          <Link to="/" className="flex justify-center md:justify-start px-4 mb-8">
            <img
              src={assets.logo}
              alt="logo"
              className="h-10 md:h-14 w-auto object-contain"
            />
          </Link>
          <nav className="flex-1 space-y-2">
            {sidebarLinks.map((item) => (
              <NavLink
                to={item.path}
                key={item.name}
                end={item.path === "/seller"}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 gap-4 rounded-md mx-2 transition-all duration-200
                  ${
                    isActive
                      ? "bg-white text-green-900 font-semibold shadow"
                      : "hover:bg-green-700 text-white/90"
                  }`
                }>
                <img src={item.icon} alt={item.name} className="w-6 h-6" />
                <span className="hidden md:inline">{item.name}</span>
              </NavLink>
            ))}
          </nav>
          <div className="p-4">
            <button
              onClick={logout}
              className="w-full text-sm text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition cursor-pointer">
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white backdrop-blur-sm border-b border-white shadow-sm px-4 py-3 flex justify-between items-center">
          <p className="text-lg font-medium hidden sm:block">Admin Dashboard</p>
          <p className="text-sm text-green-700">Hi, Admin 👋</p>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
