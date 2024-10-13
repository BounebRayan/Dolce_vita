'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const categories = {
    deco: ['Vases', 'Statues', 'Lamps'],
    meuble: ['Tables', 'Chairs', 'Sofas'],
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
          href="/deco"
          currentPath={pathname}
          onHover={() => setHoveredItem('deco')}
        >
          Décos
        </NavItem>
        <NavItem
          href="/meuble"
          currentPath={pathname}
          onHover={() => setHoveredItem('meuble')}
        >
          Meubles
        </NavItem>
      </ul>
      {hoveredItem && (
        <div
          className="absolute left-0 right-0 flex justify-center bg-white border-t-[1px] border-gray-200 z-10"
          onMouseEnter={() => setHoveredItem(hoveredItem)}
          onMouseLeave={handleMouseLeave}
        >
          <ul className="flex space-x-4 py-2">
            {categories[hoveredItem as keyof typeof categories].map((category) => (
              <li key={category}>
                <Link href={`/${hoveredItem}/${category.toLowerCase()}`} className="hover:underline">
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
        className={`tracking-widest font-medium hover:border-b-[1px] ${isActive ? 'border-black border-b-[1.5px]' : ''} border-gray-300 transition-colors duration-300 rounded-sm`}
      >
        {children}
      </Link>
    </li>
  );
};

export default Navbar;
