import { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, Users, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  // Single step - just show Acadira logo
  const logoData = {
    icon: BookOpen,
    title: "Acadira",
    subtitle: "AI-Powered Learning Platform",
    gradient: "from-blue-600 to-purple-600"
  };

  useEffect(() => {
    // Show for only 2.5 seconds total
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleSkip = () => {
    setFadeOut(true);
    setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 400);
  };

  if (!isVisible) return null;

  const IconComponent = logoData.icon;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${
        fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      {/* Main Content Container - Smaller and Centered */}
      <div className="relative z-10 text-center">
        
        {/* Logo Container - Smaller */}
        <div 
          className="mb-6 transform transition-all duration-500 ease-out"
          style={{
            animation: `fadeInScale 0.6s ease-out`,
            animationFillMode: 'both'
          }}
        >
          <div className="relative">
            {/* Icon Background Circle - Smaller */}
            <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${logoData.gradient} shadow-xl flex items-center justify-center`}>
              <IconComponent size={28} className="text-white" />
            </div>
            
            {/* Pulse Ring - Smaller */}
            <div 
              className={`absolute inset-0 w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${logoData.gradient} opacity-30`}
              style={{
                animation: 'pulse 2s infinite'
              }}
            />
          </div>
        </div>

        {/* Title - Smaller */}
        <h1
          className="text-3xl font-bold text-white mb-2"
          style={{
            animation: `slideUp 0.6s ease-out 0.2s both`,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          {logoData.title}
        </h1>

        {/* Subtitle - Smaller */}
        <p
          className="text-base text-white/90 font-medium"
          style={{
            animation: `slideUp 0.6s ease-out 0.4s both`,
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}
        >
          {logoData.subtitle}
        </p>
      </div>

      {/* Skip Button - Smaller */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 text-white/70 hover:text-white text-xs font-medium transition-all duration-300"
        style={{
          animation: `fadeIn 0.5s ease-out 1s both`
        }}
      >
        Skip
      </button>

      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInScale {
            0% {
              opacity: 0;
              transform: scale(0.8) translateY(20px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          
          @keyframes slideUp {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
          
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 0.3;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.1;
            }
            100% {
              transform: scale(1.2);
              opacity: 0;
            }
          }
        `
      }} />
    </div>
  );
};

export default SplashScreen;
