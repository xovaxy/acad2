import React, { useRef, useEffect } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import anime from '../../lib/anime-wrapper';

interface AnimatedButtonProps extends ButtonProps {
  animationType?: 'pulse' | 'bounce' | 'shake' | 'glow' | 'ripple';
  hoverScale?: number;
  clickScale?: number;
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    className, 
    animationType = 'pulse', 
    hoverScale = 1.05, 
    clickScale = 0.95,
    children, 
    ...props 
  }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const rippleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const button = buttonRef.current;
      if (!button) return;

      let hoverAnimation: any = null;
      let clickAnimation: any = null;

      const handleMouseEnter = () => {
        if (hoverAnimation) hoverAnimation.pause();
        
        hoverAnimation = anime({
          targets: button,
          scale: hoverScale,
          duration: 350, // Medium speed
          easing: 'easeOutQuad',
        });

        // Medium glow effect
        if (animationType === 'glow') {
          button.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3)';
          button.style.transition = 'box-shadow 0.35s ease';
        }

        // Add medium bounce for pulse type
        if (animationType === 'pulse') {
          anime({
            targets: button,
            scale: [hoverScale, hoverScale * 1.05, hoverScale],
            duration: 500, // Medium duration
            easing: 'easeOutQuart'
          });
        }
      };

      const handleMouseLeave = () => {
        if (hoverAnimation) hoverAnimation.pause();
        
        hoverAnimation = anime({
          targets: button,
          scale: 1,
          duration: 400, // Medium speed
          easing: 'easeOutQuad',
        });

        if (animationType === 'glow') {
          button.style.boxShadow = '';
        }
      };

      const handleMouseDown = () => {
        if (clickAnimation) clickAnimation.pause();
        
        clickAnimation = anime({
          targets: button,
          scale: clickScale,
          duration: 150,
          easing: 'easeOutQuad',
        });
      };

      const handleMouseUp = () => {
        if (clickAnimation) clickAnimation.pause();
        
        clickAnimation = anime({
          targets: button,
          scale: hoverScale,
          duration: 150,
          easing: 'easeOutQuad',
        });
      };

      const handleClick = (e: MouseEvent) => {
        // Ripple effect
        if (animationType === 'ripple' && rippleRef.current) {
          const rect = button.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = e.clientX - rect.left - size / 2;
          const y = e.clientY - rect.top - size / 2;
          
          const ripple = rippleRef.current;
          ripple.style.width = ripple.style.height = size + 'px';
          ripple.style.left = x + 'px';
          ripple.style.top = y + 'px';
          ripple.style.opacity = '0.6';
          
          anime({
            targets: ripple,
            scale: [0, 1],
            opacity: [0.6, 0],
            duration: 600,
            easing: 'easeOutQuad',
          });
        }

        // Bounce effect
        if (animationType === 'bounce') {
          anime({
            targets: button,
            translateY: [0, -10, 0],
            duration: 400,
            easing: 'easeOutBounce',
          });
        }

        // Shake effect
        if (animationType === 'shake') {
          anime({
            targets: button,
            translateX: [0, 10, -10, 10, 0],
            duration: 500,
            easing: 'easeInOutSine',
          });
        }
      };

      button.addEventListener('mouseenter', handleMouseEnter);
      button.addEventListener('mouseleave', handleMouseLeave);
      button.addEventListener('mousedown', handleMouseDown);
      button.addEventListener('mouseup', handleMouseUp);
      button.addEventListener('click', handleClick);

      // Pulse animation for pulse type
      let pulseAnimation: any = null;
      if (animationType === 'pulse') {
        pulseAnimation = anime({
          targets: button,
          scale: [1, 1.02, 1],
          duration: 2000,
          loop: true,
          easing: 'easeInOutSine',
        });
      }

      return () => {
        button.removeEventListener('mouseenter', handleMouseEnter);
        button.removeEventListener('mouseleave', handleMouseLeave);
        button.removeEventListener('mousedown', handleMouseDown);
        button.removeEventListener('mouseup', handleMouseUp);
        button.removeEventListener('click', handleClick);
        
        if (hoverAnimation) hoverAnimation.pause();
        if (clickAnimation) clickAnimation.pause();
        if (pulseAnimation) pulseAnimation.pause();
      };
    }, [animationType, hoverScale, clickScale]);

    return (
      <Button
        ref={(node) => {
          buttonRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          'relative overflow-hidden transition-all duration-300',
          animationType === 'glow' && 'hover:shadow-lg',
          className
        )}
        {...props}
      >
        {children}
        {animationType === 'ripple' && (
          <div
            ref={rippleRef}
            className="absolute rounded-full bg-white opacity-0 pointer-events-none"
            style={{ transform: 'scale(0)' }}
          />
        )}
      </Button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';
