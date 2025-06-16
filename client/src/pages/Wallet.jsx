// src/pages/Wallet.jsx
import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets"; // Assuming you have relevant assets

const Wallet = () => {
  const { walletBalance, addMoneyToWallet, currency } = useAppContext();
  const [amountToAdd, setAmountToAdd] = useState("");

  const handleAddMoney = (e) => {
    e.preventDefault();
    const amount = parseFloat(amountToAdd);
    if (!isNaN(amount) && amount > 0) {
      addMoneyToWallet(amount);
      setAmountToAdd(""); // Clear input after adding
    }
  };

  return (
    <div className="flex flex-col mt-8 md:mt-12 max-w-4xl mx-auto px-4 md:px-8 gap-8 pb-16">
      {/* Page Title */}
      <div className="flex flex-col items-start w-max mb-6">
        <p className="text-2xl md:text-3xl font-semibold text-gray-800">
          My <span className="font-semibold text-green-600">Wallet</span>
        </p>
        <div className="w-24 h-0.5 bg-primary rounded-full mt-2"></div>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-8 bg-white p-6 md:p-8 rounded-lg shadow-md">
        {/* Wallet Balance Section */}
        <div className="flex-1 w-full flex flex-col items-center justify-center p-6 bg-green-50 rounded-lg shadow-inner text-center">
          <p className="text-xl md:text-2xl font-semibold text-green-600 mb-2">
            Current Balance
          </p>
          <p className="text-3xl md:text-4xl font-bold text-primary">
            {currency}
            {walletBalance.toFixed(2)}
          </p>
          <img
            src={assets.wallet_icon} // Assuming you have a wallet icon
            alt="Wallet"
            className="w-24 h-24 mt-4 opacity-70"
          />
        </div>

        {/* Add Money Section */}
        <div className="flex-1 w-full bg-white p-6 rounded-lg shadow-md border border-green-200">
          <h2 className="text-xl font-semibold text-green-600 mb-4">
            Add Money to Wallet
          </h2>
          <form onSubmit={handleAddMoney} className="space-y-4">
            <div>
              <label
                htmlFor="amount"
                className="block text-gray-800 text-sm font-medium mb-2">
                Amount ({currency})
              </label>
              <input
                type="number"
                id="amount"
                className="w-full px-4 py-2.5 border border-green-300 rounded-lg outline-none text-green-800 focus:border-primary transition duration-200 placeholder-green-500"
                placeholder="e.g., 100.00"
                value={amountToAdd}
                onChange={(e) => setAmountToAdd(e.target.value)}
                min="0.01"
                step="0.01"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 mt-4 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition rounded-full shadow-lg">
              Add Money
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
