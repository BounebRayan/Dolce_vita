'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { categories, hasSubsubcategories, getSubsubcategoriesByType } from '@/config/categories';
import { CategoryItem } from '@/config/categories';
import { motion, AnimatePresence } from 'motion/react';

const AdminNavbar: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const navbarRef = useRef<HTMLElement>(null);

  const handleMouseLeave = () => {
    setHoveredItem(null);
    setHoveredCategory(null);
  };

  return (
    <nav
      ref={navbarRef}
      className="pb-2 bg-white text-black relative px-10 z-50 border-b mb-2"
      onMouseLeave={handleMouseLeave}
    >
      <ul className="flex md:justify-start justify-center space-x-5 pt-2 md:pt-0 mx-2">
      <Link href="/admin">
          <NavItem onHover={() => setHoveredItem(null)}>Accueil</NavItem>
        </Link>
        <NavItem onHover={() => setHoveredItem('deco')}>Décorations</NavItem>
        <NavItem onHover={() => setHoveredItem('meuble')}>Meubles</NavItem>
        <Link href="/admin/orders">
          <NavItem onHover={() => setHoveredItem(null)}>Commandes</NavItem>
        </Link>
        <Link className=' text-nowrap' href="/admin/add-product">
          <NavItem onHover={() => setHoveredItem(null)}>Ajout Produit</NavItem>
        </Link>
      </ul>

      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            className="absolute z-50 px-10 py-4 rounded-sm h-max bg-white border-b border-r shadow-lg md:w-[300px] w-full"
            style={{
              top: navbarRef.current?.offsetHeight,
              left: 0,
            }}
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
              className="flex flex-col space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.15 }}
            >
              {categories[hoveredItem as keyof typeof categories].map((category: CategoryItem, index) => (
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
                  onMouseEnter={() => hasSubsubcategories(category.type) && setHoveredCategory(category.type)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <Link
                    href={`/admin/categories/${category.type}`} 
                    onClick={()=>{setHoveredItem(null); setHoveredCategory(null);}}
                    className="relative after:absolute after:w-full after:h-[0.5px] after:bg-[#dcc174] after:left-0 after:-bottom-[0.5px] after:transition-transform after:duration-300 hover:after:scale-x-100 after:scale-x-0"
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
                        onMouseEnter={() => setHoveredCategory(category.type)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        {category.subsubcategories.map((subsub) => (
                          <motion.li 
                            key={subsub.type}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Link
                              href={`/admin/categories/${category.type}/${subsub.type}`}
                              onClick={() => {
                                setHoveredItem(null);
                                setHoveredCategory(null);
                              }}
                              className="relative after:absolute after:w-full after:h-[0.5px] after:bg-[#dcc174] after:left-0 after:-bottom-[0.5px] after:transition-transform after:duration-300 hover:after:scale-x-100 after:scale-x-0 text-sm"
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
}

const NavItem: React.FC<NavItemProps> = ({ children, onHover }) => (
  <li
    onMouseEnter={onHover}
    onMouseLeave={() => onHover()}
    className="tracking-[0.25px] font-normal relative text-black cursor-pointer after:absolute after:w-full after:h-[0.5px] after:bg-[#dcc174] after:left-0 after:-bottom-[0.5px] after:transition-transform after:duration-300 hover:after:scale-x-100 after:scale-x-0"
    style={{ paddingBottom: '2px' }}
  >
    {children}
  </li>
);

export default AdminNavbar;
