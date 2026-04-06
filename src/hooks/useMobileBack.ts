import { useEffect, useRef } from 'react';

export const useMobileBack = () => {
  const isPushedRef = useRef(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      if (window.innerWidth >= 768) {
        isPushedRef.current = false;
        return;
      }

      const threshold = window.innerHeight * 0.5; // Past halfway
      const scrolledPast = window.scrollY > threshold;

      if (scrolledPast && !isPushedRef.current) {
        // Push state so back button triggers popstate instead of exiting
        window.history.pushState({ backIntercept: true }, '');
        isPushedRef.current = true;
      } else if (!scrolledPast && isPushedRef.current) {
        // Scrolled back up manually
        // We can't cleanly pop state without triggering the back event.
        // We'll just leave it and handle it in popstate.
      }
    };

    const handlePopState = () => {
      if (window.innerWidth >= 768) return;

      if (isPushedRef.current && window.scrollY > 100) {
        // Intercept back button, scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        isPushedRef.current = false;
        
        // Prevent default behavior just in case, though pop state already occurred
      } else {
        // Already at top, or not pushed. Let natural back happen.
        isPushedRef.current = false;
      }
    };

    // Throttle scroll listener slightly for performance
    let scrollTimeout: number | undefined;
    const scrollListener = () => {
      if (!scrollTimeout) {
        scrollTimeout = window.setTimeout(() => {
          handleScroll();
          scrollTimeout = undefined;
        }, 150);
      }
    };

    window.addEventListener('scroll', scrollListener, { passive: true });
    window.addEventListener('popstate', handlePopState);

    return () => {
      if (scrollTimeout) window.clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', scrollListener);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
};
