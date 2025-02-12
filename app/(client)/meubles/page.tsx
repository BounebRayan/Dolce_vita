import AboutUsSection from "@/components/HomePage/AboutUs";
import Banner from "@/components/HomePage/Banner";
import CategoriesSection from "@/components/HomePage/CategoriesSection";
import FeedbackBanner from "@/components/HomePage/FeedBackBanner";
import Section from "@/components/sectionv3";

export default function Home() {
  return (
    <div className="mt-4">
      <Section name="Nos Salons" url="/api/products/subcategory?subcategory=Salons"/>
      <Section name="Nos Chambres" url="/api/products/subcategory?subcategory=Chambres"/>
      <Section name="Nos Salles à manger" url="/api/products/subcategory?subcategory=Salleàmanger"/>
      </div>
  );
}
