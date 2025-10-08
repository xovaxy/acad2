import React, { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import anime from '../../lib/anime-wrapper';

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  animationType?: 'lift' | 'tilt' | 'glow' | 'scale' | 'rotate';
  hoverIntensity?: number;
  animationDuration?: number;
}

export const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ 
    className, 
    animationType = 'lift', 
    hoverIntensity = 1,
    animationDuration = 300,
    children, 
    ...props 
  }, ref) => {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const card = cardRef.current;
      if (!card) return;

      let hoverAnimation: any = null;
      let leaveAnimation: any = null;

      const handleMouseEnter = (e: MouseEvent) => {
        if (hoverAnimation) hoverAnimation.pause();
        
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) / rect.width;
        const deltaY = (e.clientY - centerY) / rect.height;

        switch (animationType) {
          case 'lift':
            hoverAnimation = anime({
              targets: card,
              translateY: -10 * hoverIntensity, // Medium lift
              scale: 1.03 * hoverIntensity, // Medium scale
              duration: 350, // Medium speed
              easing: 'easeOutQuart',
            });
            break;

          case 'tilt':
            hoverAnimation = anime({
              targets: card,
              rotateX: deltaY * 10 * hoverIntensity, // Medium tilt
              rotateY: -deltaX * 10 * hoverIntensity,
              translateZ: 50 * hoverIntensity, // Medium depth
              duration: 300, // Medium speed
              easing: 'easeOutQuad',
            });
            break;

          case 'glow':
            card.style.boxShadow = `0 10px 30px rgba(59, 130, 246, ${0.4 * hoverIntensity}), 0 5px 15px rgba(59, 130, 246, ${0.2 * hoverIntensity})`;
            card.style.transition = `box-shadow 350ms ease`;
            hoverAnimation = anime({
              targets: card,
              scale: 1.04 * hoverIntensity, // Medium scale
              duration: 350, // Medium speed
              easing: 'easeOutQuart',
            });
            break;

          case 'scale':
            hoverAnimation = anime({
              targets: card,
              scale: 1.06 * hoverIntensity, // Medium scale
              duration: 350, // Medium speed
              easing: 'easeOutQuart',
            });
            break;

          case 'rotate':
            hoverAnimation = anime({
              targets: card,
              rotateZ: 3 * hoverIntensity, // Medium rotation
              scale: 1.03 * hoverIntensity,
              duration: 350, // Medium speed
              easing: 'easeOutQuart',
            });
            break;
        }
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (animationType === 'tilt') {
          const rect = card.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const deltaX = (e.clientX - centerX) / rect.width;
          const deltaY = (e.clientY - centerY) / rect.height;

          if (hoverAnimation) hoverAnimation.pause();
          
          hoverAnimation = anime({
            targets: card,
            rotateX: deltaY * 10 * hoverIntensity,
            rotateY: -deltaX * 10 * hoverIntensity,
            translateZ: 50 * hoverIntensity,
            duration: 100,
            easing: 'easeOutQuad',
          });
        }
      };

      const handleMouseLeave = () => {
        if (leaveAnimation) leaveAnimation.pause();
        
        leaveAnimation = anime({
          targets: card,
          translateY: 0,
          translateZ: 0,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          scale: 1,
          duration: animationDuration,
          easing: 'easeOutQuad',
        });

        if (animationType === 'glow') {
          card.style.boxShadow = '';
        }
      };

      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
        
        if (hoverAnimation) hoverAnimation.pause();
        if (leaveAnimation) leaveAnimation.pause();
      };
    }, [animationType, hoverIntensity, animationDuration]);

    return (
      <Card
        ref={(node) => {
          cardRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          'transition-all duration-300 cursor-pointer',
          animationType === 'tilt' && 'transform-gpu perspective-1000',
          className
        )}
        style={{
          transformStyle: animationType === 'tilt' ? 'preserve-3d' : undefined,
        }}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';
