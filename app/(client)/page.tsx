import AboutUsSection from "@/components/HomePage/AboutUs";
import Banner from "@/components/HomePage/Banner";
import CategoriesSection from "@/components/HomePage/CategoriesSection";
import Section from "@/components/HomePage/Section_v2";
import TestimonialSection from "@/components/HomePage/Testimonoals";

export default function Home() {
  return (
    <div>
      <Banner/>
      <CategoriesSection/>
      <Section name="Nos nouveautés" url="api/products?sort=createdAt&limit=10"/>
      <AboutUsSection />
      <Section name="Nos meilleures ventes" url="api/products?sort=unitsSold&limit=10&category=Déco"/>
      <Section name="En Solde" url="api/products/sale?limit=10"/>
       <TestimonialSection></TestimonialSection>
      </div>
  );
}
