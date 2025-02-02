"use client";

import Link from "next/link";
import SearchInput from "./SearchInput";
import { useCart } from "../contexts/CartContext";

import { Playfair_Display } from "next/font/google";
import { ShoppingCartIcon, MapPinIcon } from "@heroicons/react/24/outline";
const playfair_Display = Playfair_Display({ subsets: ['latin'] });

export default function Header() {
    const { totalItems } = useCart();

    return (
        <header>
            
            {/* Top bar */}
            <div className="bg-[#F6DB8D] w-full p-[10px] text-xs flex flex-col sm:flex-row items-center justify-center gap-1">
                <div>Besoin d'assistance ? Appelez-nous au : <span className="font-medium">24 331 900</span></div>ou rendez-nous visite dans l'un de 
                <Link href="/showrooms" className="font-medium underline flex items-center gap-1">
                    <MapPinIcon className="h-3 w-3"/>Nos Showrooms
                </Link>
            </div>
            
            {/* Main header */}
            <div className="px-8 md:px-10 pt-4 pb-1 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">

                <div className="text-center lg:text-left">
                    <Link href="/" className={`${playfair_Display.className} font-medium text-3xl md:text-4xl`}>
                        DOLCE VITA
                    </Link>
                </div>

                <div className="px-4 flex gap-5 justify-between items-end">

                    <div className="w-full lg:w-auto flex items-center justify-center">
                        <SearchInput />
                    </div>

                    <Link href="/cart" className="relative">
                        <ShoppingCartIcon className="h-6 w-6 cursor-pointer relative transform transition duration-300 hover:scale-105"/>
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                
                </div>
            </div>
        </header>
    );
}