import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import anime from '../../lib/anime-wrapper';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'dots' | 'pulse' | 'bounce';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className
}) => {
  const spinnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spinner = spinnerRef.current;
    if (!spinner) return;

    let animation: any = null;

    switch (variant) {
      case 'default':
        animation = anime({
          targets: spinner,
          rotate: '1turn',
          duration: 1000,
          loop: true,
          easing: 'linear',
        });
        break;

      case 'dots':
        const dots = spinner.children;
        animation = anime({
          targets: dots,
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
          duration: 800,
          delay: anime.stagger(200),
          loop: true,
          easing: 'easeInOutSine',
        });
        break;

      case 'pulse':
        animation = anime({
          targets: spinner,
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
          duration: 1200,
          loop: true,
          easing: 'easeInOutSine',
        });
        break;

      case 'bounce':
        animation = anime({
          targets: spinner,
          translateY: [0, -20, 0],
          duration: 600,
          loop: true,
          easing: 'easeOutBounce',
        });
        break;
    }

    return () => {
      if (animation) animation.pause();
    };
  }, [variant]);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const dotSizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  if (variant === 'dots') {
    return (
      <div ref={spinnerRef} className={cn('flex space-x-1 items-center', className)}>
        <div className={cn('bg-primary rounded-full', dotSizeClasses[size])} />
        <div className={cn('bg-primary rounded-full', dotSizeClasses[size])} />
        <div className={cn('bg-primary rounded-full', dotSizeClasses[size])} />
      </div>
    );
  }

  return (
    <div
      ref={spinnerRef}
      className={cn(
        'border-2 border-muted-foreground border-t-primary rounded-full',
        sizeClasses[size],
        variant === 'pulse' && 'border-primary',
        className
      )}
    />
  );
};

// Page transition component
interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Fast initial state
    container.style.opacity = '0';
    container.style.transform = 'translateY(30px) scale(0.95)';

    // Fast animate in
    setTimeout(() => {
      anime({
        targets: container,
        opacity: [0, 1],
        translateY: [30, 0],
        scale: [0.95, 1],
        duration: 300, // Faster
        easing: 'easeOutQuart',
        complete: () => {
          // Add subtle breathing animation
          anime({
            targets: container,
            scale: [1, 1.001, 1],
            duration: 4000,
            loop: true,
            easing: 'easeInOutSine'
          });
        }
      });
    }, 50); // Faster start
  }, []);

  return (
    <div ref={containerRef} className={cn('w-full', className)}>
      {children}
    </div>
  );
};
