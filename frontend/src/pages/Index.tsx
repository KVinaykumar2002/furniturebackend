import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import ShopByCategory from "@/components/home/ShopByCategory";
import CategoryBanners from "@/components/home/CategoryBanners";
import CompletedProjectsAndShowrooms from "@/components/home/CompletedProjectsAndShowrooms";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import PromoStrip from "@/components/home/PromoStrip";
import OurStores from "@/components/home/OurStores";
import BestSellers from "@/components/home/BestSellers";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsletterSection from "@/components/home/NewsletterSection";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ShopByCategory />
      <CategorySection />
      <CategoryBanners />
      <CompletedProjectsAndShowrooms />
      <WhyChooseUs />
      <PromoStrip />
      <OurStores />
      <BestSellers />
      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
