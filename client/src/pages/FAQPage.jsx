import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const contentRef = useRef(null);

  const faqs = [
    { question: 'What is InstantPick?', answer: 'InstantPick is an innovative e-commerce and delivery platform designed to streamline your online shopping experience.' },
    { question: 'How do I contact customer support?', answer: 'You can reach us via the Help Center or by emailing support@instantpick.com.' },
    { question: 'Can I cancel my order?', answer: 'Yes, within 5 minutes or before assignment to a delivery agent.' },
    { question: 'Is there a delivery charge?', answer: 'Yes, it is dynamically calculated based on distance and other factors.' },
    { question: 'What payment methods do you accept?', answer: 'We accept credit/debit cards and popular digital wallets.' },
    { question: 'How long does delivery take?', answer: 'Usually 30-60 minutes for local orders.' }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.classList.add('fade-in-up');
    }
  }, []);

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 py-12 px-4 font-inter">
      <div
        ref={contentRef}
        className="max-w-5xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-xl opacity-0 translate-y-5"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 text-center">
          Frequently Asked Questions <span className="text-green-600 ml-2 relative">(FAQs)</span>
        </h1>

        {/* Search Bar */}
        <div className="mb-10">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-500 text-gray-800 transition-all duration-300"
          />
        </div>

        {/* FAQ List */}
        <div className="space-y-6">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg shadow-md bg-white transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
              >
                <button
                  className="w-full flex justify-between items-center text-left p-6 text-black font-semibold text-xl focus:outline-none bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  {openIndex === index ? (
                    <ChevronUp className="w-6 h-6 text-green-600 rotate-180 transition-transform duration-300" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-green-600 transition-transform duration-300" />
                  )}
                </button>
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    openIndex === index ? 'max-h-screen opacity-100 p-6 pt-0' : 'max-h-0 opacity-0'
                  }`}
                  style={{
                    paddingTop: openIndex === index ? '1.5rem' : '0',
                    paddingBottom: openIndex === index ? '1.5rem' : '0'
                  }}
                >
                  <p className="text-gray-800 leading-relaxed border-t border-green-100 pt-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No FAQs found matching your search.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
