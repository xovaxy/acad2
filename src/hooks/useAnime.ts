import { useEffect, useRef, MutableRefObject } from 'react';
import anime from '../lib/anime-wrapper';

// Type definitions
type AnimeParams = {
  [key: string]: any;
  targets?: any;
  duration?: number;
  delay?: number;
  easing?: string;
  opacity?: number | readonly number[] | number[];
  translateX?: number | readonly number[] | number[];
  translateY?: number | readonly number[] | number[];
  scale?: number | readonly number[] | number[];
  rotate?: string | number;
  direction?: 'normal' | 'reverse' | 'alternate';
  loop?: boolean | number;
  complete?: () => void;
  update?: (anim: any) => void;
};

/**
 * Custom hook for Anime.js animations
 * @param animationConfig - Anime.js animation configuration
 * @param dependencies - Dependencies array to trigger animation re-run
 * @returns Object with animation instance and element ref
 */
export const useAnime = (
  animationConfig: AnimeParams,
  dependencies: any[] = []
): {
  elementRef: MutableRefObject<HTMLElement | null>;
  animationRef: MutableRefObject<any>;
  play: () => void;
  pause: () => void;
  restart: () => void;
} => {
  const elementRef = useRef<HTMLElement | null>(null);
  const animationRef = useRef<any>(null);

  useEffect(() => {
    if (elementRef.current) {
      // Clean up previous animation
      if (animationRef.current) {
        animationRef.current.pause();
      }

      // Create new animation
      animationRef.current = anime({
        targets: elementRef.current,
        ...animationConfig,
      });
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, [elementRef.current, ...dependencies]);

  const play = () => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  };

  const pause = () => {
    if (animationRef.current) {
      animationRef.current.pause();
    }
  };

  const restart = () => {
    if (animationRef.current) {
      animationRef.current.restart();
    }
  };

  return {
    elementRef,
    animationRef,
    play,
    pause,
    restart,
  };
};

/**
 * Hook for scroll-triggered animations
 * @param animationConfig - Anime.js animation configuration
 * @param threshold - Intersection observer threshold (0-1)
 * @returns Element ref for the animated element
 */
export const useScrollAnimation = (
  animationConfig: AnimeParams,
  threshold: number = 0.1
): MutableRefObject<HTMLElement | null> => {
  const elementRef = useRef<HTMLElement | null>(null);
  const animationRef = useRef<any>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            
            // Clean up previous animation
            if (animationRef.current) {
              animationRef.current.pause();
            }

            // Create and start animation
            animationRef.current = anime({
              targets: element,
              ...animationConfig,
            });
          }
        });
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, [elementRef.current, threshold]);

  return elementRef;
};

/**
 * Hook for staggered animations on multiple elements
 * @param animationConfig - Anime.js animation configuration
 * @param staggerDelay - Delay between each element animation (in ms)
 * @returns Container ref for the parent element
 */
export const useStaggerAnimation = (
  animationConfig: AnimeParams,
  staggerDelay: number = 100
): {
  containerRef: MutableRefObject<HTMLElement | null>;
  triggerAnimation: () => void;
} => {
  const containerRef = useRef<HTMLElement | null>(null);
  const animationRef = useRef<any>(null);

  const triggerAnimation = () => {
    if (containerRef.current) {
      const children = containerRef.current.children;
      
      // Clean up previous animation
      if (animationRef.current) {
        animationRef.current.pause();
      }

      // Create staggered animation
      animationRef.current = anime({
        targets: children,
        delay: anime.stagger(staggerDelay),
        ...animationConfig,
      });
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, []);

  return {
    containerRef,
    triggerAnimation,
  };
};
