import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BenefitsSection from "@/components/BenefitsSection";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";
import { AnimatedBackground, FloatingButton } from "@/components/ui/animated-background";

const Index = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground particleCount={25} />
      <Header />
      <HeroSection />
      <BenefitsSection />
      <TrustSection />
      <Footer />
      <FloatingButton onClick={scrollToTop} icon="↑" />
    </div>
  );
};

export default Index;
