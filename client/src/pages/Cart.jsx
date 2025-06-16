import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Cart = () => {
  const {
    allProducts,
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
    walletBalance,
    deductFromWallet,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");

  const getCart = () => {
    let tempArray = [];
    for (const key in cartItems) {
      const product = allProducts.find((item) => item._id === key);
      if (product) {
        tempArray.push({ ...product, quantity: cartItems[key] });
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
        } else {
          toast.error("Please add a delivery address to proceed.");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const placeOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address.");
      return;
    }

    const totalOrderAmount = getCartAmount() + getCartAmount() * 0.02;

    const itemsForBackend = cartArray.map((item) => ({
      product: item._id,
      quantity: item.quantity,
    }));

    try {
      if (paymentOption === "Wallet") {
        if (deductFromWallet(totalOrderAmount)) {
          const { data } = await axios.post("/api/order/cod", {
            userId: user._id,
            items: itemsForBackend,
            address: selectedAddress,
            paymentType: "Wallet",
          });

          if (data.success) {
            setCartItems({});
            toast.success("Order placed using Wallet!");
            navigate("/my-orders");
          } else {
            toast.error(data.message);
          }
        }
        return;
      }

      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/order/cod", {
          userId: user._id,
          items: itemsForBackend,
          address: selectedAddress,
        });

        if (data.success) {
          setCartItems({});
          toast.success(data.message);
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      } else if (paymentOption === "Online") {
        const { data } = await axios.post("/api/order/stripe", {
          userId: user._id,
          items: itemsForBackend,
          address: selectedAddress,
        });

        if (data.success) {
          window.location.replace(data.url);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Order failed.");
    }
  };

  useEffect(() => {
    if (allProducts.length > 0 && cartItems) {
      getCart();
    }
  }, [allProducts, cartItems]);

  useEffect(() => {
    if (user) {
      getUserAddress();
    }
  }, [user]);

  return allProducts.length > 0 && cartItems ? (
    <div className="flex flex-col md:flex-row mt-8 max-w-6xl mx-auto px-4 md:px-8 gap-8">
      {/* Left Section */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-2xl font-semibold mb-6 text-black">
          Shopping Cart{" "}
          <span className="text-sm font-normal text-gray-600">
            ({getCartCount()} Items)
          </span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-600 font-semibold pb-3 border-b">
          <p>Product</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        <div className="divide-y">
          {cartArray.length > 0 ? (
            cartArray.map((product) => (
              <div
                key={product._id}
                className="grid grid-cols-[2fr_1fr_1fr] items-center py-4 text-black">
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => {
                      navigate(
                        `/products/${product.category.toLowerCase()}/${
                          product._id
                        }`
                      );
                      window.scrollTo(0, 0);
                    }}
                    className="cursor-pointer w-24 h-24 border rounded-md overflow-hidden hover-grow">
                    <img
                      className="w-full h-full object-cover"
                      src={product.image[0]}
                      alt={product.name}
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <div className="text-gray-600 text-sm">
                      <p>Qty: {product.quantity}</p>
                      <select
                        onChange={(e) =>
                          updateCartItem(product._id, Number(e.target.value))
                        }
                        value={product.quantity}
                        className="border rounded-md px-1 py-0.5 mt-1 text-sm">
                        {Array.from({ length: 10 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <p className="text-center font-semibold text-green-700">
                  {currency}
                  {(product.offerPrice * product.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="mx-auto hover-grow">
                  <img
                    src={assets.remove_icon}
                    alt="remove"
                    className="w-6 h-6"
                  />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              Your cart is empty.
            </div>
          )}
        </div>

        <button
          onClick={() => {
            navigate("/products");
            window.scrollTo(0, 0);
          }}
          className="group flex items-center mt-8 gap-2 text-green-700 font-medium py-2 px-4 border rounded-md hover:bg-green-50 hover-grow">
          <img
            className="transition-transform w-5 h-5"
            src={assets.arrow_right_icon_colored}
            alt="arrow"
          />
          Continue Shopping
        </button>
      </div>

      {/* Right Section */}
      <div className="max-w-[360px] w-full bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-black">Order Summary</h2>
        <hr className="my-5" />

        <div className="mb-6">
          <p className="text-sm font-semibold text-black mb-2">
            Delivery Address
          </p>
          <div className="relative">
            <p className="text-gray-600 text-sm">
              {selectedAddress
                ? `${selectedAddress.firstName} ${selectedAddress.lastName}, ${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country} - ${selectedAddress.zipcode}`
                : "No address found"}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-green-700 hover:underline text-sm mt-2">
              Change
            </button>
            {showAddress && (
              <div className="absolute top-full bg-white border text-sm w-full rounded-md shadow-md mt-1 z-10">
                {addresses.map((address) => (
                  <p
                    key={address._id}
                    onClick={() => {
                      setSelectedAddress(address);
                      setShowAddress(false);
                    }}
                    className="p-2 hover:bg-green-50 cursor-pointer">
                    {address.street}, {address.city}, {address.state},{" "}
                    {address.country}
                  </p>
                ))}
                <p
                  onClick={() => navigate("/add-address")}
                  className="text-green-700 text-center p-2 hover:bg-green-100 cursor-pointer font-medium">
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="text-sm font-semibold text-black mt-6 mb-2">
            Payment Method
          </p>
          <select
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border bg-white px-3 py-2 mt-2 outline-none rounded-md text-black"
            value={paymentOption}>
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
            <option value="Wallet">
              Wallet ({currency}
              {walletBalance.toFixed(2)})
            </option>
          </select>
        </div>

        <hr />

        <div className="text-sm text-gray-600 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span>
            <span>
              {currency}
              {getCartAmount().toFixed(2)}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Shipping</span>
            <span className="text-green-700">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>
              {currency}
              {(getCartAmount() * 0.02).toFixed(2)}
            </span>
          </p>
          <p className="flex justify-between text-lg font-bold text-black">
            <span>Total:</span>
            <span>
              {currency}
              {(getCartAmount() + getCartAmount() * 0.02).toFixed(2)}
            </span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          className="w-full py-3 mt-6 bg-green-700 text-white font-medium rounded-full hover:bg-green-800 hover-grow cursor-pointer">
          {paymentOption === "COD"
            ? "Place Order"
            : paymentOption === "Wallet"
            ? "Pay with Wallet"
            : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-[60vh] text-xl font-medium text-gray-500">
      {cartItems ? "Loading products..." : "Your cart is empty!"}
    </div>
  );
};

export default Cart;
