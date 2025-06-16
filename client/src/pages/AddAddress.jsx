import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

// Input Field Component
const InputField = ({ type, placeholder, name, handleChange, address }) => (
  <input
    className="w-full px-4 py-2.5 border border-green-300 rounded-lg outline-none text-black focus:border-green-600 transition duration-200 placeholder-green-500"
    type={type}
    placeholder={placeholder}
    onChange={handleChange}
    name={name}
    value={address[name]}
    required
  />
);

const AddAddress = () => {
  const { axios, user, navigate } = useAppContext();

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/address/add", { address });

      if (data.success) {
        toast.success(data.message);
        navigate("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/cart");
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col mt-8 md:mt-12 max-w-6xl mx-auto px-4 md:px-8 gap-8 pb-16">
      {/* Page Title */}
      <div className="flex flex-col items-start w-max mb-6 add-address-fade-in">
        <p className="text-2xl md:text-3xl font-semibold text-black">
          Add Shipping <span className="text-green-600">Address</span>
        </p>
        <div className="w-24 h-0.5 bg-green-600 rounded-full mt-2"></div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10">
        {/* Address Form */}
        <div className="flex-1 w-full max-w-md bg-white p-6 md:p-8 rounded-lg shadow-md order-2 md:order-1 add-address-scale-in">
          <form onSubmit={onSubmitHandler} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                name="firstName"
                type="text"
                placeholder="First Name"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name="lastName"
                type="text"
                placeholder="Last Name"
              />
            </div>

            {/* Other Fields */}
            <InputField
              handleChange={handleChange}
              address={address}
              name="email"
              type="email"
              placeholder="Email address"
            />
            <InputField
              handleChange={handleChange}
              address={address}
              name="street"
              type="text"
              placeholder="Street"
            />

            {/* City/State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                name="city"
                type="text"
                placeholder="City"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name="state"
                type="text"
                placeholder="State"
              />
            </div>

            {/* Zip/Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                name="zipcode"
                type="number"
                placeholder="Zip code"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name="country"
                type="text"
                placeholder="Country"
              />
            </div>

            {/* Phone */}
            <InputField
              handleChange={handleChange}
              address={address}
              name="phone"
              type="text"
              placeholder="Phone"
            />

            {/* Submit Button */}
            <button className="w-full py-3 mt-6 bg-green-600 text-white font-medium hover:bg-green-700 transition rounded-full shadow-lg">
              Save address
            </button>
          </form>
        </div>

        {/* Image Section */}
        <div className="flex-shrink-0 order-1 md:order-2 add-address-fade-in">
          <img
            className="w-full max-w-sm md:max-w-md mx-auto md:mx-0"
            src={assets.add_address_iamge}
            alt="Add Address"
          />
        </div>
      </div>
    </div>
  );
};

export default AddAddress;
