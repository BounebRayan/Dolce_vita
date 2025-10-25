"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";
import AnouncementBar from "./AnouncementBar";
import NavBar from "./NavBar";
import { useCart } from "../../contexts/CartContext";

import { Playfair_Display } from "next/font/google";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

const playfair_Display = Playfair_Display({ subsets: ['latin'] });

export default function Header() {
    const { totalItems } = useCart();

    return (
        <header>
            
            {/* Top bar */}
            <AnouncementBar/>
            
            {/* Main header */}
            <div className="px-4 md:px-6 lg:px-10 pt-3.5 pb-1 flex flex-col md:flex-row justify-between items-center space-y-2.5 md:space-y-0">

                <div className="text-center lg:text-left">
                    <Link href="/" className={`${playfair_Display.className} font-medium text-3xl md:text-4xl tracking-wide`}>
                        DOLCE VITA
                    </Link>
                </div>

                <div className="px-4 flex gap-5 justify-between items-end">

                    <div className="w-full lg:w-auto flex items-center justify-center">
                        <SearchBar />
                    </div>

                    <Link href="/cart" className="relative">
                        <ShoppingCartIcon className="h-6 w-6 cursor-pointer relative transform transition duration-300 hover:scale-105"/>
                        {totalItems > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-[#C94C4C] text-white rounded-full font-semibold text-[11px] w-[18px] h-[18px] flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                
                </div>
            </div>
            
            {/* Navigation bar */}
            <NavBar/>
        </header>
    );
}