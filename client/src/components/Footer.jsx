import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronUp,
  Heart,
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Github,
  Linkedin,
  Youtube,
} from "lucide-react";
import { assets } from "../assets/assets";

const footerLinks = [
  {
    title: "Company",
    links: [
      { text: "About Us", url: "/about-us" },
      { text: "Careers", url: "#" },
      { text: "Press", url: "#" },
      { text: "Blog", url: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { text: "FAQs", url: "/faqs" },
      { text: "Contact Us", url: "/contact-us" },
      { text: "Track Order", url: "#" },
      { text: "Returns", url: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { text: "Privacy Policy", url: "/privacy-policy" },
      { text: "Terms & Conditions", url: "/terms-and-conditions" },
      { text: "Cookie Policy", url: "#" },
      { text: "Refund Policy", url: "#" },
    ],
  },
];

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Intersection Observer to detect when the footer enters the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const footerElement = document.getElementById("footer");
    if (footerElement) {
      observer.observe(footerElement);
    }

    // Scroll event listener for showing/hiding the "Scroll to Top" button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      if (footerElement) observer.unobserve(footerElement);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Function to smoothly scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Social media icons using Lucide React
  const socialIcons = [
    { icon: Facebook, label: "Facebook", color: "hover:text-blue-400" },
    { icon: Twitter, label: "X (Twitter)", color: "hover:text-gray-300" },
    { icon: Instagram, label: "Instagram", color: "hover:text-pink-400" },
    { icon: Github, label: "GitHub", color: "hover:text-purple-400" },
    { icon: Linkedin, label: "LinkedIn", color: "hover:text-blue-300" },
    { icon: Youtube, label: "YouTube", color: "hover:text-red-400" },
  ];

  return (
    <>
      <footer
        id="footer"
        className="relative bg-gradient-to-b from-green-800 to-green-600 text-white overflow-hidden shadow-lg">
        {/* Animated Background Elements - matching navbar green tones */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-400 rounded-full blur-3xl animate-blob-slow"></div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-green-300 rounded-full blur-2xl animate-blob-slow delay-1000"></div>
          <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-green-500 rounded-full blur-xl animate-blob-slow delay-2000"></div>
        </div>

        <div className="relative z-10">
          {/* Main Footer Content */}
          <div className="container mx-auto px-4 pt-16 pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              {/* Brand Section */}
              <div
                className={`space-y-6 transform transition-all duration-1000 delay-200 ease-out ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-10 opacity-0"
                }`}>
                <div className="flex items-center space-x-4">
                  <img
                    src={assets.logo}
                    alt="Instant Pick Logo"
                    className="h-20 w-auto object-contain"
                  />
                  <div>
                    <h2 className="text-4xl font-extrabold text-white">
                      Instant Pick
                    </h2>
                    <p className="text-green-100 text-base italic">
                      Fresh • Fast • Reliable
                    </p>
                  </div>
                </div>

                <p className="text-gray-100 text-lg leading-relaxed max-w-lg">
                  We deliver{" "}
                  <span className="text-green-200 font-bold">
                    fresh, organic groceries
                  </span>{" "}
                  and healthy snacks right to your door. Trusted by thousands,
                  we make shopping
                  <span className="text-green-200 font-bold">
                    {" "}
                    simple, sustainable, and affordable.
                  </span>
                </p>

                {/* Social Media */}
                <div>
                  <h4 className="text-xl font-bold mb-4 text-green-100">
                    Follow Us
                  </h4>
                  <div className="flex space-x-4">
                    {socialIcons.map((SocialIcon, index) => (
                      <a
                        key={index}
                        href="#"
                        className={`group relative p-3 bg-green-700/60 rounded-full backdrop-blur-sm border border-green-500/40 hover:bg-white/15 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 ${SocialIcon.color}`}
                        aria-label={SocialIcon.label}>
                        <SocialIcon.icon className="w-6 h-6 text-green-100 group-hover:text-white" />
                        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                          {SocialIcon.label}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Links Grid */}
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 transform transition-all duration-1000 delay-400 ease-out ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-10 opacity-0"
                }`}>
                {footerLinks.map((section, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="text-2xl font-bold text-green-100 mb-4 relative pb-2">
                      {section.title}
                      {/* Underline animation for section titles */}
                      <div className="absolute -bottom-0 left-0 w-10 h-1 bg-gradient-to-r from-green-300 to-green-200 rounded-full"></div>
                    </h3>
                    <ul className="space-y-3">
                      {section.links.map((link, i) => (
                        <li key={i}>
                          <Link
                            to={link.url}
                            className="text-gray-100 hover:text-white hover:translate-x-2 transform transition-all duration-300 inline-block relative group">
                            {link.text}
                            {/* Hover underline animation */}
                            <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-green-300 group-hover:w-full transition-all duration-300"></span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Section */}
            <div
              className={`border-t border-green-500/40 pt-8 transform transition-all duration-1000 delay-600 ease-out ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-5 opacity-0"
              }`}>
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-2 text-gray-100 text-sm md:text-base">
                  <span>&copy; {new Date().getFullYear()}</span>
                  <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                  <span>
                    <strong>Instant Pick</strong>. All rights reserved.
                  </span>
                </div>

                <div className="flex items-center space-x-6 text-sm text-green-100">
                  <Link
                    to="/privacy-policy"
                    className="hover:text-white transition-colors duration-300 hover:underline">
                    Privacy
                  </Link>
                  <Link
                    to="/terms-and-conditions"
                    className="hover:text-white transition-colors duration-300 hover:underline">
                    Terms
                  </Link>
                  <Link
                    to="/faqs"
                    className="hover:text-white transition-colors duration-300 hover:underline">
                    FAQs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button - using navbar green colors */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 animate-bounce-custom focus:outline-none focus:ring-4 focus:ring-gray-300/50"
            aria-label="Scroll to top">
            <ChevronUp className="w-5 h-5" />
          </button>
        )}
      </footer>

      {/* Custom animations matching navbar style */}
      {/* CHANGE: Removed the 'jsx' attribute from the style tag */}
      <style>{`
        @keyframes pulse-light {
          0%, 100% {
            filter: brightness(1);
            opacity: 1;
          }
          50% {
            filter: brightness(1.2);
            opacity: 0.8;
          }
        }
        .animate-pulse-light {
          animation: pulse-light 3s infinite ease-in-out;
        }

        @keyframes blob-slow {
          0%, 100% {
            transform: scale(1) translate(0, 0);
          }
          33% {
            transform: scale(1.1) translate(10px, -10px);
          }
          66% {
            transform: scale(0.9) translate(-10px, 10px);
          }
        }
        .animate-blob-slow {
          animation: blob-slow 12s infinite ease-in-out;
        }

        @keyframes bounce-custom {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0) scale(1);
          }
          40% {
            transform: translateY(-10px) scale(1.05);
          }
          60% {
            transform: translateY(-5px) scale(1.02);
          }
        }
        .animate-bounce-custom {
          animation: bounce-custom 2s infinite;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animate-fade-in.delay-100 { animation-delay: 0.1s; }
        .animate-fade-in.delay-200 { animation-delay: 0.2s; }
        .animate-fade-in.delay-300 { animation-delay: 0.3s; }
      `}</style>
    </>
  );
};

export default Footer;
