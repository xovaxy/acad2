import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Link } from "react-router-dom";
import acadiraLogo from "@/assets/acadira-logo.jpg";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import anime from "@/lib/anime-wrapper";

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    // Initial state
    header.style.transform = 'translateY(-100%)';
    header.style.transition = 'transform 0.6s ease-out';

    // Animate in with staggered nav items
    setTimeout(() => {
      header.style.transform = 'translateY(0)';
      
      // Animate navigation items
      const navItems = header.querySelectorAll('nav a, nav button');
      anime({
        targets: navItems,
        opacity: [0, 1],
        translateY: [-10, 0],
        duration: 200, // Fast
        delay: anime.stagger(50), // Fast stagger
        easing: 'easeOutQuad'
      });
    }, 100);

    // Add scroll effect
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        header.style.transform = 'translateY(-100%)';
      } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300" onClick={closeMobileMenu}>
            <img src={acadiraLogo} alt="Acadira" className="h-8 w-8 rounded-lg object-cover hover:rotate-12 transition-transform duration-300" />
            <span className="text-xl font-bold text-foreground">Acadira</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-smooth">
              Home
            </Link>
            <Link to="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-smooth">
              How It Works
            </Link>
            <Link to="/features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-smooth">
              Features
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-smooth">
              Pricing
            </Link>
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-smooth">
              About
            </Link>
            <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-smooth">
              Contact
            </Link>
          </nav>
          
          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/login">
              <AnimatedButton 
                variant="ghost" 
                size="sm"
                animationType="pulse"
                hoverScale={1.05}
              >
                Login
              </AnimatedButton>
            </Link>
            <Link to="/demo">
              <AnimatedButton 
                variant="cta" 
                size="sm"
                animationType="glow"
                hoverScale={1.05}
              >
                Book Demo
              </AnimatedButton>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-card/95 backdrop-blur-md border-b border-border shadow-lg">
            <nav className="flex flex-col space-y-1 p-4">
              <Link 
                to="/" 
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link 
                to="/how-it-works" 
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                How It Works
              </Link>
              <Link 
                to="/features" 
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                Features
              </Link>
              <Link 
                to="/pricing" 
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                Pricing
              </Link>
              <Link 
                to="/about" 
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
              
              {/* Mobile Action Buttons */}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border mt-4">
                <Link to="/login" onClick={closeMobileMenu}>
                  <Button variant="ghost" className="w-full justify-start">
                    Login
                  </Button>
                </Link>
                <Link to="/demo" onClick={closeMobileMenu}>
                  <Button variant="default" className="w-full">
                    Book Demo
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;