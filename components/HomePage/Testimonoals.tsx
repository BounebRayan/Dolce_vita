import Image from "next/image";
import { PiQuotesDuotone } from "react-icons/pi";

export default function TestimonialSection() {
  return (
    <section className="p-6 md:p-8 bg-gray-100 md:rounded-md  md:mx-7 ">
      <div className="flex xl:flex-row flex-col xl:gap-8 gap-5 items-center">
        {/* Left Side - Image and Heading */}
        <div className="relative">
          <Image
            src="/images/salon2_1.jpg" // Replace with actual image path
            alt="Nature Background"
            width={800}
            height={400}
            className="rounded-md  object-cover"
          />
          <div className="absolute top-4 left-4 bg-white p-4 rounded-md shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 flex gap-2">
             Les témoignages  <br /> de nos clients satisfaits <PiQuotesDuotone className="text-2xl text-gray-800" />
            </h2>
          </div>
          <div className="absolute bottom-4 left-4 text-white text-2xl font-bold">
            10.9K+
          </div>
        </div>

        {/* Right Side - Testimonials */}
        <div className="space-y-5 h-[485px] overflow-y-auto">
          <div className="bg-[#F6DB8D] p-6 rounded-md  shadow-md relative">
            <p className="text-gray-800 text-lg font-medium">
              "Un espace fabuleux, des articles de décoration très chics , je suis énormément satisfaite, ainsi, un grand merci au personnels pour leurs attitudes professionnels et leurs accueils chaleureux que je remarques très rarement dans d'autres services."
            </p>
            <div className="mt-4 text-sm text-gray-600">
              <span className="font-semibold">Yasmine Ben Harzallah</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-md  shadow-md">
            <p className="text-gray-800 text-lg font-medium">
              "Je tiens à vous remercier Dolce Vita pour l'excellent service et la qualité."
            </p>
            <div className="mt-4 text-sm text-gray-600">
              <span className="font-semibold">Amal Haddaji</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-md  shadow-md">
            <p className="text-gray-800 text-lg font-medium">
              "Espace agreable bien ranger surtout les personnels de magasin sont aimable et genereux."
            </p>
            <div className="mt-4 text-sm text-gray-600">
              <span className="font-semibold">Samar Chaouch</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-md  shadow-md">
            <p className="text-gray-800 text-lg font-medium">
              "Je suis très satisfait de la qualité des produits et du service client."
            </p>
            <div className="mt-4 text-sm text-gray-600">
              <span className="font-semibold">Amen Allah M.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
