// AppContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
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
  const [searchQuery, setSearchQuery] = useState("");

  // --- WALLET FEATURE ADDITIONS START ---
  // State for wallet balance, initialized from localStorage
  const [walletBalance, setWalletBalance] = useState(() => {
    try {
      const storedBalance = localStorage.getItem("userWalletBalance");
      return storedBalance ? parseFloat(storedBalance) : 0;
    } catch (error) {
      console.error("Error parsing wallet balance from localStorage:", error);
      return 0; // Default to 0 if there's an error
    }
  });

  // Effect to sync wallet balance to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("userWalletBalance", walletBalance.toFixed(2));
    } catch (error) {
      console.error("Error saving wallet balance to localStorage:", error);
    }
  }, [walletBalance]);

  // Function to add money to the wallet
  const addMoneyToWallet = (amount) => {
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid positive amount.");
      return;
    }
    setWalletBalance((prevBalance) => prevBalance + amount);
    toast.success(`${currency}${amount.toFixed(2)} added to your wallet!`);
  };

  // Function to deduct money from the wallet
  const deductFromWallet = (amount) => {
    if (isNaN(amount) || amount <= 0) {
      toast.error("Invalid deduction amount.");
      return false;
    }
    if (walletBalance >= amount) {
      setWalletBalance((prevBalance) => prevBalance - amount);
      toast.success(`${currency}${amount.toFixed(2)} deducted from wallet.`);
      return true; // Deduction successful
    } else {
      toast.error("Insufficient wallet balance.");
      return false; // Deduction failed
    }
  };
  // --- WALLET FEATURE ADDITIONS END ---

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
      console.error("Error fetching seller status:", error);
      setIsSeller(false);
    }
  };

  // Fetch User Auth Status, User Data and Cart Items
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
      } else {
        setUser(null);
        setCartItems({});
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
      setCartItems({});
    }
  };

  // Fetch All Products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error.response?.data?.message || error.message || "An error occurred while fetching products.");
    }
  };

  // Add Product to Cart
  const addToCart = (itemId) => {
    if (!itemId) {
      toast.error("Invalid item ID.");
      return;
    }

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

  // Remove Product from Cart (removes entire product)
  const removeFromCart = (itemId) => {
    if (!itemId || !cartItems[itemId]) {
      toast("Item not found in cart.", { icon: "ℹ️" });
      return;
    }

    let currentCartItems = cartItems || {};
    let cartData = structuredClone(currentCartItems);
    
    // Remove the entire product by deleting its entry from cartData
    delete cartData[itemId];
    
    setCartItems(cartData);
    toast.success("Product removed from Cart");
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
      let itemInfo = products.find((product) => product._id === items);
      if (itemInfo && cartItems[items] > 0) {
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
  }, []);

  // Update Database Cart Items whenever cartItems state changes, if user is logged in
  useEffect(() => {
    const updateCartInDB = async () => {
      if (user && (Object.keys(cartItems).length > 0 || Object.keys(user.cartItems || {}).length > 0)) {
        try {
          const { data } = await axios.post("/api/cart/update", {
            userId: user._id,
            cartItems: cartItems,
          });
          if (!data.success) {
            toast.error(data.message);
          } else {
            console.log("Cart updated in DB successfully!");
          }
        } catch (error) {
          console.error("Error updating cart in DB:", error);
          toast.error("Failed to update cart in database: " + error.message);
        }
      }
    };

    const handler = setTimeout(() => {
      updateCartInDB();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [cartItems, user]);

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
    // --- WALLET FEATURE EXPORTS ---
    walletBalance,
    addMoneyToWallet,
    deductFromWallet,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};