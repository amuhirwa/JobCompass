import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useCallback } from 'react';

export const useAnchorNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pendingSectionRef = useRef<string | null>(null);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      pendingSectionRef.current = null;
      return true;
    }
    return false;
  }, []);

  const navigateToSection = useCallback(
    (sectionId: string) => {
      const isOnLandingPage = location.pathname === '/';

      if (isOnLandingPage) {
        // If already on landing page, just scroll to the section
        scrollToSection(sectionId);
      } else {
        // If on a different page, navigate to landing page first
        pendingSectionRef.current = sectionId;
        navigate('/');
      }
    },
    [location.pathname, navigate, scrollToSection]
  );

  // Effect to handle scrolling after navigation to landing page
  useEffect(() => {
    if (location.pathname === '/' && pendingSectionRef.current) {
      // Wait a bit for the page to render, then try scrolling
      const timeoutId = setTimeout(() => {
        if (pendingSectionRef.current) {
          const success = scrollToSection(pendingSectionRef.current);
          if (!success) {
            // If first attempt fails, try again after a longer delay
            setTimeout(() => {
              if (pendingSectionRef.current) {
                scrollToSection(pendingSectionRef.current);
              }
            }, 500);
          }
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [location.pathname, scrollToSection]);

  return { navigateToSection };
};
