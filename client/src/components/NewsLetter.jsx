import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center text-center space-y-6 mt-24 pb-14 px-4 bg-gradient-to-b from-transparent to-green-50/30 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
<div className="absolute top-4 left-10 w-20 h-20 bg-green-400 rounded-full blur-2xl animate-blob-slow"></div>
        <div className="absolute bottom-8 right-16 w-16 h-16 bg-green-300 rounded-full blur-xl animate-blob-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-green-500 rounded-full blur-lg animate-blob-slow delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Animated Icon */}
        <div className="mb-4 flex justify-center">
          <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300">
            <Mail className="w-8 h-8 text-green-700" />
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="md:text-5xl text-3xl font-bold text-gray-800 mb-4 leading-tight">
          Never Miss a
          <span className="text-primary"> Deal!</span>
        </h1>

        {/* Subtitle */}
        <p className="md:text-xl text-lg text-gray-600 pb-8 max-w-2xl mx-auto leading-relaxed">
          Subscribe to get the latest offers, new arrivals, and exclusive
          <span className="text-primary font-semibold"> discounts</span> delivered straight to your inbox
        </p>

        {/* Newsletter Form */}
        {!isSubscribed ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row items-center justify-center max-w-2xl w-full mx-auto gap-4 md:gap-0"
          >
            <div className="relative flex-1 w-full md:w-auto">
              <input
                className="w-full h-14 pl-12 pr-4 border-2 border-green-300 rounded-lg md:rounded-r-none bg-white/90 backdrop-blur-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-200/50 transition-all duration-300 text-gray-700 placeholder-gray-500 shadow-lg"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            </div>

            <button
              type="submit"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="w-full md:w-auto px-8 h-14 text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg md:rounded-l-none shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 group"
            >
              <span>Subscribe</span>
              <Send className={`w-5 h-5 transition-transform duration-300 ${
                isHovered ? 'translate-x-1' : ''
              }`} />
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-center space-x-3 text-green-700 animate-fade-in">
            <CheckCircle className="w-8 h-8 animate-bounce" />
            <span className="text-xl font-semibold">Successfully Subscribed!</span>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="mt-8 flex flex-wrap justify-center items-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>No spam, ever</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Unsubscribe anytime</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Weekly updates</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
