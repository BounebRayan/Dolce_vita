'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { categories } from '../../config/categories';

export default function Navbar() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleMouseLeave = useCallback(() => {
    setHoveredItem(null);
  }, []);

  return (
    <nav className="pb-1.5 relative lg:px-10 px-6 z-50 mb-1 md:w-fit" onMouseLeave={handleMouseLeave}>

      {/* nav bar elements */}
      <ul className="flex md:justify-start justify-center space-x-5 pt-2 md:pt-0">
        <Link href="/" aria-label="Accueil">
          <NavItem onHover={() => setHoveredItem(null)}>ACCUEIL</NavItem>
        </Link>
        <NavItem onHover={() => setHoveredItem('meuble')}>MEUBLES</NavItem>
        <NavItem onHover={() => setHoveredItem('deco')}>DÉCORATIONS</NavItem>
      </ul>
      
      {/* dropdown */}
      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            className="absolute z-50 px-10 py-4 rounded-b-md md:rounded-l-none h-max bg-white border-b md:border-r border-white/20 shadow-lg md:w-[350px] w-full"
            style={{ top: '110%', left: 0 }}
            onMouseEnter={() => setHoveredItem(hoveredItem)}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ 
              duration: 0.15, 
              ease: "easeOut" 
            }}
          >
            <motion.ul 
              className="flex flex-col space-y-2.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.15 }}
            >
              {categories[hoveredItem as keyof typeof categories].map((category, index) => (
                <motion.li 
                  key={category.type}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: 0.05 + (index * 0.02), 
                    duration: 0.15,
                    ease: "easeOut"
                  }}
                >
                  <Link
                    href={`/categories/${category.type}`}
                    onClick={() => setHoveredItem(null)}
                    className="relative after:absolute after:w-full after:h-[0.5px] after:bg-[#F6DB8D] after:left-0 after:-bottom-[0.5px] after:transition-transform after:duration-300 hover:after:scale-x-100 after:scale-x-0"
                  >
                    {category.text}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
};

interface NavItemProps {
  children: React.ReactNode;
  onHover: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ children, onHover }) => (
  <li
    onMouseEnter={onHover}
    className="tracking-[0.25px] font-normal relative text-black cursor-pointer after:absolute after:w-full after:h-[0.5px] after:bg-[#F6DB8D] after:left-0 after:-bottom-[0.5px] after:transition-transform after:duration-300 hover:after:scale-x-100 after:scale-x-0"
  >
    {children}
  </li>
);