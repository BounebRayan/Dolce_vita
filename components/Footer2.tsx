"use client";

import { Playfair_Display } from "next/font/google";
import Link from "next/link";
import React from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const playfair_Display = Playfair_Display({ subsets: ['latin'] });

export default function Footer2() {
  return (
    <footer className="bg-white text-black py-8 px-6 md:px-16 border-t mt-7">
      <div className="mx-[11px] grid grid-cols-1 md:grid-cols-5 gap-8 text-sm">
        {/* Informations sur l'entreprise */}
        <div>
          <Link href="/" className={`${playfair_Display.className} text-2xl font-bold text-gray-900`}>
            DOLCE VITA
          </Link>
          <p className="text-gray-500 text-xs">DEPUIS 2019</p>
          <p className="mt-2">Meubles – Décorations</p>
          <p className="mt-1">151, Avenue de l’UMA, La Soukra, Tunis</p>
          <p className="mt-1">4022, Avenue Yasser Arafat, Sahloul, Sousse</p>
        </div>

        {/* Découvrez nos meubles */}
        <div>
          <h3 className="font-bold uppercase text-sm border-b w-fit pb-1">DÉCOUVREZ NOS MEUBLES</h3>
          <ul className="mt-2 space-y-1">
            <li><Link href="#" className="hover:underline">Salons</Link></li>
            <li><Link href="#" className="hover:underline">Chambres à coucher</Link></li>
            <li><Link href="#" className="hover:underline">Salles à manger</Link></li>
            <li><Link href="#" className="hover:underline">Consoles & Meubles d’entrée</Link></li>
          </ul>
        </div>

        {/* Meublez vos salons */}
        <div>
          <h3 className="font-bold uppercase text-sm border-b w-fit pb-1">MEUBLEZ VOS SALONS</h3>
          <ul className="mt-2 space-y-1">
            <li><Link href="#" className="hover:underline">Canapés & Fauteuils</Link></li>
            <li><Link href="#" className="hover:underline">Tables basses & Tables de coin</Link></li>
            <li><Link href="#" className="hover:underline">Meubles TV</Link></li>
          </ul>
        </div>

        {/* Décorez votre maison */}
        <div>
          <h3 className="font-bold uppercase text-sm border-b w-fit pb-1">DÉCOREZ VOTRE MAISON</h3>
          <ul className="mt-2 space-y-1">
            <li><Link href="#" className="hover:underline">Accessoires Déco</Link></li>
            <li><Link href="#" className="hover:underline">Statues</Link></li>
            <li><Link href="#" className="hover:underline">Vases</Link></li>
            <li><Link href="#" className="hover:underline">Miroirs</Link></li>
          </ul>
        </div>

        {/* Suivez-nous sur les réseaux sociaux */}
        <div>
          <h3 className="font-bold uppercase text-sm border-b w-fit pb-1">SUIVEZ-NOUS SUR LES RÉSEAUX SOCIAUX</h3>
          <ul className="mt-2 space-y-1">
            <li className="flex items-center gap-2">
              <FaFacebook size={24} />
              <Link href="#" className="hover:underline">Facebook</Link>
            </li>
            <li className="flex items-center gap-2">
              <FaInstagram size={24} />
              <Link href="#" className="hover:underline">Instagram</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
