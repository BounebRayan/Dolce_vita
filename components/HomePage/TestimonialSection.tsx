"use client";

import React from "react";
import { PiQuotesDuotone } from "react-icons/pi";
import Marquee from "react-fast-marquee";
import localFont from 'next/font/local';


const Zodiak = localFont({
  src: [
    { path: '../../public/fonts/Zodiak/Zodiak-Thin.otf', weight: '100', style: 'normal' },
    { path: '../../public/fonts/Zodiak/Zodiak-Light.otf', weight: '300', style: 'normal' },
    { path: '../../public/fonts/Zodiak/Zodiak-Regular.otf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Zodiak/Zodiak-Bold.otf', weight: '700', style: 'normal' },
    { path: '../../public/fonts/Zodiak/Zodiak-Italic.otf', weight: '400', style: 'italic' },
    { path: '../../public/fonts/Zodiak/Zodiak-LightItalic.otf', weight: '300', style: 'italic' },

  ],
});

const Sora = localFont({
  src: [
    { path: '../../public/fonts/Sora/Sora-Light.otf', weight: '300', style: 'normal' },
    { path: '../../public/fonts/Sora/Sora-Regular.otf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Sora/Sora-Bold.otf', weight: '700', style: 'normal' },
  ],
});

const testimonials = [
  {
    id: 1,
    quote: "Un espace fabuleux, des articles de décoration très chics, je suis énormément satisfaite, ainsi, un grand merci au personnels pour leurs attitudes professionnels et leurs accueils chaleureux que je remarques très rarement dans d'autres services.",
    author: "Yasmine Ben Harzallah"
  },
  {
    id: 2,
    quote: "Je tiens à vous remercier Dolce Vita pour l'excellent service et la qualité.",
    author: "Amal Haddaji"
  },
  {
    id: 3,
    quote: "Espace agréable bien rangé surtout les personnels de magasin sont aimables et généreux.",
    author: "Samar Chaouch"
  },
  {
    id: 4,
    quote: "Je suis très satisfait de la qualité des produits et du service client, rapide et efficace. Je recommande vivement Dolce Vita.",
    author: "Amen Allah M."
  }
];

export default function TestimonialSection() {
  return (
    <section className="my-12">
      {/* Section Header */}
      <div className="text-center">
        <h2 className={`${Zodiak.className} text-3xl md:text-4xl font-light text-gray-900 mb-4`}>
          Les témoignages de nos clients
        </h2>
        <div className="flex items-center justify-center gap-2 text-[#b8a46b]">
          <div className="w-8 h-px bg-[#b8a46b]"></div>
          <PiQuotesDuotone className="text-2xl" />
          <div className="w-8 h-px bg-[#b8a46b]"></div>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative">
       

        {/* Infinite Marquee */}
        <div className="py-6 md:py-10">
          <Marquee
            speed={30}
            gradient={false}
            pauseOnHover={false}
          >
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="flex-shrink-0 mx-6 md:w-[800px] w-[400px]">
                <div className=" text-center flex flex-col items-center justify-center pb-4 min-h-[200px] max-h-[250px] px-6">
                  <blockquote className={`${Zodiak.className} text-lg md:text-xl text-black font-light italic leading-relaxed mb-4`}>
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-8 h-px bg-[#b8a46b]"></div>
                    <cite className={`${Zodiak.className} text-base  text-[#b8a46b]`}>
                      {testimonial.author}
                    </cite>
                    <div className="w-8 h-px bg-[#b8a46b]"></div>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>

      </div>
    </section>
  );
}
