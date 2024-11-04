"use client";

import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import SearchInput from "./SearchInput";
import { ShoppingCartIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { useCart } from "../contexts/CartContext"; // import the cart context

const playfair_Display = Playfair_Display({ subsets: ['latin'] });

export default function Header() {
    const { totalItems } = useCart(); // Access totalItems from the cart context

    return (
        <header>
            <div className="bg-[#dcc174] text-black font-normal text-xs w-full py-[10px] px-[10px] gap-1 text-center justify-center flex">
                Besoin d'assistance ? Appelez-nous au : <span className="font-medium">24 331 900</span> ou rendez-nous visite dans l'un de 
                <Link href="/magasins" className="flex items-center gap-1 underline font-medium">
                    <MapPinIcon className="h-3 w-3 text-black" /> Nos Magasins
                </Link>
            </div>

            <div className="bg-white text-black flex flex-col lg:flex-row justify-between items-center px-8 lg:px-10 pt-4 pb-1 space-y-4 lg:space-y-0">
                <div className="text-center lg:text-left">
                    <Link href="/" className={`${playfair_Display.className} text-3xl lg:text-4xl font-medium`}>
                        Dolce Vita
                    </Link>
                </div>

                <div className="px-4 flex gap-5 justify-between items-end">
                    <div className="w-full lg:w-auto flex items-center justify-center">
                        <SearchInput />
                    </div>

                    <Link href="/cart" className="relative">
                        <ShoppingCartIcon className="h-6 w-6 text-black cursor-pointer" />
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
