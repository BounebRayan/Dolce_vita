import { FC } from 'react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import { Playfair_Display } from "next/font/google";
import Link from 'next/link'; // Import Link from Next.js

const playfair_Display = Playfair_Display({ subsets: ['latin'] });

const Footer: FC = () => {
  return (
    <footer className="bg-transparent py-6 border-t mt-6">
      <div className="px-12 flex flex-col items-start justify-between md:flex-row">
        {/* Website Name */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <span className={`${playfair_Display.className} text-2xl font-bold text-gray-900`}>Dolce Vita</span>
        </div>

        {/* Navigation Links */}
        <div className='flex flex-col items-center space-y-1.5'>
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              À propos
            </Link>
            <Link href="/magasins" className="text-gray-700 hover:text-gray-900">
              Contact et FAQ
            </Link>
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              Shop
            </Link>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            © 2024 Dolce Vita. <Link href="/" className="hover:underline">Confidentialité</Link> | <Link href="/" className="hover:underline">Mentions légales</Link>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex space-x-4">
          <a
            href="https://www.instagram.com/dolce_vita_home_collection/"
            aria-label="Instagram"
            className="text-gray-700 hover:text-gray-900"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="https://www.facebook.com/DolceVitaLuxuryHomeCollection"
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
    </footer>
  );
};

export default Footer;
