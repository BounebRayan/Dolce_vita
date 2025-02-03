'use client';

import Link from "next/link";
import React from "react";
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const AboutUsSection = () => {
  return (
    <section className=" mb-6 mx-3 sm:mx-10 md:mx-10 mt-6 bg-[#F5F5F1] flex flex-col lg:flex-row items-center lg:items-start rounded-sm">

      {/* Left Side: Image */}
      <div className="w-full lg:w-1/2 h-[250px] sm:h-[400px] lg:h-[700px] bg-black">
        <img
          src="/images/banner2.jpg"
          alt="About Us"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side: Text */}
      <div className="w-full lg:w-1/2 px-6 sm:px-10 md:px-16 lg:px-20 pb-6 flex flex-col items-center my-auto">
        <img src="/images/image2vector.svg" alt="Logo" className="w-24 h-32"/>
        <p className="text-lg sm:text-xl text-black text-center block">
        Spécialiste en ameublement et décoration en Tunisie, Dolce vita vous garanti un design mobilier au confort inégalé afin de faire de votre ‘foyer’, un vrai cocon.. Découvrez nos salons modernes, salles à manger intemporelles, chambres à coucher sublimes et décorez vos intérieurs avec des canapés de style, des meubles TV tendances et des fauteuils confortables…
        </p>
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
