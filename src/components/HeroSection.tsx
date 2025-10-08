import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { animationPresets, animationUtils } from "@/lib/animations";
import anime from "@/lib/anime-wrapper";

const HeroSection = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Medium-paced entrance animations with staggered timing
    const timeline = [
      { element: titleRef.current, delay: 0, animation: 'fadeInUp' },
      { element: subtitleRef.current, delay: 150, animation: 'fadeInLeft' },
      { element: buttonsRef.current, delay: 300, animation: 'scaleIn' },
      { element: featuresRef.current, delay: 450, animation: 'fadeInRight' },
      { element: imageRef.current, delay: 200, animation: 'fadeInRight' }
    ];

    timeline.forEach(({ element, delay, animation }) => {
      if (element) {
        // Set initial state
        element.style.opacity = '0';
        element.style.transform = 'translateY(40px) scale(0.9)';
        
        // Medium-paced animate in
        setTimeout(() => {
          animationUtils.staggeredEntrance(element, {
            ...animationPresets[animation as keyof typeof animationPresets],
            duration: 700, // Medium duration
            easing: 'easeOutQuart',
            delay: 0
          });
        }, delay);
      }
    });

    // Add medium floating animation to the image
    if (imageRef.current) {
      setTimeout(() => {
        anime({
          targets: imageRef.current,
          translateY: [-3, 3, -3],
          rotate: [-0.5, 0.5, -0.5],
          duration: 5000, // Medium pace
          loop: true,
          easing: 'easeInOutSine',
          direction: 'alternate'
        });
      }, 1000);
    }

    // Add medium pulsing animation to feature dots
    if (featuresRef.current) {
      const dots = featuresRef.current.querySelectorAll('.w-2.h-2');
      anime({
        targets: dots,
        scale: [1, 1.3, 1],
        duration: 1800, // Medium duration
        loop: true,
        delay: anime.stagger(200), // Medium stagger
        easing: 'easeInOutQuad'
      });
    }

    // Add text reveal animation to title
    if (titleRef.current) {
      setTimeout(() => {
        const titleText = titleRef.current?.textContent || '';
        if (titleRef.current) {
          titleRef.current.innerHTML = '';
          // Split text into spans for individual letter animation
          titleText.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.opacity = '0';
            span.style.display = 'inline-block';
            titleRef.current?.appendChild(span);
          });

          // Animate letters at medium pace
          const letters = titleRef.current.querySelectorAll('span');
          if (letters && letters.length > 0) {
            anime({
              targets: letters,
              opacity: [0, 1],
              translateY: [15, 0],
              duration: 80, // Medium speed
              delay: anime.stagger(50), // Medium stagger
              easing: 'easeOutQuad'
            });
          }
        }
      }, 800);
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container-responsive section-padding-mobile">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
            <h1 
              ref={titleRef}
              className="heading-mobile lg:text-6xl xl:text-7xl font-bold leading-tight"
            >
              Transform Education with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent animate-gradient">
                AI-Powered Learning
              </span>
            </h1>
            
            <p 
              ref={subtitleRef}
              className="subheading-mobile lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Empower your institution with personalized AI tutoring that adapts to every student's learning style and pace.
            </p>
            
            <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/demo" className="w-full sm:w-auto">
                <AnimatedButton 
                  size="lg" 
                  className="btn-mobile sm:w-auto"
                  animationType="glow"
                  hoverScale={1.05}
                >
                  Book Free Demo
                </AnimatedButton>
              </Link>
              <Link to="/how-it-works" className="w-full sm:w-auto">
                <AnimatedButton 
                  variant="outline" 
                  size="lg" 
                  className="btn-mobile sm:w-auto"
                  animationType="bounce"
                  hoverScale={1.02}
                >
                  Learn More
                </AnimatedButton>
              </Link>
            </div>
            
            <div ref={featuresRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 pt-6 lg:pt-8">
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse flex-shrink-0"></div>
                <span className="text-sm font-medium">24/7 AI Support</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse flex-shrink-0"></div>
                <span className="text-sm font-medium">Personalized Learning</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse flex-shrink-0"></div>
                <span className="text-sm font-medium">Real-time Analytics</span>
              </div>
            </div>
          </div>
          
          <div ref={imageRef} className="relative order-first lg:order-last">
            <div className="relative z-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl lg:rounded-3xl p-6 lg:p-8 backdrop-blur-sm border border-primary/20 mx-auto max-w-sm lg:max-w-none">
              <div className="aspect-square bg-gradient-to-br from-primary to-accent rounded-xl lg:rounded-2xl flex items-center justify-center">
                <div className="text-4xl lg:text-6xl">🎓</div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl lg:rounded-3xl blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
