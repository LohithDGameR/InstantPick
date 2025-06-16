// AppContext.jsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
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
  const [sellerData, setSellerData] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(false);

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // --- WALLET FEATURE ADDITIONS START ---
  const [walletBalance, setWalletBalance] = useState(() => {
    try {
      const storedBalance = localStorage.getItem("userWalletBalance");
      return storedBalance ? parseFloat(storedBalance) : 0;
    } catch (error) {
      console.error("Error parsing wallet balance from localStorage:", error);
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("userWalletBalance", walletBalance.toFixed(2));
    } catch (error) {
      console.error("Error saving wallet balance to localStorage:", error);
    }
  }, [walletBalance]);

  const addMoneyToWallet = (amount) => {
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid positive amount.");
      return;
    }
    setWalletBalance((prevBalance) => prevBalance + amount);
    toast.success(`${currency}${amount.toFixed(2)} added to your wallet!`);
  };

  const deductFromWallet = (amount) => {
    if (isNaN(amount) || amount <= 0) {
      toast.error("Invalid deduction amount.");
      return false;
    }
    if (walletBalance >= amount) {
      setWalletBalance((prevBalance) => prevBalance - amount);
      toast.success(`${currency}${amount.toFixed(2)} deducted from wallet.`);
      return true;
    } else {
      toast.error("Insufficient wallet balance.");
      return false;
    }
  };
  // --- WALLET FEATURE ADDITIONS END ---

  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      if (data.success) {
        setIsSeller(true);
        setSellerData(data.seller);
      } else {
        setIsSeller(false);
        setSellerData(null);
      }
    } catch (error) {
      console.error(
        "Error fetching seller status:",
        error.response?.data?.message || error.message
      );
      setIsSeller(false);
      setSellerData(null);
    }
  };

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
      console.error(
        "Error fetching user data:",
        error.response?.data?.message || error.message
      );
      setUser(null);
      setCartItems({});
    }
  };

  const fetchSellerProducts = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/product/seller-list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(
        "Error fetching seller products:",
        error.response?.data?.message || error.message
      );
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "An error occurred while fetching seller products."
      );
    }
  }, [axios]);

  const fetchAllProducts = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/product/all");
      if (data.success) {
        setAllProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(
        "Error fetching all products:",
        error.response?.data?.message || error.message
      );
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "An error occurred while fetching all products."
      );
    }
  }, [axios]);

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

  // Get Cart Total Amount (Updated for debugging and robustness)
  const getCartAmount = useCallback(() => {
    let totalAmount = 0;
    console.log("Calculating cart amount..."); // DEBUG
    console.log("Current cartItems:", cartItems); // DEBUG
    console.log("Current allProducts:", allProducts); // DEBUG

    for (const itemId in cartItems) {
      const quantity = cartItems[itemId];
      // Ensure itemId exists in allProducts AND has a valid offerPrice
      const itemInfo = allProducts.find((product) => product._id === itemId);

      if (
        itemInfo &&
        typeof itemInfo.offerPrice === "number" &&
        itemInfo.offerPrice >= 0
      ) {
        const itemPrice = itemInfo.offerPrice;
        totalAmount += itemPrice * quantity;
        console.log(
          `  - Item: ${
            itemInfo.name || itemId
          }, Qty: ${quantity}, Price: ${itemPrice}, Subtotal: ${
            itemPrice * quantity
          }`
        ); // DEBUG
      } else {
        console.warn(
          `  - Warning: Product ID ${itemId} not found in allProducts or has invalid offerPrice (${itemInfo?.offerPrice}). Skipping calculation for this item.`
        ); // DEBUG
      }
    }
    console.log("Final Calculated Cart Amount (before rounding):", totalAmount); // DEBUG
    return Math.floor(totalAmount * 100) / 100; // Round to 2 decimal places
  }, [cartItems, allProducts]); // Dependencies: cartItems, allProducts

  // Initial data fetching on component mount
  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Update Database Cart Items whenever cartItems state changes, if user is logged in
  useEffect(() => {
    const updateCartInDB = async () => {
      if (user) {
        try {
          const { data } = await axios.post("/api/cart/update", {
            userId: user._id,
            cartItems: cartItems,
          });
          if (!data.success) {
            console.error("Failed to update cart in DB:", data.message);
          }
        } catch (error) {
          console.error(
            "Error updating cart in DB:",
            error.response?.data?.message || error.message
          );
        }
      }
    };

    const handler = setTimeout(() => {
      updateCartInDB();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [cartItems, user, axios]);

  const value = {
    navigate,
    user,
    setUser,
    setIsSeller,
    isSeller,
    sellerData,
    showUserLogin,
    setShowUserLogin,
    products,
    allProducts,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartAmount, // This is the useCallback version
    getCartCount,
    axios,
    fetchSellerProducts,
    fetchAllProducts,
    setCartItems,
    walletBalance,
    addMoneyToWallet,
    deductFromWallet,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
