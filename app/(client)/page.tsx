import AboutUsSection from "@/components/HomePage/AboutUs";
import Banner from "@/components/HomePage/Banner";
import CategoriesSection from "@/components/HomePage/CategoriesSection";
import ProductsSection from "@/components/HomePage/ProductsSection";
import TestimonialSection from "@/components/HomePage/TestimonialSection";

export default function Home() {
  return (
    <div>
      <Banner/>
      <CategoriesSection/>
      <ProductsSection name="Nos nouveautés" url="api/products?sort=createdAt&limit=10"/>
      <AboutUsSection />
      <ProductsSection name="Nos meilleures ventes" url="api/products?sort=unitsSold&limit=10&category=Déco"/>
      <ProductsSection name="En Solde" url="api/products/sale?limit=10"/>
       <TestimonialSection></TestimonialSection>
      </div>
  );
}
