import AboutUsSection from "@/components/AboutUs";
import Banner from "@/components/Banner";
import CategoriesSection from "@/components/CategoriesSection";
import Section from "@/components/Section";

export default function Home() {
  return (
    <div>
      <Banner/>
      <CategoriesSection/>
      <Section name="Les nouveautés" url="api/products?sort=createdDate&limit=10"/>
      <AboutUsSection />
      <Section name="Meilleures ventes" url="api/products?sort=unitsSold&limit=10"/>
    </div>
  );
}
