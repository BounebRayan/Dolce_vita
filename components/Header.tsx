"use client";

import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import { ShoppingCartIcon, MapPinIcon } from "@heroicons/react/24/outline";
import SearchInput from "./SearchInput";
import { useCart } from "../contexts/CartContext";

const playfair_Display = Playfair_Display({ subsets: ['latin'] });

export default function Header() {
    const { totalItems } = useCart();

    return (
        <header>
            
            <div className="bg-[#F6DB8D] text-black font-normal text-xs w-full p-[10px] gap-1 justify-center flex flex-col items-center sm:flex-row">
                <div>Besoin d'assistance ? Appelez-nous au : <span className="font-medium">24 331 900</span></div>ou rendez-nous visite dans l'un de 
                <Link href="/magasins" className="flex items-center gap-1 underline font-medium">
                    <MapPinIcon className="h-3 w-3 text-black" />Nos Showrooms
                </Link>
            </div>

            <div className="bg-white text-black flex flex-col md:flex-row justify-between items-center px-8 md:px-10 pt-4 pb-1 space-y-4 md:space-y-0">

                <div className="text-center lg:text-left">
                    <Link href="/" className={`${playfair_Display.className} text-3xl md:text-4xl font-medium`}>
                        DOLCE VITA
                    </Link>
                </div>

                <div className="px-4 flex gap-5 justify-between items-end">

                    <div className="w-full lg:w-auto flex items-center justify-center">
                        <SearchInput />
                    </div>

                    <Link href="/cart" className="relative">
                        <ShoppingCartIcon className="h-6 w-6 text-black cursor-pointer relative transform transition duration-300 hover:scale-105" />
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