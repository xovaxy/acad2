import { useState, useEffect } from 'react';

export const useSplashScreen = () => {
  const [showSplash, setShowSplash] = useState(true); // Always start with true
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    // Always show splash screen on every page load/refresh
    setShowSplash(true);
    setIsFirstVisit(true);
  }, []);

  const completeSplash = () => {
    setShowSplash(false);
    // No need to save to localStorage since we want it to show every time
  };

  const resetSplash = () => {
    // Simply reset the state to show splash again
    setShowSplash(true);
    setIsFirstVisit(true);
  };

  return {
    showSplash,
    isFirstVisit,
    completeSplash,
    resetSplash
  };
};
