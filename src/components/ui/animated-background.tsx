import React, { useEffect, useRef } from 'react';
import anime from '../../lib/anime-wrapper';

interface AnimatedBackgroundProps {
  particleCount?: number;
  className?: string;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  particleCount = 20,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const particles: HTMLDivElement[] = [];

    // Create floating particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full opacity-20';
      
      // Random sizes and colors
      const size = Math.random() * 8 + 4;
      const colors = ['bg-primary', 'bg-secondary', 'bg-accent'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.classList.add(color);
      
      // Random initial position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      container.appendChild(particle);
      particles.push(particle);

      // Animate each particle
      anime({
        targets: particle,
        translateX: () => anime.random(-200, 200),
        translateY: () => anime.random(-200, 200),
        scale: [1, anime.random(0.5, 1.5), 1],
        opacity: [0.2, anime.random(0.1, 0.4), 0.2],
        duration: () => anime.random(8000, 15000),
        loop: true,
        easing: 'easeInOutSine',
        delay: () => anime.random(0, 5000)
      });
    }

    // Create geometric shapes
    for (let i = 0; i < 5; i++) {
      const shape = document.createElement('div');
      shape.className = 'absolute border border-primary/10 opacity-10';
      
      const size = Math.random() * 100 + 50;
      const isCircle = Math.random() > 0.5;
      
      if (isCircle) {
        shape.style.borderRadius = '50%';
      }
      
      shape.style.width = `${size}px`;
      shape.style.height = `${size}px`;
      shape.style.left = `${Math.random() * 100}%`;
      shape.style.top = `${Math.random() * 100}%`;
      
      container.appendChild(shape);

      // Animate shapes
      anime({
        targets: shape,
        rotate: '1turn',
        scale: [1, 1.2, 1],
        opacity: [0.1, 0.2, 0.1],
        duration: () => anime.random(20000, 30000),
        loop: true,
        easing: 'linear'
      });
    }

    return () => {
      // Cleanup
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
  }, [particleCount]);

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden -z-10 ${className}`}
    />
  );
};

// Floating action button component
interface FloatingButtonProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  onClick,
  icon = '↑',
  className = ''
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;

    // Continuous floating animation
    anime({
      targets: button,
      translateY: [-5, 5, -5],
      duration: 3000,
      loop: true,
      easing: 'easeInOutSine'
    });

    // Pulse effect
    anime({
      targets: button,
      scale: [1, 1.1, 1],
      duration: 2000,
      loop: true,
      easing: 'easeInOutQuad'
    });
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`fixed bottom-8 right-8 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center text-lg font-bold z-50 ${className}`}
    >
      {icon}
    </button>
  );
};
