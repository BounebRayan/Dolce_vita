'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navbarRef = useRef<HTMLElement>(null);

  const categories = {
    deco: [
      'Accessoires déco', 'Vases', 'Cadres photo', 'Luminaires', 'Miroirs',
      'Déco murale', "Bougies & parfums d'intérieur", "linges de maison"
    ],
    meuble: ['Salons', 'Chambres', 'Salles À Manger'],
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <nav
      ref={navbarRef}
      className="pb-2 bg-white text-black relative px-10 z-50 border-b mb-2"
      onMouseLeave={handleMouseLeave}
    >
      <ul className="flex justify-start space-x-5">
        <NavItem onHover={() => setHoveredItem('meuble')}>Meubles</NavItem>
        <NavItem onHover={() => setHoveredItem('deco')}>Déco</NavItem>
        <NavItem onHover={() => setHoveredItem(null)}>Nouveautés</NavItem>
      </ul>

      {hoveredItem && (

          <div
            className="absolute z-50 px-10 py-4 rounded-sm h-max bg-white border-b border-r shadow-lg"
            style={{
              top: navbarRef.current?.offsetHeight, // Position the submenu just below the navbar
              left: 0,
              height: 'fit',
              width: '20vw', 
            }}
            onMouseEnter={() => setHoveredItem(hoveredItem)}
            onMouseLeave={handleMouseLeave}
          >
            <ul className="flex flex-col space-y-4">
              {categories[hoveredItem as keyof typeof categories].map((category) => (
                <li key={category}>
                  <Link
                    href={`/categories/${category.toLowerCase()}`}
                    className="relative after:absolute after:w-full after:h-[0.5px] after:bg-[#dcc174] after:left-0 after:-bottom-[0.5px] after:transition-transform after:duration-300 hover:after:scale-x-100 after:scale-x-0"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
      )}
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
    className="tracking-[0.25px] font-medium relative text-black cursor-pointer after:absolute after:w-full after:h-[0.5px] after:bg-[#dcc174] after:left-0 after:-bottom-[0.5px] after:transition-transform after:duration-300 hover:after:scale-x-100 after:scale-x-0"
    style={{ paddingBottom: '2px' }}
  >
    {children}
  </li>
);

export default Navbar;
