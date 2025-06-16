import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { Send } from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.classList.add("fade-in-up");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    toast.loading("Sending your message...", { id: "contact-toast" });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(
        "Message sent successfully! We will get back to you soon.",
        { id: "contact-toast" }
      );
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again later.", {
        id: "contact-toast",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 py-12 px-4 font-inter">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-600 mb-10 text-center leading-tight">
          Get in Touch with Us!
        </h1>

        <p className="text-center text-lg text-gray-700 mb-10 max-w-2xl mx-auto">
          Have questions, feedback, or just want to say hello? Fill out the form
          below. We're here to help!
        </p>

        <div
          ref={formRef}
          className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 translate-y-5">
          <h2 className="text-3xl font-bold text-black mb-6 text-center">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-black text-sm font-semibold mb-2">
                Your Name
              </label>
              <input
                id="name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-black text-sm font-semibold mb-2">
                Your Email
              </label>
              <input
                id="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                type="email"
                name="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-black text-sm font-semibold mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                name="message"
                rows="6"
                placeholder="Type your message here..."
                value={formData.message}
                onChange={handleChange}
                required></textarea>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center bg-green-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
