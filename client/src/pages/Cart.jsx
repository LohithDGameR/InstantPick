// cart.jsx
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets, dummyAddress } from "../assets/assets";
import toast from "react-hot-toast";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    removeFromCart,
    getCartCount,
    updateCartItem,
    navigate,
    getCartAmount,
    axios,
    user,
    setCartItems,
    // --- WALLET FEATURE IMPORTS ---
    walletBalance,
    deductFromWallet,
  } = useAppContext();
  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD"); // Default to COD

  const getCart = () => {
    let tempArray = [];
    for (const key in cartItems) {
      const product = products.find((item) => item._id === key);
      if (product) {
        product.quantity = cartItems[key];
        tempArray.push(product);
      }
    }
    setCartArray(tempArray);
  };

  const getUserAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }

      const totalOrderAmount = getCartAmount() + (getCartAmount() * 2) / 100; // Calculate total amount including tax

      if (paymentOption === "Wallet") {
        // --- WALLET PAYMENT LOGIC ---
        if (deductFromWallet(totalOrderAmount)) {
          // If deduction is successful, simulate order placement frontend-only
          setCartItems({}); // Clear cart
          toast.success("Order placed using Wallet!");
          navigate("/my-orders"); // Navigate to my orders page
        }
        // If deduction fails, deductFromWallet already shows a toast.
        return; // Exit function after handling wallet payment
      }

      // Existing COD/Stripe Logic (unchanged)
      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/order/cod", {
          userId: user._id,
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
        });

        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      } else if (paymentOption === "Online") { // Assuming "Online" means Stripe
        const { data } = await axios.post("/api/order/stripe", {
          userId: user._id,
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
        });

        if (data.success) {
          window.location.replace(data.url);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);

  useEffect(() => {
    if (user) {
      getUserAddress();
    }
  }, [user]);

  return products.length > 0 && cartItems ? (
    <div className="flex flex-col md:flex-row mt-8 md:mt-12 max-w-6xl mx-auto px-4 md:px-8 gap-8">
      {/* Left Section: Shopping Cart Details */}
      <div className="flex-1 max-w-4xl bg-white p-6 md:p-8 rounded-lg shadow-md mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-green-800">
          Shopping Cart{" "}
          <span className="text-sm text-primary font-normal">{getCartCount()} Items</span>
        </h1>

        {/* Table Headers */}
        <div className="grid grid-cols-[2fr_1fr_1fr] text-green-700 text-base font-semibold pb-3 border-b border-green-200">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {/* Cart Items List */}
        <div className="divide-y divide-green-100">
          {cartArray.map((product, index) => (
            <div
              key={product._id || index}
              className="grid grid-cols-[2fr_1fr_1fr] items-center py-4 text-green-800 text-sm md:text-base font-medium"
            >
              <div className="flex items-center md:gap-6 gap-3">
                <div
                  onClick={() => {
                    navigate(
                      `/products/${product.category.toLowerCase()}/${product._id}`
                    );
                    window.scrollTo(0, 0);
                  }}
                  className="cursor-pointer w-24 h-24 flex items-center justify-center border border-green-200 rounded-md overflow-hidden flex-shrink-0"
                >
                  <img
                    className="max-w-full h-full object-cover"
                    src={product.image[0]}
                    alt={product.name}
                  />
                </div>
                <div className="flex-1">
                  <p className="hidden md:block font-semibold text-green-800">{product.name}</p>
                  <div className="font-normal text-gray-700 text-xs md:text-sm">
                    <p>
                      Weight: <span>{product.weight || "N/A"}</span>
                    </p>
                    <div className="flex items-center gap-1">
                      <p>Qty:</p>
                    <select
                      onChange={(e) =>
                        updateCartItem(product._id, Number(e.target.value))
                      }
                      value={cartItems[product._id]}
                      className="outline-none">
                      {Array(
                        cartItems[product.id] > 9 ? cartItems[product._id] : 9
                      )
                        .fill("")
                        .map((_, index) => (
                          <option key={index} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                    </select>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center font-semibold text-green-800">
                {currency}
                {product.offerPrice * product.quantity}
              </p>
              <button
                onClick={() => removeFromCart(product._id)}
                className="cursor-pointer mx-auto hover:scale-105 transition"
              >
                <img
                  src={assets.remove_icon}
                  alt="remove"
                  className="inline-block w-6 h-6"
                />
              </button>
            </div>
          ))}
        </div>

        {/* Continue Shopping Button */}
        <button
          onClick={() => {
            navigate("/products");
            window.scrollTo(0, 0);
          }}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium py-2 px-4 border border-primary rounded-md hover:bg-primary/10 transition"
        >
          <img
            className="group-hover:-translate-x-1 transition"
            src={assets.arrow_right_icon_colored}
            alt="arrow"
          />
          Continue Shopping
        </button>
      </div>

      {/* Right Section: Order Summary */}
      <div className="max-w-[360px] w-full bg-green-50 p-6 rounded-lg shadow-md max-md:mt-8 md:ml-8 mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-green-800">Order Summary</h2>
        <hr className="border-green-200 my-5" />

        <div className="mb-6">
          <p className="text-sm font-semibold uppercase text-green-800 mb-2">Delivery Address</p>
          <div className="relative flex justify-between items-start">
            <p className="text-gray-700 text-sm">
              {selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                : "No address found"}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-primary hover:underline cursor-pointer text-sm"
            >
              Change
            </button>
            {showAddress && (
              <div className="absolute top-full py-1 bg-white border border-green-200 text-sm w-full rounded-md shadow-lg z-10 mt-1">
                {addresses.map((address) => (
                  <p
                    key={address._id}
                    onClick={() => {
                      setSelectedAddress(address);
                      setShowAddress(false);
                    }}
                    className="text-gray-700 p-2 hover:bg-green-50 cursor-pointer rounded-sm"
                  >
                    {address.street}, {address.city}, {address.state},{" "}
                    {address.country}
                  </p>
                ))}
                <p
                  onClick={() => navigate("/add-address")}
                  className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10 rounded-sm font-medium"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="text-sm font-semibold uppercase mt-6 text-green-800 mb-2">Payment Method</p>

          <select
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border border-green-300 bg-white px-3 py-2 mt-2 outline-none rounded-lg text-green-800 shadow-sm"
            value={paymentOption}
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
            <option value="Wallet">Wallet ({currency}{walletBalance.toFixed(2)})</option> {/* Added Wallet option */}
          </select>
        </div>

        <hr className="border-green-200" />

        <div className="text-gray-700 mt-4 space-y-2 text-sm md:text-base">
          <p className="flex justify-between">
            <span>Price</span>
            <span>
              {currency}
              {getCartAmount()}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600 font-medium">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>
              {currency}
              {(getCartAmount() * 2) / 100}
            </span>
          </p>
          <p className="flex justify-between text-lg md:text-xl font-bold mt-3 text-green-800">
            <span>Total Amount:</span>
            <span>
              {currency}
              {(getCartAmount() + (getCartAmount() * 2) / 100).toFixed(2)} {/* Ensure total amount is formatted */}
            </span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition rounded-full shadow-lg"
        >
          {paymentOption === "COD"
            ? "Place Order"
            : paymentOption === "Wallet"
            ? "Pay with Wallet"
            : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  ) : null;
};

export default Cart;