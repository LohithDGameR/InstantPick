import React, { useEffect, useRef } from 'react';
import { Globe, Users } from 'lucide-react';

const AboutUs = () => {
  const titleRef = useRef(null);
  const paragraphRefs = useRef([]);
  const iconSectionRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) titleRef.current.classList.add('animate-fade-in-down');

    paragraphRefs.current.forEach((el, index) => {
      if (el) {
        el.style.animationDelay = `${0.3 + index * 0.2}s`;
        el.classList.add('animate-fade-in-up');
      }
    });

    if (iconSectionRef.current) iconSectionRef.current.classList.add('animate-scale-in');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-12 px-4 font-inter">
      <div className="max-w-5xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-xl">
        <h1
          ref={titleRef}
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center leading-tight opacity-0"
        >
          About <span className="text-green-600 ml-2 relative">Instant Pick</span>
        </h1>

        {[
          `Welcome to Instant Pick – your premier eCommerce platform dedicated to providing a fast, reliable, and exceptionally convenient online shopping experience. We are passionately committed to delivering the best user journey by seamlessly connecting customers with top-tier products, ensuring secure transactions, and offering prompt delivery services.`,
          `Our journey began with a clear vision: to revolutionize and simplify shopping through the intelligent application of technology, thereby creating a truly seamless digital marketplace. From the latest fashion trends to cutting-edge electronics, and an extensive array of essential goods in between – we've meticulously curated our offerings to ensure we've got you covered for all your needs.`,
          `At Instant Pick, customer satisfaction isn't just a goal; it's our utmost priority. Our dedicated team works tirelessly around the clock to ensure timely deliveries, rigorous quality checks on all products, and continuous improvements to our platform, striving to exceed your expectations with every interaction.`,
          `Thank you for choosing Instant Pick as your trusted shopping destination. We are excited and honored to be a part of your daily life, making your shopping effortless and enjoyable.`,
        ].map((text, i) => (
          <p
            key={i}
            ref={(el) => (paragraphRefs.current[i] = el)}
            className="text-lg text-gray-700 mb-6 leading-relaxed opacity-0"
          >
            {text.split("Instant Pick").map((part, index, arr) =>
              index < arr.length - 1 ? (
                <>
                  {part}
                  <span className="text-green-700 font-semibold">Instant Pick</span>
                </>
              ) : (
                part
              )
            )}
          </p>
        ))}

        <div
          ref={iconSectionRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center bg-green-50 p-8 rounded-xl shadow-inner opacity-0 scale-95"
        >
          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:scale-105 transition-transform duration-300">
            <Globe className="w-14 h-14 text-green-700 mb-4 animate-bounce-icon" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Our Vision</h3>
            <p className="text-gray-600">
              To be the most trusted and convenient online marketplace globally, empowering users with seamless access to <span className="text-green-700 font-semibold">quality products</span> and services.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:scale-105 transition-transform duration-300">
            <Users className="w-14 h-14 text-green-700 mb-4 animate-bounce-icon delay-100" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Our Mission</h3>
            <p className="text-gray-600">
              To simplify everyday shopping through <span className="text-green-700 font-semibold">innovative technology</span>, exceptional customer service, and a commitment to <span className="text-green-700 font-semibold">sustainable practices</span>.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 1s ease-out forwards;
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }

        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.8s ease-out forwards;
          animation-delay: 0.7s;
        }

        @keyframes bounce-icon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-icon {
          animation: bounce-icon 1.5s infinite ease-in-out;
        }
        .animate-bounce-icon.delay-100 {
          animation-delay: 0.1s;
        }
      `}</style>
    </div>
  );
};

export default AboutUs;
