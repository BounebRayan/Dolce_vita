"use client";
import Link from "next/link";
import React from "react";
import { ChevronRightIcon } from '@heroicons/react/24/outline';


const AboutUsSection = () => {
  return (
    <section className="my-6 mx-16 mt-10 bg-[#F5F5F1] flex items-center">

      {/* Left Side: Image */}
      <div className="w-1/2 h-[700px] bg-black">
        <img
          src="https://placehold.co/1200x800/C8C8C8/C8C8C8" // Replace with your image URL
          alt="About Us"
          className="w-full h-full object-cover" // Updated styles here
        />
      </div>

      {/* Right Side: Text */}
      <div className="w-1/2 px-20 flex flex-col items-center">
        <p className="text-xl text-black">
          De nouveaux designs évoquent l'essence réconfortante de la convivialité.
        </p>
        <button className="border border-black px-5 py-2 flex items-center gap-1 mt-3 hover:bg-[#dcc174]">Decouvrir <ChevronRightIcon className="h-4 w-4 text-black"/></button>
      </div>
    </section>
  );
};

export default AboutUsSection;
