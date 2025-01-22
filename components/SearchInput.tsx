'use client';

import { useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

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

  const handleIconClick = (e: FormEvent<Element>) => {
    if (searchValue === '') {
      inputRef.current?.focus();
      inputRef.current!.placeholder = '';
    }
    handleSearchSubmit(e);
  };

  const handleInputBlur = () => {
    if (searchValue === '') {
      inputRef.current!.placeholder = 'Recherche de produits';
    }
    setIsFocused(false);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    inputRef.current!.placeholder = '';
  };

  return (
    <form onSubmit={handleSearchSubmit} className="flex items-center border-b-[1px] border-black lg:w-80 md:w-72 w-80">
      <input
        type="text"
        ref={inputRef}
        placeholder="Recherche de produits"
        aria-label="Search"
        value={searchValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        className="placeholder:text-black text-md outline-none flex-grow"
      />
      {searchValue === '' ? (
        <button type="button" onClick={handleIconClick} className="ml-2">
          <MagnifyingGlassIcon className="h-5 w-5 text-black transform transition duration-300 hover:scale-105" />
        </button>
      ) : (<div className='flex items-center'>
        <button type="button" onClick={handleIconClick} className="ml-2">
        <MagnifyingGlassIcon className="h-4 w-4 text-black transform transition duration-300 hover:scale-105" />
      </button>
        <button type="button" onClick={handleClearInput} className="ml-2">
          <XMarkIcon className="h-5 w-5 text-black transform transition duration-300 hover:scale-105" />
        </button></div>
      )}
    </form>
  );
}
