import { FC } from 'react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import { Playfair_Display } from "next/font/google";

const playfair_Display = Playfair_Display({subsets:['latin']})



const Footer: FC = () => {
  return (
    <footer className=" bg-transparent py-6 border-t mt-2">
      <div className="container mx-auto flex flex-col items-center justify-between md:flex-row">
        {/* Website Name */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <span className={`${playfair_Display.className} text-2xl font-bold text-gray-900`}>Dolce Vita</span>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6 mb-4 md:mb-0">
          <a href="/about" className="text-gray-700 hover:text-gray-900">
            About
          </a>
          <a href="/contact" className="text-gray-700 hover:text-gray-900">
            Contact Us
          </a>
          <a href="/shop" className="text-gray-700 hover:text-gray-900">
            Shop
          </a>
        </div>

        {/* Social Media Links */}
        <div className="flex space-x-4">
          <a
            href="https://www.instagram.com"
            aria-label="Instagram"
            className="text-gray-700 hover:text-gray-900"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="https://www.facebook.com"
            aria-label="Facebook"
            className="text-gray-700 hover:text-gray-900"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook size={20} />
          </a>
        </div>
      </div>

      {/* Privacy Policy and Terms */}
      <div className="mt-4 text-center text-sm text-gray-500">
        © 2024 Dolce Vita. <a href="/privacy-policy" className="hover:underline">Privacy Policy</a> | <a href="/terms" className="hover:underline">Terms and Conditions</a>
      </div>
    </footer>
  );
};

export default Footer;