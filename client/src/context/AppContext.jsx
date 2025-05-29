import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { dummyProducts } from "../assets/assets";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);

  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // Changed to empty string for search input

  // Fetch Seller Status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      if (data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch (error) {
      console.error("Error fetching seller status:", error); // Log error for debugging
      setIsSeller(false);
    }
  };

  // Fetch User Auth Status, User Data and Cart Items
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth"); // Fetch user authentication status and data
      if (data.success) {
        setUser(data.user);
        // Ensure cartItems from backend is an object if it could be null/undefined
        // This is crucial: initialize cartItems from the user's data on successful login/auth check
        setCartItems(data.user.cartItems || {});
      } else {
        // If not successful, explicitly set user to null and clear cart
        setUser(null);
        setCartItems({});
      }
    } catch (error) {
      console.error("Error fetching user data:", error); // Log error for debugging
      setUser(null);
      setCartItems({});
    }
  };

  // Fetch All Products
  const fetchProducts = async () => {
    // setProducts(dummyProducts);
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message || "Failed to fetch products."); // Added fallback message
      }
    } catch (error) {
      console.error("Error fetching products:", error); // Log error for debugging
      toast.error(error.response?.data?.message || error.message || "An error occurred while fetching products.");
    }
  };

  // Add Product to Cart
  const addToCart = (itemId) => {
    // Check if itemId is valid
    if (!itemId) {
      toast.error("Invalid item ID.");
      return;
    }

    // Ensure cartItems is an object before cloning
    let currentCartItems = cartItems || {};
    let cartData = structuredClone(currentCartItems);

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to Cart");
  };

  // Update Cart Item Quantity
  const updateCartItem = (itemId, quantity) => {
    // Basic validation
    if (!itemId || quantity === undefined || quantity < 0) {
      toast.error("Invalid cart update request.");
      return;
    }

    let currentCartItems = cartItems || {};
    let cartData = structuredClone(currentCartItems);
    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);
    toast.success("Cart Updated");
  };

  // Remove Product from Cart (reduces quantity by 1, removes if 0)
  const removeFromCart = (itemId) => {
    if (!itemId || !cartItems[itemId]) {
      // Check if item exists in cart
      toast("Item not found in cart.", { icon: "ℹ️" }); // Informative toast if not in cart
      return;
    }

    let currentCartItems = cartItems || {};
    let cartData = structuredClone(currentCartItems);
    cartData[itemId] -= 1;
    if (cartData[itemId] === 0) {
      delete cartData[itemId];
    }
    setCartItems(cartData);
    toast.success("Removed from Cart"); // Toast after actual removal/reduction
  };

  // Get Cart Item Count
  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };

  // Get Cart Total Amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      // Find product info, ensure it exists
      let itemInfo = products.find((product) => product._id === items);
      if (itemInfo && cartItems[items] > 0) {
        // Check if itemInfo is found
        totalAmount += itemInfo.offerPrice * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  // Initial data fetching on component mount
  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []); // Empty dependency array means this runs once on mount

  // Update Database Cart Items whenever cartItems state changes, if user is logged in
  useEffect(() => {
    const updateCartInDB = async () => {
      // Only update if user is logged in and cartItems is not empty (or has changed from previous state)
      if (user && Object.keys(cartItems).length > 0 || (user && Object.keys(cartItems).length === 0 && Object.keys(user.cartItems || {}).length > 0)) {
        try {
          // Send userId along with cartItems
          const { data } = await axios.post("/api/cart/update", {
            userId: user._id, // Explicitly send the userId
            cartItems: cartItems,
          });
          if (!data.success) {
            toast.error(data.message);
          } else {
            console.log("Cart updated in DB successfully!"); // For debugging
          }
        } catch (error) {
          console.error("Error updating cart in DB:", error); // Log the specific error
          toast.error("Failed to update cart in database: " + error.message);
        }
      }
    };

    // Add a small delay to debounce updates, preventing too many rapid DB calls
    const handler = setTimeout(() => {
      updateCartInDB();
    }, 500); // Wait 500ms after cartItems stops changing

    return () => {
      clearTimeout(handler); // Clear timeout if cartItems changes again before the delay
    };
  }, [cartItems, user]); // Depend on cartItems and user

  const value = {
    navigate,
    user,
    setUser,
    setIsSeller,
    isSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,
    axios,
    fetchProducts,
    setCartItems,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};