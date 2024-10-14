import React from "react";

const AboutUsSection = () => {
  return (
    <section className="py-6 mt-6 mx-52 border-t-[1.5px] border-gray-300">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-4">
          {/* Decorative SVG */}
          <svg fill="#9ca3af" width="64px" height="64px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M12,1a1,1,0,0,0-1,1v9.586L6.293,16.293a1,1,0,0,0,0,1.414l5,5a1,1,0,0,0,1.414,0l5-5a1,1,0,0,0,0-1.414L13,11.586V2A1,1,0,0,0,12,1Zm0,19.586L8.414,17,12,13.414,15.586,17ZM6,13A2.993,2.993,0,0,0,7,7.184V2A1,1,0,0,0,5,2V7.184A2.993,2.993,0,0,0,6,13ZM6,9a1,1,0,1,1-1,1A1,1,0,0,1,6,9Zm15,1a3,3,0,0,0-2-2.816V2a1,1,0,0,0-2,0V7.184A2.995,2.995,0,1,0,21,10Zm-4,0a1,1,0,1,1,1,1A1,1,0,0,1,17,10Z"></path></g></svg>
        </div>

        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
         Qui sommes-nous
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Nous sommes un magasin de meubles et de décoration intérieure haut de gamme, dédié à vous apporter des produits de qualité et élégants pour vos espaces de vie. Explorez notre large gamme de designs modernes, classiques et minimalistes qui rehaussent le confort et l’esthétique de votre maison.
        </p>
      </div>
    </section>
  );
};

export default AboutUsSection;