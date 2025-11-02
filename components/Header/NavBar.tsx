'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { categories, hasSubsubcategories, getSubsubcategoriesByType } from '../../config/categories';

export default function Navbar() {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActiveItem(null);
    setHoveredCategory(null);
  }, []);

  const handleItemClick = useCallback((item: string) => {
    setActiveItem(activeItem === item ? null : item);
  }, [activeItem]);

  return (
    <nav className="pb-1.5 relative lg:px-10 px-6 z-50 mb-1 md:w-fit" onMouseLeave={!isTouchDevice ? handleMouseLeave : undefined}>

      {/* nav bar elements */}
      <ul className="flex md:justify-start justify-center space-x-5 pt-2 md:pt-0">
        <Link href="/" aria-label="Accueil">
          <NavItem onHover={() => !isTouchDevice && setActiveItem(null)} onClick={() => setActiveItem(null)}>ACCUEIL</NavItem>
        </Link>
        <NavItem onHover={() => !isTouchDevice && setActiveItem('deco')} onClick={() => handleItemClick('deco')}>DÉCORATIONS</NavItem>
        <NavItem onHover={() => !isTouchDevice && setActiveItem('meuble')} onClick={() => handleItemClick('meuble')}>MEUBLES</NavItem>
      </ul>
      
      {/* dropdown */}
      <AnimatePresence>
        {activeItem === 'meuble' && (
          <motion.div
            className="absolute z-50 px-10 py-4 rounded-b-md md:rounded-l-none h-max bg-white border-b md:border-r border-white/20 shadow-lg md:w-[350px] w-full"
            style={{ top: '110%', left: 0 }}
            onMouseEnter={() => !isTouchDevice && setActiveItem('meuble')}
            onMouseLeave={!isTouchDevice ? handleMouseLeave : undefined}
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
              {categories.meuble.map((category, index) => (
                <motion.li 
                  key={category.type}
                  className="relative"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: 0.05 + (index * 0.02), 
                    duration: 0.15,
                    ease: "easeOut"
                  }}
                  onMouseEnter={() => !isTouchDevice && hasSubsubcategories(category.type) && setHoveredCategory(category.type)}
                  onMouseLeave={() => !isTouchDevice && setHoveredCategory(null)}
                >
                  <Link
                    href={`/categories/${category.type}`}
                    onClick={() => setActiveItem(null)}
                    className="relative after:absolute after:w-full after:h-[0.5px] after:bg-[#F6DB8D] after:left-0 after:-bottom-[0.5px] after:transition-transform after:duration-300 hover:after:scale-x-100 after:scale-x-0"
                  >
                    {category.text}
                  </Link>
                  <AnimatePresence>
                    {hoveredCategory === category.type && category.subsubcategories && (
                      <motion.ul
                        className="flex flex-col space-y-2 mt-2 ml-6"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.15 }}
                        onMouseEnter={() => !isTouchDevice && setHoveredCategory(category.type)}
                        onMouseLeave={() => !isTouchDevice && setHoveredCategory(null)}
                      >
                        {category.subsubcategories.map((subsub) => (
                          <motion.li 
                            key={subsub.type}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Link
                              href={`/categories/${category.type}/${subsub.type}`}
                              onClick={() => {
                                setActiveItem(null);
                                setHoveredCategory(null);
                              }}
                              className="relative after:absolute after:w-full after:h-[0.5px] after:bg-[#F6DB8D] after:left-0 after:-bottom-[0.5px] after:transition-transform after:duration-300 hover:after:scale-x-100 after:scale-x-0 text-sm"
                            >
                              {subsub.text}
                            </Link>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
        {activeItem === 'deco' && (
          <motion.div
            className="absolute z-50 px-10 py-4 rounded-b-md md:rounded-l-none h-max bg-white border-b md:border-r border-white/20 shadow-lg md:w-[350px] w-full"
            style={{ top: '110%', left: 0 }}
            onMouseEnter={() => !isTouchDevice && setActiveItem('deco')}
            onMouseLeave={!isTouchDevice ? handleMouseLeave : undefined}
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
              {categories.deco.map((category, index) => (
                <motion.li 
                  key={category.type}
                  className="relative"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: 0.05 + (index * 0.02), 
                    duration: 0.15,
                    ease: "easeOut"
                  }}
                  onMouseEnter={() => !isTouchDevice && hasSubsubcategories(category.type) && setHoveredCategory(category.type)}
                  onMouseLeave={() => !isTouchDevice && setHoveredCategory(null)}
                >
                  <Link
                    href={`/categories/${category.type}`}
                    onClick={() => setActiveItem(null)}
                    className="relative after:absolute after:w-full after:h-[0.5px] after:bg-[#F6DB8D] after:left-0 after:-bottom-[0.5px] after:transition-transform after:duration-300 hover:after:scale-x-100 after:scale-x-0"
                  >
                    {category.text}
                  </Link>
                  <AnimatePresence>
                    {hoveredCategory === category.type && category.subsubcategories && (
                      <motion.ul
                        className="flex flex-col space-y-2 mt-2 ml-6"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.15 }}
                        onMouseEnter={() => !isTouchDevice && setHoveredCategory(category.type)}
                        onMouseLeave={() => !isTouchDevice && setHoveredCategory(null)}
                      >
                        {category.subsubcategories.map((subsub) => (
                          <motion.li 
                            key={subsub.type}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Link
                              href={`/categories/${category.type}/${subsub.type}`}
                              onClick={() => {
                                setActiveItem(null);
                                setHoveredCategory(null);
                              }}
                              className="relative after:absolute after:w-full after:h-[0.5px] after:bg-[#F6DB8D] after:left-0 after:-bottom-[0.5px] after:transition-transform after:duration-300 hover:after:scale-x-100 after:scale-x-0 text-sm"
                            >
                              {subsub.text}
                            </Link>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
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
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ children, onHover, onClick }) => (
  <li
    onMouseEnter={onHover}
    onClick={onClick}
    className="tracking-[0.25px] font-normal relative text-black cursor-pointer after:absolute after:w-full after:h-[0.5px] after:bg-[#F6DB8D] after:left-0 after:-bottom-[0.5px] after:transition-transform after:duration-300 hover:after:scale-x-100 after:scale-x-0"
  >
    {children}
  </li>
);