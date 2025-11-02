"use client";

import Link from "next/link";
import { Playfair_Display } from "next/font/google";

import AdminSearchInput from "./AdminSearchInput";

const playfair_Display = Playfair_Display({ subsets: ['latin'] });

export default function AdminHeader() {

    return (
        <header>

            <div className="bg-white text-black flex flex-col md:flex-row justify-between items-center px-8  sm:px-10 pt-4 pb-1 space-y-4 md:space-y-0 mx-2">

                <div className="text-center lg:text-left">
                    <Link href="/" className={`${playfair_Display.className} text-3xl md:text-4xl font-medium`}>
                        Dolce Vita
                    </Link>
                </div>

                <div className="px-4 flex gap-5 justify-between items-end">

                    <div className="w-full lg:w-auto flex items-center justify-center">
                        <AdminSearchInput />
                    </div>
                
                </div>
            </div>
        </header>
    );
}