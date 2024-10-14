'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const categories = {
    deco: ['Miroirs', 'Vases', 'Déco Murale', 'Accessoires', 'Lampes'],
    meuble: ['Salon', 'Salle A Manger', 'Chambre'],
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <nav
      className="py-1.5 bg-white text-black border-y-[1px] border-gray-200 relative"
      onMouseLeave={handleMouseLeave}
    >
      <ul className="flex justify-center space-x-8">
        <NavItem
          href="/"
          currentPath={pathname}
          onHover={() => setHoveredItem(null)}
        >
          Accueil
        </NavItem>
        <NavItem
          href="/meuble"
          currentPath={pathname}
          onHover={() => setHoveredItem('meuble')}
        >
          Meubles
        </NavItem>
        <NavItem
          href="/deco"
          currentPath={pathname}
          onHover={() => setHoveredItem('deco')}
        >
          Décos
        </NavItem>
      </ul>
      {hoveredItem && (
        <div
          className="absolute left-0 right-0 flex justify-center bg-white border-t-[1px] border-gray-200 z-10"
          style={{ top: '100%' }}
          onMouseEnter={() => setHoveredItem(hoveredItem)}
          onMouseLeave={handleMouseLeave}
        >
          <ul className="flex space-x-4 py-2">
            {categories[hoveredItem as keyof typeof categories].map((category) => (
              <li key={category}>
                <Link href={`/${hoveredItem}/${category.toLowerCase()}`} className="relative after:absolute after:w-full after:h-[0.5px] after:bg-black after:left-0 after:-bottom-[0.5px] after:transition-transform after:duration-300 hover:after:scale-x-100 after:scale-x-0">
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
  href: string;
  currentPath: string;
  children: React.ReactNode;
  onHover: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ href, currentPath, children, onHover }) => {
  const isActive = href === currentPath;

  return (
    <li
      onMouseEnter={onHover}
      onMouseLeave={() => onHover()}
    >
      <Link
        href={href}
        className={`tracking-[0.25px] font-medium relative after:absolute after:w-full after:h-[1px] after:bg-black after:left-0 after:-bottom-[1px] after:transition-transform after:duration-300 ${
          isActive
            ? 'text-[#1D1D1F] font-semibold after:hidden'
            : 'text-[#565657] hover:after:scale-x-100 after:scale-x-0'
        }`}
        style={{ paddingBottom: '2px' }}
      >
        {children}
      </Link>
    </li>
  );
};

export default Navbar;
