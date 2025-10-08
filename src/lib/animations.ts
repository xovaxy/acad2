import anime from './anime-wrapper';

// Type definition for animation parameters
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
 * Animation presets for common use cases
 */
export const animationPresets = {
  // Entrance animations
  fadeInUp: {
    opacity: [0, 1],
    translateY: [30, 0],
    duration: 800,
    easing: 'easeOutCubic',
  },
  
  fadeInDown: {
    opacity: [0, 1],
    translateY: [-30, 0],
    duration: 800,
    easing: 'easeOutCubic',
  },
  
  fadeInLeft: {
    opacity: [0, 1],
    translateX: [-30, 0],
    duration: 800,
    easing: 'easeOutCubic',
  },
  
  fadeInRight: {
    opacity: [0, 1],
    translateX: [30, 0],
    duration: 800,
    easing: 'easeOutCubic',
  },
  
  scaleIn: {
    opacity: [0, 1],
    scale: [0.8, 1],
    duration: 600,
    easing: 'easeOutBack',
  },
  
  // Hover animations
  hoverLift: {
    translateY: [0, -5],
    scale: [1, 1.02],
    duration: 300,
    easing: 'easeOutQuad',
  },
  
  hoverScale: {
    scale: [1, 1.05],
    duration: 300,
    easing: 'easeOutQuad',
  },
  
  // Button animations
  buttonPress: {
    scale: [1, 0.95],
    duration: 150,
    easing: 'easeOutQuad',
  },
  
  // Loading animations
  pulse: {
    scale: [1, 1.1, 1],
    duration: 1000,
    loop: true,
    easing: 'easeInOutSine',
  },
  
  rotate: {
    rotate: '1turn',
    duration: 2000,
    loop: true,
    easing: 'linear',
  },
  
  // Text animations
  typewriter: {
    opacity: [0, 1],
    duration: 50,
    easing: 'linear',
  },
} as const;

/**
 * Utility functions for common animation patterns
 */
export const animationUtils = {
  /**
   * Create a staggered entrance animation for multiple elements
   */
  staggeredEntrance: (
    targets: string | Element | Element[],
    animation: AnimeParams = animationPresets.fadeInUp,
    staggerDelay: number = 100
  ) => {
    return anime({
      targets,
      delay: anime.stagger(staggerDelay),
      ...animation,
    });
  },

  /**
   * Create a hover animation with return animation
   */
  createHoverAnimation: (
    element: Element,
    hoverAnimation: AnimeParams = animationPresets.hoverLift,
    returnAnimation?: AnimeParams
  ) => {
    let isHovered = false;
    let currentAnimation: any = null;

    const handleMouseEnter = () => {
      if (isHovered) return;
      isHovered = true;
      
      if (currentAnimation) currentAnimation.pause();
      currentAnimation = anime({
        targets: element,
        ...hoverAnimation,
      });
    };

    const handleMouseLeave = () => {
      if (!isHovered) return;
      isHovered = false;
      
      if (currentAnimation) currentAnimation.pause();
      
      const reverseAnimation = returnAnimation || {
        ...hoverAnimation,
        direction: 'reverse',
      };
      
      currentAnimation = anime({
        targets: element,
        ...reverseAnimation,
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      if (currentAnimation) currentAnimation.pause();
    };
  },

  /**
   * Create a scroll-triggered animation
   */
  scrollTrigger: (
    targets: string | Element | Element[],
    animation: AnimeParams,
    threshold: number = 0.1
  ) => {
    const elements = typeof targets === 'string' 
      ? document.querySelectorAll(targets)
      : Array.isArray(targets) 
        ? targets 
        : [targets];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: entry.target,
              ...animation,
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    elements.forEach((element) => {
      if (element instanceof Element) {
        observer.observe(element);
      }
    });

    return observer;
  },

  /**
   * Create a typewriter effect for text
   */
  typewriter: (
    element: Element,
    text: string,
    speed: number = 50
  ) => {
    const originalText = element.textContent || '';
    element.textContent = '';
    
    const target = { progress: 0 };
    
    return anime({
      targets: target,
      progress: text.length,
      duration: text.length * speed,
      easing: 'linear',
      update: () => {
        const progress = Math.floor(target.progress);
        element.textContent = text.substring(0, progress);
      },
      complete: () => {
        element.textContent = text;
      },
    });
  },

  /**
   * Create a loading spinner animation
   */
  loadingSpinner: (element: Element) => {
    return anime({
      targets: element,
      rotate: '1turn',
      duration: 1000,
      loop: true,
      easing: 'linear',
    });
  },

  /**
   * Create a bounce animation
   */
  bounce: (
    targets: string | Element | Element[],
    intensity: number = 20
  ) => {
    return anime({
      targets,
      translateY: [0, -intensity, 0],
      duration: 600,
      easing: 'easeOutBounce',
    });
  },

  /**
   * Create a shake animation
   */
  shake: (
    targets: string | Element | Element[],
    intensity: number = 10
  ) => {
    return anime({
      targets,
      translateX: [0, intensity, -intensity, intensity, 0],
      duration: 500,
      easing: 'easeInOutSine',
    });
  },
};

/**
 * Animation timing functions
 */
export const easings = {
  // Standard easings
  easeInOut: 'easeInOutQuad',
  easeOut: 'easeOutQuad',
  easeIn: 'easeInQuad',
  
  // Bounce easings
  bounceOut: 'easeOutBounce',
  bounceIn: 'easeInBounce',
  bounceInOut: 'easeInOutBounce',
  
  // Back easings
  backOut: 'easeOutBack',
  backIn: 'easeInBack',
  backInOut: 'easeInOutBack',
  
  // Elastic easings
  elasticOut: 'easeOutElastic',
  elasticIn: 'easeInElastic',
  elasticInOut: 'easeInOutElastic',
} as const;

/**
 * Common animation durations
 */
export const durations = {
  fast: 200,
  normal: 400,
  slow: 800,
  verySlow: 1200,
} as const;
