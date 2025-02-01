import AboutUsSection from "@/components/AboutUs";
import Banner from "@/components/Banner";
import CategoriesSection from "@/components/CategoriesSection";
import FeedbackBanner from "@/components/FeedBackBanner";
import Section from "@/components/Section_v2";

export default function Home() {
  return (
    <div>
      <Banner/>
      <CategoriesSection/>
      <Section name="Nos nouveautés" url="api/products?sort=createdAt&limit=10"/>
      <AboutUsSection />
      <Section name="Nos meilleures ventes" url="api/products?sort=unitsSold&limit=10&category=Déco"/>
      <Section name="En Solde" url="api/products/sale?limit=10"/>
       <FeedbackBanner/>
      </div>
  );
}
