"use client";

import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import SearchInput from "./SearchInput";

const playfair_Display = Playfair_Display({subsets:['latin']})

export default function Header(){
    
    
    return(
        <header>
            {/* Contact */}
            <div className="bg-[#dcc174] text-black font-normal text-xs w-full py-2 text-center">Besoin d'assistance ? Appelez-nous au : 29 338 765</div>

            {/* Title, Search Bar and Magasins and Cart */}
            <div className="bg-white text-black flex justify-between items-center px-24 py-4">
                <div>
                    <Link href="/" className={`${playfair_Display.className} text-4xl font-medium`}>
                        Dolce Vita
                    </Link>
                </div>

                <SearchInput/>
                
                <nav className="flex items-center space-x-3">
                    <Link href="/magasins" className="hover:border-b-[1px] border-gray-300">
                        Nos Magasins
                    </Link>
                    <Link href="/cart"aria-label="Cart">
                        <svg width="32px" height="32px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.144"></g>
                            <g id="SVGRepo_iconCarrier"> 
                                <path opacity="0.15" d="M4 7H20V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V7Z" fill="#000000"></path> 
                                <path d="M15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11M20 7L18 3H6L4 7M20 7H4M20 7V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V7" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> 
                            </g>
                        </svg>
                    </Link>
                </nav>
            </div>
        </header>
    );
};