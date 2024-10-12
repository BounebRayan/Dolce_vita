'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from "framer-motion";

export default function SearchInput() {

  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchValue)}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleClearInput = () => {
    setSearchValue('');
    inputRef.current?.focus();
  };

  const handleIconClick = () => {
    if (searchValue === '') {
      inputRef.current?.focus();
      inputRef.current!.placeholder = '';
    }
  };

  const handleInputBlur = () => {
    if (searchValue === '') {
      inputRef.current!.placeholder = 'Rechercher';
    }
    setIsFocused(false);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    inputRef.current!.placeholder = '';
  };

  return (
    <form onSubmit={handleSearchSubmit} className="flex items-center border-b-[1px] border-black w-80">
      <input
        type="text"
        ref={inputRef}
        placeholder="Rechercher"
        aria-label="Search"
        value={searchValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        className="placeholder:text-black text-lg outline-none flex-grow"
      />
      {searchValue === '' ? (
        <button type="button" onClick={handleIconClick} className="ml-2">
          <MagnifyingGlassIcon className="h-6 w-6 text-black" />
        </button>
      ) : (
        <button type="button" onClick={handleClearInput} className="ml-2">
          <XMarkIcon className="h-6 w-6 text-black" />
        </button>
      )}
    </form>
  );
}
