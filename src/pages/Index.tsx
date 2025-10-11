import Header from "@/components/Header";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import AcadiraZoomParallax from "@/components/AcadiraZoomParallax";
import AboutAcadira from "@/components/AboutAcadira";
import { AcadiraFeatures } from "@/components/AcadiraFeatures";
import { AcadiraTrustedBy } from "@/components/AcadiraTrustedBy";
import { AcadiraTestimonials } from "@/components/AcadiraTestimonials";
import { AcadiraPricing } from "@/components/AcadiraPricing";
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
      <HeroGeometric 
        badge="Acadira"
        title1="Elevate Your"
        title2="Learning Experience"
      />
      <AcadiraZoomParallax />
      <AboutAcadira />
      <AcadiraFeatures />
      <AcadiraTrustedBy />
      <AcadiraTestimonials />
      <AcadiraPricing />
      <Footer />
      <FloatingButton onClick={scrollToTop} icon="↑" />
    </div>
  );
};

export default Index;
