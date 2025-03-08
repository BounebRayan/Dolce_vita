'use client';

import Link from "next/link";
import React from "react";
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const AboutUsSection = () => {
  return (
    <section className=" mb-6 sm:mx-3 md:mx-3 mt-6 bg-[#F5F5F1] flex flex-col lg:flex-row items-center lg:items-start sm:rounded-lg">

      {/* Left Side: Image */}
      <div className="w-full lg:w-1/2 h-[250px] sm:h-[400px] lg:h-[700px] bg-black sm:rounded-lg">
        <img
          src="/images/aboutus.jpg"
          alt="About Us"
          className="w-full h-full object-cover sm:rounded-lg"
        />
      </div>

      {/* Right Side: Text */}
      <div className="w-full lg:w-1/2 px-6 sm:px-10 md:px-16 lg:px-20 pb-6 flex flex-col items-center my-auto">
        <img src="/images/logo.png" alt="Logo" className="md:h-32 h-24 mt-5 md:mt-2"/>
        <div className="text-center">
  <h1 className="text-xl font-medium text-gray-900">
    Dolce Vita Home Collection : Référence en Ameublement et Décoration en Tunisie
  </h1>
  <p className="mt-3 text-lg text-gray-700 max-w-2xl mx-auto hidden lg:block">
    Explorez notre collection exclusive de meubles et accessoires où design et qualité se rencontrent. Trouvez le canapé, la table ou l’objet déco idéal pour sublimer votre intérieur.
  </p>
  <p className="mt-2 text-lg text-gray-700">
    Plongez dans l’univers Dolce Vita en visitant nos <span className="font-semibold text-gray-900">showrooms à Tunis La Soukra et Sousse Sahloul</span>, et laissez-vous inspirer par l’élégance et le savoir-faire.
  </p>

</div>
        {/*<Link href={"/new"}>
        <button className="border border-black px-4 py-2 sm:px-5 sm:py-2 flex items-center gap-1 mt-3 hover:bg-[#b89f53] bg-[#dcc174] transition-colors duration-300">
          Decouvrir <ChevronRightIcon className="h-4 w-4 text-black"/>
        </button>
        </Link>*/}
      </div>
    </section>
  );
};

export default AboutUsSection;
