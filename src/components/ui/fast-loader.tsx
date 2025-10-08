import React, { useEffect, useRef } from 'react';
import anime from '../../lib/anime-wrapper';
import { cn } from '@/lib/utils';

interface FastLoaderProps {
  isLoading?: boolean;
  className?: string;
  variant?: 'dots' | 'bars' | 'pulse' | 'wave' | 'spinner';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent';
}

export const FastLoader: React.FC<FastLoaderProps> = ({
  isLoading = true,
  className = '',
  variant = 'dots',
  size = 'md',
  color = 'primary'
}) => {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loaderRef.current || !isLoading) return;

    const container = loaderRef.current;
    let animation: any;

    switch (variant) {
      case 'dots':
        const dots = container.children;
        animation = anime({
          targets: dots,
          scale: [1, 1.5, 1],
          opacity: [0.3, 1, 0.3],
          duration: 400, // Very fast
          delay: anime.stagger(80),
          loop: true,
          easing: 'easeInOutQuad'
        });
        break;

      case 'bars':
        const bars = container.children;
        animation = anime({
          targets: bars,
          scaleY: [0.3, 1, 0.3],
          duration: 300, // Very fast
          delay: anime.stagger(60),
          loop: true,
          easing: 'easeInOutSine'
        });
        break;

      case 'pulse':
        animation = anime({
          targets: container,
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
          duration: 500, // Fast
          loop: true,
          easing: 'easeInOutQuad'
        });
        break;

      case 'wave':
        const elements = container.children;
        animation = anime({
          targets: elements,
          translateY: [-10, 10, -10],
          duration: 600, // Fast
          delay: anime.stagger(50),
          loop: true,
          easing: 'easeInOutSine'
        });
        break;

      case 'spinner':
        animation = anime({
          targets: container,
          rotate: '1turn',
          duration: 800, // Fast
          loop: true,
          easing: 'linear'
        });
        break;
    }

    return () => {
      if (animation) animation.pause();
    };
  }, [isLoading, variant]);

  if (!isLoading) return null;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent'
  };

  const renderContent = () => {
    switch (variant) {
      case 'dots':
        return (
          <>
            <div className={cn('rounded-full', sizeClasses[size], colorClasses[color])} />
            <div className={cn('rounded-full', sizeClasses[size], colorClasses[color])} />
            <div className={cn('rounded-full', sizeClasses[size], colorClasses[color])} />
          </>
        );

      case 'bars':
        return (
          <>
            <div className={cn('rounded-sm', `w-1 ${sizeClasses[size].split(' ')[1]}`, colorClasses[color])} />
            <div className={cn('rounded-sm', `w-1 ${sizeClasses[size].split(' ')[1]}`, colorClasses[color])} />
            <div className={cn('rounded-sm', `w-1 ${sizeClasses[size].split(' ')[1]}`, colorClasses[color])} />
            <div className={cn('rounded-sm', `w-1 ${sizeClasses[size].split(' ')[1]}`, colorClasses[color])} />
          </>
        );

      case 'pulse':
        return (
          <div className={cn('rounded-full', sizeClasses[size], colorClasses[color])} />
        );

      case 'wave':
        return (
          <>
            <div className={cn('rounded-full w-2 h-2', colorClasses[color])} />
            <div className={cn('rounded-full w-2 h-2', colorClasses[color])} />
            <div className={cn('rounded-full w-2 h-2', colorClasses[color])} />
            <div className={cn('rounded-full w-2 h-2', colorClasses[color])} />
            <div className={cn('rounded-full w-2 h-2', colorClasses[color])} />
          </>
        );

      case 'spinner':
        return (
          <div className={cn(
            'border-2 border-muted-foreground border-t-transparent rounded-full',
            sizeClasses[size]
          )} />
        );

      default:
        return null;
    }
  };

  return (
    <div 
      ref={loaderRef}
      className={cn(
        'flex items-center justify-center gap-1',
        variant === 'pulse' && 'w-fit',
        className
      )}
    >
      {renderContent()}
    </div>
  );
};

// Page loader component
export const PageLoader: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlayRef.current) return;

    if (isLoading) {
      anime({
        targets: overlayRef.current,
        opacity: [0, 1],
        duration: 200,
        easing: 'easeOutQuad'
      });
    } else {
      anime({
        targets: overlayRef.current,
        opacity: [1, 0],
        duration: 300,
        easing: 'easeOutQuad',
        complete: () => {
          if (overlayRef.current) {
            overlayRef.current.style.display = 'none';
          }
        }
      });
    }
  }, [isLoading]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
      style={{ display: isLoading ? 'flex' : 'none' }}
    >
      <div className="text-center space-y-4">
        <FastLoader variant="wave" size="lg" />
        <p className="text-muted-foreground animate-pulse">Loading amazing content...</p>
      </div>
    </div>
  );
};
