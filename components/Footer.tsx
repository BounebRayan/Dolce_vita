"use client";

import { Playfair_Display } from "next/font/google";
import Link from "next/link";
import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const playfair_Display = Playfair_Display({ subsets: ['latin'] });

export default function Footer() {
  return (
    <footer className="bg-white text-black py-8 px-6 md:px-16 border-t">
      <div className="mx-[11px] grid grid-cols-1 lg:grid-cols-5 gap-7 text-sm md:text-base text-center lg:text-left">
        {/* Informations sur l'entreprise */}
        <div>
          <Link href="/" className={`${playfair_Display.className} text-2xl font-bold text-gray-900`}>
            DOLCE VITA
          </Link>
          <p className="text-gray-500 text-xs">DEPUIS 2021</p>
          <p className="mt-2">Meubles – Décorations</p>
          <p className="mt-1">151, Avenue de l’UMA, La Soukra, Tunis</p>
          <p className="mt-1">4022, Avenue Yasser Arafat, Sahloul, Sousse</p>
        </div>

        {/* Découvrez nos meubles */}
        <div>
          <h3 className="font-bold uppercase text-sm border-b border-black pb-1">DÉCOUVREZ NOS nouveautés</h3>
          <ul className="mt-2 space-y-1">
            <li><Link href="/categories/salons">Salons</Link></li>
            <li><Link href="/categories/chambres">Chambres à coucher</Link></li>
            <li><Link href="/categories/salles à manger">Salles à manger</Link></li>
            <li><Link href="/categories/Consoles & meubles d’entrée">Consoles & Meubles d’entrée</Link></li>
          </ul>
        </div>

        {/* Meublez vos salons */}
        <div>
          <h3 className="font-bold uppercase text-sm border-b border-black pb-1">MEUBLEZ VOS SALONS</h3>
          <ul className="mt-2 space-y-1">
            <li><Link href="/categories/canapés & fauteuils" >Canapés & Fauteuils</Link></li>
            <li><Link href="/categories/tables basses & tables de coin" >Tables basses & Tables de coin</Link></li>
            <li><Link href="/categories/meubles tv">Meubles TV</Link></li>
          </ul>
        </div>

        {/* Décorez votre maison */}
        <div >
          <h3 className="font-bold uppercase text-sm border-b border-black pb-1">DÉCOREZ VOTRE MAISON</h3>
          <ul className="mt-2 space-y-1">
            <li><Link href="/categories/accessoires déco">Accessoires Déco</Link></li>
            <li><Link href="/categories/art-de-la-table">Art de la Table</Link></li>
            <li><Link href="/categories/luminaires">Luminaires</Link></li>
            <li><Link href="/categories/miroirs">Miroirs</Link></li>
          </ul>
        </div>

        {/* Suivez-nous sur les réseaux sociaux */}
        <div>
          <h3 className="font-bold uppercase text-sm border-b border-black pb-1">SUIVEZ-NOUS SUR LES RÉSEAUX SOCIAUX</h3>
          <ul className="mt-2 flex flex-row lg:flex-col gap-2 items-center lg:items-start justify-center lg:justify-start">
            <li className="flex items-center gap-2 hover:scale-105 transition-all duration-300 cursor-pointer">
              <FaFacebook size={24} />
              <Link href="https://www.facebook.com/DolceVitaLuxuryHomeCollection">Facebook</Link>
            </li>
            <li className="flex items-center gap-2 hover:scale-105 transition-all duration-300 cursor-pointer">
              <FaInstagram size={24} />
              <Link href="https://www.instagram.com/dolce_vita_home_collection">Instagram</Link>
            </li>
            <li className="flex items-center gap-2 hover:scale-105 transition-all duration-300 cursor-pointer">
              <FaLinkedin size={24} />
              <Link href="https://www.linkedin.com/company/dolce-vita-home-collection" >LinkedIn</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
