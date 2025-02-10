"use client";

import React, { useState, useEffect } from "react";
import { PiQuotesDuotone } from "react-icons/pi";

const testimonials = [
  {
    id: 1,
    quote: "Je tiens à vous remercier Dolce Vita pour l'excellent service et la qualité",
    author: "Amal Haddaji"
  },
  {
    id: 2,
    quote: "Je suis très satisfait de la qualité des produits et du service client",
    author: "Amen Allah M."
  },
  {
    id: 3,
    quote: "Un espace fabuleux, des articles de décoration très chics , je suis énormément satisfaite, ainsi, un grand merci au personnels pour leurs attitudes professionnels et leurs accueils chaleureux que je remarques très rarement dans d'autres services.",
    author: "Yasmine Ben Harzallah"
  },
  {
    id: 4,
    quote: "Espace agreable bien ranger surtout les personnels de magasin sont aimable et genereux",
    author: "Samar Chaouch"
  }
];

export default function FeedbackBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 10000); // Change quote every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative text-black px-6 py-4 md:px-12 md:py-6 bg-cover bg-center bg-no-repeat mx-3 sm:mx-6 md:mx-10 bg-gray-100 flex items-center justify-center min-h-[150px]">
      <PiQuotesDuotone className="text-4xl absolute left-4 top-4 text-gray-700 opacity-40" />
      <div className="text-center transition-opacity duration-500 ease-in-out p-4 rounded-lg">
        <p className="text-lg md:text-xl font-base italic">"{testimonials[currentIndex].quote}"</p>
        <p className="text-sm md:text-base font-semibold mt-2">— {testimonials[currentIndex].author}</p>
      </div>
    </div>
  );
}
