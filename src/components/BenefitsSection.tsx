import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Badge } from "@/components/ui/badge";
import { useRef, useEffect } from "react";
import anime from "../lib/anime-wrapper";

const BenefitsSection = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    // Fast header animation
    const headerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && headerRef.current) {
            const element = headerRef.current;
            element.style.opacity = '0';
            element.style.transform = 'translateY(50px) scale(0.9)';
            
            anime({
              targets: element,
              opacity: [0, 1],
              translateY: [40, 0],
              scale: [0.95, 1.03, 1],
              duration: 600, // Medium duration
              easing: 'easeOutQuart',
              complete: () => {
                const title = element.querySelector('h2');
                if (title) {
                  anime({
                    targets: title,
                    scale: [1, 1.01, 1],
                    duration: 3000, // Medium pace
                    loop: true,
                    easing: 'easeInOutSine'
                  });
                }
              }
            });
            
            headerObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Fast cards animation
    const cardsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && cardsRef.current) {
            const cards = cardsRef.current.children;
            Array.from(cards).forEach((card, index) => {
              const element = card as HTMLElement;
              element.style.opacity = '0';
              element.style.transform = 'translateY(50px) scale(0.8) rotate(3deg)';
              
              setTimeout(() => {
                anime({
                  targets: element,
                  opacity: [0, 1],
                  translateY: [50, 0],
                  scale: [0.8, 1.05, 1],
                  rotate: [3, -1, 0],
                  duration: 700, // Medium duration
                  easing: 'easeOutQuart',
                  complete: () => {
                    anime({
                      targets: element,
                      translateY: [-1.5, 1.5, -1.5],
                      duration: 4000 + (index * 300), // Medium pace
                      loop: true,
                      easing: 'easeInOutSine',
                      direction: 'alternate'
                    });
                  }
                });
              }, index * 120); // Medium stagger
            });
            cardsObserver.unobserve(entry.target);
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

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  const benefits = [
    {
      category: "For Institutions",
      icon: "🏫",
      color: "bg-blue-100 text-blue-800",
      features: [
        "Complete admin control over curriculum",
        "Private AI tutor for your students",
        "Detailed usage analytics and insights",
        "Secure data with institutional privacy",
        "Curriculum-specific knowledge base"
      ]
    },
    {
      category: "For Students", 
      icon: "🎓",
      color: "bg-green-100 text-green-800",
      features: [
        "Instant syllabus-based answers",
        "24/7 learning support available",
        "Personalized study assistant",
        "No distractions from external content",
        "Interactive quiz generation"
      ]
    },
    {
      category: "For Parents",
      icon: "👨‍👩‍👧‍👦",
      color: "bg-purple-100 text-purple-800", 
      features: [
        "Complete transparency in learning",
        "Trusted curriculum-based tutoring",
        "Safe learning environment",
        "Progress tracking and insights",
        "Institution-verified content only"
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div ref={headerRef} className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="px-4 py-2">Key Benefits</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Benefits for Everyone in the Education Ecosystem
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Acadira creates value for institutions, students, and parents through 
            curriculum-aligned AI tutoring that maintains educational integrity.
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <AnimatedCard 
              key={index} 
              className="gradient-card border-0 shadow-card group"
              animationType="lift"
              hoverIntensity={1.2}
              animationDuration={400}
            >
              <CardHeader className="text-center space-y-4">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">
                  {benefit.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {benefit.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3 group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: `${idx * 50}ms` }}>
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;