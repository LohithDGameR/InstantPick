import React, { useEffect, useRef } from 'react';

const TermsAndConditionsPage = () => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.classList.add('fade-in-up');
    }
  }, []);

  return (
    <div className="min-h-screen bg-white py-12 px-4 font-inter text-black">
      <div
        ref={contentRef}
        className="max-w-5xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-xl opacity-0 translate-y-5 transition-all duration-700 ease-out"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-8 text-center leading-tight">
          Terms<span className="text-green-600 ml-2 relative">&</span> Conditions
        </h1>

        <p className="text-lg text-gray-800 mb-6 leading-relaxed border-l-4 border-green-600 pl-4 bg-gray-50 p-3 rounded-md">
          Welcome to <span className="font-semibold text-green-700">InstantPick</span>. By accessing or using our platform, you agree to be bound by these Terms & Conditions.
          Please read them carefully before proceeding with our services.
        </p>

        {[
          {
            title: 'Use of the Platform',
            content:
              'You must be at least 18 years old to use our services. You agree to use the platform and services solely for lawful purposes and in accordance with these Terms. You also agree not to misuse, disrupt, or interfere with the platform\'s functionality.',
          },
          {
            title: 'Account Responsibility',
            content:
              'You are solely responsible for maintaining the confidentiality of your account credentials (username and password) and for all activities that occur under your account. Please notify us immediately of any unauthorized use or breach of security.',
          },
          {
            title: 'Orders & Delivery',
            content:
              'All orders placed through our platform are subject to availability and confirmation. Delivery time estimates are provided for your convenience but are not guaranteed. We strive to fulfill orders promptly and efficiently.',
          },
          {
            title: 'Payments & Refunds',
            content:
              'Payments for services and products must be made through our integrated secure payment gateway. Refunds are processed in accordance with our separate Refund Policy, which you can find on our website.',
          },
        ].map((section, index) => (
          <div
            key={index}
            className="mb-8 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <h2 className="text-2xl font-bold text-green-700 mb-3 flex items-center">
              <span className="text-green-600 mr-2 text-3xl">{index + 1}.</span> {section.title}
            </h2>
            <p className="text-gray-800 leading-relaxed">{section.content}</p>
          </div>
        ))}

        {/* Section 5 */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-green-700 mb-3 flex items-center">
            <span className="text-green-600 mr-2 text-3xl">5.</span> Prohibited Activities
          </h2>
          <ul className="list-disc list-inside text-gray-800 ml-4 space-y-2 leading-relaxed">
            <li>Using the service for any illegal or unauthorized purposes.</li>
            <li>Attempting to gain unauthorized access to or disrupt our service, servers, or networks.</li>
            <li>Providing false, misleading, or inaccurate information during registration or use of the service.</li>
            <li>Engaging in any activity that could harm, disable, overburden, or impair the platform.</li>
          </ul>
        </div>

        {/* Sections 6, 7, 8 */}
        {[
          {
            title: 'Termination',
            content:
              'We reserve the right to suspend or terminate your access to our services, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.',
          },
          {
            title: 'Changes to the Terms',
            content:
              'We may modify or update these Terms at any time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the service after such modifications constitutes your acceptance of the new Terms.',
          },
          {
            title: 'Contact Us',
            content:
              'If you have any questions or concerns about these Terms & Conditions, please do not hesitate to contact us at ',
            email: 'support@instantpick.com',
          },
        ].map((section, index) => (
          <div
            key={index + 6}
            className="mb-8 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <h2 className="text-2xl font-bold text-green-700 mb-3 flex items-center">
              <span className="text-green-600 mr-2 text-3xl">{index + 6}.</span> {section.title}
            </h2>
            <p className="text-gray-800 leading-relaxed">
              {section.content}
              {section.email && (
                <strong className="text-green-700">{section.email}</strong>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
