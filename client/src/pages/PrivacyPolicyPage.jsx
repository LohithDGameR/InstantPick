import React, { useEffect, useRef } from 'react';

const PrivacyPolicyPage = () => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.classList.add('fade-in-up');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 py-12 px-4 font-inter">
      <div
        ref={contentRef}
        className="max-w-5xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-xl opacity-0 translate-y-5 transition-all duration-700 ease-out"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-8 text-center leading-tight">
          Privacy <span className="text-green-600 ml-2 relative">Policy</span>
        </h1>

        <p className="text-lg text-gray-700 mb-6 leading-relaxed border-l-4 border-green-400 pl-4 bg-green-50 p-3 rounded-md">
          At <span className="font-semibold text-black">InstantPick</span>, we are committed to protecting your personal information and your right to privacy. This Privacy Policy explains what information we collect, how we use it, and your rights.
        </p>

        {[
          {
            id: 1,
            title: "Information We Collect",
            content: (
              <ul className="list-disc list-inside text-gray-700 ml-4 space-y-2 leading-relaxed">
                <li><strong>Personal Details:</strong> Name, email, and phone number during sign-up or orders.</li>
                <li><strong>Location Data:</strong> For delivery tracking and order accuracy.</li>
                <li><strong>Payment Info:</strong> Processed securely via third-party gateways; we don’t store card data.</li>
                <li><strong>Usage Data & Cookies:</strong> IP, browser, pages visited, used to enhance your experience.</li>
              </ul>
            )
          },
          {
            id: 2,
            title: "How We Use Your Information",
            content: (
              <ul className="list-disc list-inside text-gray-700 ml-4 space-y-2 leading-relaxed">
                <li>To provide and manage delivery services.</li>
                <li>To process payments securely.</li>
                <li>To improve app features and your experience.</li>
                <li>To send updates, promotions, and service notifications.</li>
              </ul>
            )
          },
          {
            id: 3,
            title: "Data Sharing",
            content: (
              <p className="text-gray-700 leading-relaxed">
                <span className="font-semibold">We never sell your data.</span> We only share with trusted partners like payment and logistics services, strictly for service delivery and under confidentiality agreements.
              </p>
            )
          },
          {
            id: 4,
            title: "Data Security",
            content: (
              <p className="text-gray-700 leading-relaxed">
                We use encryption, secure servers, and access controls to protect your information from unauthorized access or misuse.
              </p>
            )
          },
          {
            id: 5,
            title: "Your Rights",
            content: (
              <p className="text-gray-700 leading-relaxed">
                You can access, update, or delete your data anytime. Contact us to exercise these rights.
              </p>
            )
          },
          {
            id: 6,
            title: "Contact Us",
            content: (
              <p className="text-gray-700 leading-relaxed">
                For questions about our Privacy Policy, reach out at <strong className="text-green-600">privacy@instantpick.com</strong>.
              </p>
            )
          }
        ].map(section => (
          <div
            key={section.id}
            className="mb-8 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <h2 className="text-2xl font-bold text-green-700 mb-3 flex items-center">
              <span className="text-green-500 mr-2 text-3xl">{section.id}.</span> {section.title}
            </h2>
            {section.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
