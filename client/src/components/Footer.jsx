import { assets, footerLinks } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-green-50 via-green-100 to-white border-t border-green-200 shadow-inner pt-8 mt-8">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col md:flex-row justify-between gap-12 pb-10 border-b border-green-300 text-gray-700">

          {/* Logo and Description */}
          <div className="flex-1 max-w-lg">
            <img
              src={assets.logo}
              alt="logo"
              className="h-24 w-auto object-contain mb-4"
            />
            <p className="text-lg leading-relaxed text-gray-700 font-light">
              We deliver <strong>fresh, organic groceries</strong> and healthy snacks right to your door.
              Trusted by thousands, we aim to make your shopping experience
              <strong> simple, sustainable, and affordable.</strong>
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-5 mt-6">
              {[
                { icon: assets.facebook_icon, label: "Facebook" },
                { icon: assets.x_icon, label: "X" },
                { icon: assets.instagram, label: "Instagram" },
                { icon: assets.github_icon, label: "GitHub" },
                { icon: assets.linkedin, label: "LinkedIn" },
                { icon: assets.youtube_icon, label: "YouTube" },
              ].map(({ icon, label }, index) => (
                <a
                  href="#"
                  key={index}
                  className="hover:scale-110 hover:-translate-y-1 transition-transform duration-300"
                >
                  <img src={icon} alt={label} className="w-7 h-7" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-10 gap-y-8 w-full md:w-auto">
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-xl text-green-700 mb-4">
                  {section.title}
                </h3>
                <ul className="text-base space-y-2">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link.url}
                        className="text-gray-700 hover:text-green-600 hover:underline transition-all duration-200"
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Bottom Text */}
        <div className="pt-5 pb-3 text-center text-sm md:text-base text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} <strong>Instant Pick</strong>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
