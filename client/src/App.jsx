// src/App.jsx
import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// App/User/Cart related Imports
import { useAppContext } from "./context/AppContext.jsx"; // REMOVED AppContextProvider from import
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./components/Login.jsx";
import AllProducts from "./pages/AllProducts.jsx";
import ProductCategory from "./pages/ProductCategory.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import AddAddress from "./pages/AddAddress.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import Loading from "./components/Loading.jsx";
import Wallet from "./pages/Wallet.jsx";
import Footer from "./components/Footer.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import FAQPage from "./pages/FAQPage.jsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.jsx";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage.jsx";

// Seller/Admin Imports
import SellerLogin from "./components/AdminDashBoard/SellerLogin.jsx";
import SellerLayout from "./pages/Admin/SellerLayout.jsx";
import AddProduct from "./pages/Admin/AddProduct.jsx";
import ProductList from "./pages/Admin/ProductList.jsx";
import Orders from "./pages/Admin/Orders.jsx";
import Analytics from "./pages/Admin/Analytics.jsx";

// Delivery Imports
import { DeliveryContextProvider } from "./context/DeliveryContext.jsx"; // This provider is separate and correctly used here
import DeliveryLogin from "./components/delivery/DeliveryLogin.jsx";
import DeliveryRegister from "./components/delivery/DeliveryRegister.jsx";
import DeliveryDashboard from "./components/delivery/DeliveryDashboard.jsx";
import ProtectedRouteDelivery from "./components/delivery/ProtectedRouteDelivery.jsx";
import DeliveryLayout from "./components/delivery/DeliveryLayout.jsx";

const App = () => {
  const location = useLocation();
  const isSellerPath = location.pathname.includes("seller");
  const isDeliveryPath = location.pathname.includes("delivery");

  // CORRECT: Now useAppContext will correctly access the context from main.jsx
  const { showUserLogin, isSeller } = useAppContext();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    // REMOVED: <AppContextProvider> wrapper from here.
    // The AppContext is already provided by main.jsx.
    <DeliveryContextProvider> {/* Keep this as it's a separate context */}
      {/* Main container for the application, setting global text and background styles */}
      <div className="text-default min-h-screen text-gray-700 bg-gray-50 font-inter">
        {/* Toaster component for modern, non-blocking notifications */}
        <Toaster position="top-center" reverseOrder={false} />

        {/* Conditionally render Navbar based on the current route */}
        {isSellerPath || isDeliveryPath ? null : <Navbar />}

        {/* This will now correctly render the Login modal when showUserLogin is true */}
        {showUserLogin ? <Login /> : null}

        {/* Main content area with conditional padding based on route */}
        <div
          className={`${
            isSellerPath || isDeliveryPath
              ? "" // No padding for admin/delivery dashboards as they might have their own layouts
              : "px-4 md:px-10 lg:px-20 xl:px-32 py-8" // Responsive padding for main user-facing pages
          }`}
        >
          {/* Define application routes */}
          <Routes>
            {/* Public Routes for general users */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<AllProducts />} />
            <Route path="/products/:category" element={<ProductCategory />} />
            <Route
              path="/products/:category/:id"
              element={<ProductDetails />}
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/add-address" element={<AddAddress />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/loader" element={<Loading />} />
            <Route path="/wallet" element={<Wallet />} />

            {/* Legal and Information Pages */}
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/faqs" element={<FAQPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditionsPage />}
            />

            {/* Seller/Admin Routes - Protected by `isSeller` check */}
            <Route
              path="/seller"
              element={isSeller ? <SellerLayout /> : <SellerLogin />}
            >
              {/* Nested routes for the seller dashboard */}
              <Route index element={<Analytics />} /> {/* Default seller dashboard route */}
              <Route path="analytics" element={<Analytics />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="product-list" element={<ProductList />} />
              <Route path="orders" element={<Orders />} />
            </Route>

            {/* Delivery Routes - Protected by ProtectedRouteDelivery component */}
            <Route path="/delivery/login" element={<DeliveryLogin />} />
            <Route path="/delivery/register" element={<DeliveryRegister />} />
            <Route element={<ProtectedRouteDelivery />}>
              <Route path="/delivery" element={<DeliveryLayout />}>
                {/* Default delivery dashboard route */}
                <Route index element={<DeliveryDashboard />} />
              </Route>
            </Route>
          </Routes>
        </div>

        {/* Conditionally render Footer based on the current route */}
        {!isSellerPath && !isDeliveryPath && <Footer />}
      </div>
    </DeliveryContextProvider>
  );
};

export default App;
