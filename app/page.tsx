import AboutUsSection from "@/components/AboutUs";
import Banner from "@/components/Banner";
import CategoriesSection from "@/components/CategoriesSection";
import Section from "@/components/Section";

export default function Home() {
  return (
    <div>
      <Banner/>
      <CategoriesSection/>
      <Section name="Nos nouveautés" url="api/products?sort=createdDate&limit=10"/>
      <AboutUsSection />
      <Section name="Nos meilleures ventes" url="api/products?sort=unitsSold&limit=10"/>
    </div>
  );
}
