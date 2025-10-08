import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Badge } from "@/components/ui/badge";
import { useRef, useEffect } from "react";
import anime from "@/lib/anime-wrapper";

const TrustSection = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const complianceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    // Fast header animation with bounce
    const headerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && headerRef.current) {
            const element = headerRef.current;
            element.style.opacity = '0';
            element.style.transform = 'translateY(60px) scale(0.8)';
            
            anime({
              targets: element,
              opacity: [0, 1],
              translateY: [60, 0],
              scale: [0.8, 1.1, 1],
              duration: 350, // Faster
              easing: 'easeOutBack',
              complete: () => {
                // Add continuous subtle animation
                anime({
                  targets: element.querySelector('h2'),
                  scale: [1, 1.02, 1],
                  duration: 3000,
                  loop: true,
                  easing: 'easeInOutSine'
                });
              }
            });
            
            headerObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Fast cards animation with dynamic effects
    const cardsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && cardsRef.current) {
            const cards = cardsRef.current.children;
            Array.from(cards).forEach((card, index) => {
              const element = card as HTMLElement;
              element.style.opacity = '0';
              element.style.transform = 'translateY(80px) scale(0.6) rotate(10deg)';
              
              setTimeout(() => {
                anime({
                  targets: element,
                  opacity: [0, 1],
                  translateY: [80, 0],
                  scale: [0.6, 1.2, 1],
                  rotate: [10, -5, 0],
                  duration: 400, // Faster
                  easing: 'easeOutElastic(1, .8)',
                  complete: () => {
                    // Add continuous floating
                    anime({
                      targets: element,
                      translateY: [-3, 3, -3],
                      rotate: [-0.5, 0.5, -0.5],
                      duration: 4000 + (index * 200),
                      loop: true,
                      easing: 'easeInOutSine',
                      direction: 'alternate'
                    });
                  }
                });
              }, index * 60); // Faster stagger
            });
            cardsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Fast compliance badges animation
    const complianceObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && complianceRef.current) {
            const badges = complianceRef.current.children;
            Array.from(badges).forEach((badge, index) => {
              const element = badge as HTMLElement;
              element.style.opacity = '0';
              element.style.transform = 'translateX(-50px) scale(0.5)';
              
              setTimeout(() => {
                anime({
                  targets: element,
                  opacity: [0, 1],
                  translateX: [-50, 0],
                  scale: [0.5, 1.2, 1],
                  duration: 300, // Faster
                  easing: 'easeOutBack',
                  complete: () => {
                    // Add pulse animation to dots
                    const dot = element.querySelector('.w-3.h-3');
                    if (dot) {
                      anime({
                        targets: dot,
                        scale: [1, 1.4, 1],
                        duration: 1500,
                        loop: true,
                        easing: 'easeInOutQuad'
                      });
                    }
                  }
                });
              }, index * 100); // Faster stagger
            });
            complianceObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (headerRef.current) {
      headerObserver.observe(headerRef.current);
      observers.push(headerObserver);
    }

    if (cardsRef.current) {
      cardsObserver.observe(cardsRef.current);
      observers.push(cardsObserver);
    }

    if (complianceRef.current) {
      complianceObserver.observe(complianceRef.current);
      observers.push(complianceObserver);
    }

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  const trustIndicators = [
    {
      icon: "🔒",
      title: "Data Security",
      description: "Enterprise-grade encryption and security protocols protect your institutional data."
    },
    {
      icon: "✅",
      title: "Compliance Ready", 
      description: "Built with educational compliance standards and privacy regulations in mind."
    },
    {
      icon: "⚡",
      title: "Reliable Infrastructure",
      description: "99.9% uptime with scalable cloud infrastructure supporting thousands of students."
    },
    {
      icon: "🎯",
      title: "Curriculum Focused",
      description: "AI responses strictly limited to your uploaded curriculum - no external content."
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div ref={headerRef} className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="px-4 py-2">Powered by Xovaxy</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Trusted by Educational Institutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Acadira is developed by <span className="font-semibold text-primary">Xovaxy</span>, 
            ensuring enterprise-grade reliability, security, and educational compliance.
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {trustIndicators.map((indicator, index) => (
            <AnimatedCard 
              key={index} 
              className="gradient-card border-0 shadow-soft text-center group"
              animationType="tilt"
              hoverIntensity={0.8}
              animationDuration={400}
            >
              <CardContent className="p-6 space-y-4">
                <div className="text-3xl group-hover:scale-110 transition-transform duration-300">{indicator.icon}</div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{indicator.title}</h3>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">{indicator.description}</p>
              </CardContent>
            </AnimatedCard>
          ))}
        </div>

        <div className="text-center space-y-4">
          <div ref={complianceRef} className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2 hover:text-foreground transition-colors duration-300">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center space-x-2 hover:text-foreground transition-colors duration-300">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span>GDPR Ready</span>
            </div>
            <div className="flex items-center space-x-2 hover:text-foreground transition-colors duration-300">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span>ISO 27001</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;