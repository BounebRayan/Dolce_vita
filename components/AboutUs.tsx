'use client';

import Link from "next/link";
import React from "react";
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const AboutUsSection = () => {
  return (
    <section className="my-6 mx-4 sm:mx-10 md:mx-14 mt-10 bg-[#F5F5F1] flex flex-col lg:flex-row items-center">

      {/* Left Side: Image */}
      <div className="w-full lg:w-1/2 h-[250px] sm:h-[400px] lg:h-[700px] bg-black">
        <img
          src="https://placehold.co/1200x800/C8C8C8/C8C8C8" // Replace with your image URL
          alt="About Us"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side: Text */}
      <div className="w-full lg:w-1/2 px-6 sm:px-10 md:px-16 lg:px-20 py-6 lg:py-0 flex flex-col items-center lg:items-start text-center lg:text-left">
        <p className="text-lg sm:text-xl text-black">
          De nouveaux designs évoquent l'essence réconfortante de la convivialité.
        </p>
        <Link href={"/new"}>
        <button className="border border-black px-4 py-2 sm:px-5 sm:py-2 flex items-center gap-1 mt-3 hover:bg-[#dcc174] transition-colors duration-300">
          Decouvrir <ChevronRightIcon className="h-4 w-4 text-black"/>
        </button>
        </Link>
      </div>
    </section>
  );
};

export default AboutUsSection;
