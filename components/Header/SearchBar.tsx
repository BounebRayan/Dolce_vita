"use client";

import { useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'motion/react';

export default function SearchBar() {
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="w-80 md:w-72 lg:w-80 border-b border-black flex items-center">

      {/* Search Input */}
      <input
        type="text"
        placeholder="Recherche de produits"
        aria-label="Search"
        className="placeholder:text-black text-md outline-none flex-grow"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        ref={inputRef}
      />

      {/* Search and Clear Icons */}
      <div className="flex items-center">
        <button type="submit" className="ml-2" aria-label="Search">
          <MagnifyingGlassIcon className="h-5 w-5 transform transition duration-300 hover:scale-105" />
        </button>
        <AnimatePresence>
          {searchValue && (
            <motion.button 
              type="button" 
              onClick={(e)=> setSearchValue('')} 
              className="ml-2" 
              aria-label="Clear"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ 
                duration: 0.2, 
                ease: "easeInOut" 
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <XMarkIcon className="h-[23px] w-[23px]" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

    </form>
  );
}

// Done