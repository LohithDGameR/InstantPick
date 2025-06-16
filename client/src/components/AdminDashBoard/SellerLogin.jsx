import { useEffect, useState, useRef } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate, axios } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (isSeller) {
      navigate("/seller");
    }
  }, [isSeller, navigate]);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.classList.add("fade-in-up");
    }
  }, []);

  const onSubmitLoginHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/seller/login", {
        email,
        password,
      });
      if (data.success) {
        setIsSeller(true);
        navigate("/seller");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed: " + error.message
      );
    }
  };

  const onSubmitRegisterHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/seller/register", {
        name,
        email,
        password,
      });
      if (data.success) {
        toast.success(data.message + ". Please login now.");
        setIsRegisterMode(false);
        setName("");
        setEmail("");
        setPassword("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed: " + error.message
      );
    }
  };

  return (
    !isSeller && (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white text-sm text-black font-inter px-4">
        <form
          ref={formRef}
          onSubmit={
            isRegisterMode ? onSubmitRegisterHandler : onSubmitLoginHandler
          }
          className="flex flex-col gap-5 p-8 py-12 min-w-80 sm:min-w-88 rounded-2xl shadow-xl border border-gray-200 bg-white transition-all duration-500 ease-out opacity-0 translate-y-5">
          <p className="text-2xl font-semibold m-auto">
            <span className="text-green-700">Seller</span>{" "}
            {isRegisterMode ? "Register" : "Login"}
          </p>

          {isRegisterMode && (
            <div className="w-full">
              <p>Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Enter your name"
                className="border border-gray-300 rounded-md w-full p-2 mt-1 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                required
              />
            </div>
          )}

          <div className="w-full">
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Enter your email"
              className="border border-gray-300 rounded-md w-full p-2 mt-1 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              required
            />
          </div>

          <div className="w-full">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Enter your password"
              className="border border-gray-300 rounded-md w-full p-2 mt-1 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-green-700 text-white w-full py-2 rounded-md hover:bg-green-800 transition duration-200">
            {isRegisterMode ? "Register" : "Login"}
          </button>

          <p className="text-center text-gray-600">
            {isRegisterMode
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <span
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setName("");
                setEmail("");
                setPassword("");
              }}
              className="text-green-700 cursor-pointer hover:underline">
              {isRegisterMode ? "Login here" : "Register here"}
            </span>
          </p>
        </form>
      </div>
    )
  );
};

export default SellerLogin;
