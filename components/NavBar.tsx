'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const categories = {
    deco: [
      'Accessoires Déco',  'Art de la Table', 'Vases', 'Luminaires', 'Miroirs',
      'Statues', "Bougies & Parfums d’Intérieur", 'Porte-Bougies', 'Linge de Maison', 'Cadres Photo',
      'Décorations Murales', 'Plantes'
    ],
    meuble: [
      'Salons', 'Chambres', 'Salles à Manger', 
      'Canapés & Fauteuils', 'Tables basses & Tables de coin', 'Meubles TV', 
      "Consoles & Meubles d’Entrée"
    ],
  };

  const handleMouseLeave = useCallback(() => {
    setHoveredItem(null);
  }, []);

  return (
    <nav className="pb-1 relative px-10 z-50 border-b mb-2" onMouseLeave={handleMouseLeave}>

      {/* nav bar elements */}
      <ul className="flex md:justify-start justify-center space-x-5 pt-2 md:pt-0">
        <Link href="/" aria-label="Accueil">
          <NavItem onHover={() => setHoveredItem(null)}>ACCUEIL</NavItem>
        </Link>
        <NavItem onHover={() => setHoveredItem('meuble')}>MEUBLES</NavItem>
        <NavItem onHover={() => setHoveredItem('deco')}>DÉCORATIONS</NavItem>
      </ul>
      
      {/* dropdown */}
      {hoveredItem && (
        <div
          className="absolute z-50 px-10 py-4 rounded-sm h-max bg-white border-b md:border-r shadow-lg md:w-[330px] w-full"
          style={{ top: '100%', left: 0 }}
          onMouseEnter={() => setHoveredItem(hoveredItem)}
          onMouseLeave={handleMouseLeave}
        >
          <ul className="flex flex-col space-y-4">
            {categories[hoveredItem as keyof typeof categories].map((category) => (
              <li key={category}>
                <Link
                  href={`/categories/${category.toLowerCase()}`}
                  onClick={() => setHoveredItem(null)}
                  className="relative after:absolute after:w-full after:h-[0.5px] after:bg-[#F6DB8D] after:left-0 after:-bottom-[0.5px] after:transition-transform after:duration-300 hover:after:scale-x-100 after:scale-x-0"
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
    className="tracking-[0.25px] font-normal relative text-black cursor-pointer after:absolute after:w-full after:h-[0.5px] after:bg-[#F6DB8D] after:left-0 after:-bottom-[0.5px] after:transition-transform after:duration-300 hover:after:scale-x-100 after:scale-x-0 pb-1"
  >
    {children}
  </li>
);