import AboutUsSection from "@/components/AboutUs";
import Banner from "@/components/Banner";
import CategoriesSection from "@/components/CategoriesSection";
import FeedbackBanner from "@/components/FeedBackBanner";
import Section from "@/components/Section_v2";

export default function Home() {
  return (
    <div>
      <Section name="Nos Salons" url="/api/products/subcategory?subcategory=Salons"/>
      <Section name="Nos Chambres" url="/api/products/subcategory?subcategory=Chambres"/>
      <Section name="Nos Salles à manger" url="/api/products/subcategory?subcategory=Salleàmanger"/>
      </div>
  );
}
