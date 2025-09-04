import { useState, useEffect, useRef, useCallback } from 'react';

interface UseScrollspyOptions {
  sectionIds: string[];
  rootMargin?: string;
  threshold?: number;
}

export const useScrollspy = (options: UseScrollspyOptions) => {
  const { sectionIds, rootMargin = '0px', threshold = 0.3 } = options;
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const updateActiveSection = useCallback((entries: IntersectionObserverEntry[]) => {
    const intersecting = entries.filter((entry) => entry.isIntersecting);
    
    if (intersecting.length > 0) {
      // Find the section with the highest intersection ratio (most visible)
      const mostVisible = intersecting.reduce((prev, current) =>
        current.intersectionRatio > prev.intersectionRatio ? current : prev
      );
      setActiveSection(mostVisible.target.id);
    } else {
      // If no sections are intersecting, check which one is closest to the top
      const allEntries = entries.filter(entry => 
        sectionIds.includes(entry.target.id)
      );
      
      if (allEntries.length > 0) {
        const closest = allEntries.reduce((prev, current) => {
          const prevDistance = Math.abs(prev.boundingClientRect.top);
          const currentDistance = Math.abs(current.boundingClientRect.top);
          return currentDistance < prevDistance ? current : prev;
        });
        
        // Only update if the closest section is above the viewport
        if (closest.boundingClientRect.top <= 100) {
          setActiveSection(closest.target.id);
        }
      }
    }
  }, [sectionIds]);

  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(updateActiveSection, {
      rootMargin,
      threshold,
    });

    // Observe all sections
    const elementsToObserve = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as Element[];

    elementsToObserve.forEach((element) => {
      observerRef.current?.observe(element);
    });

    // Cleanup on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [sectionIds, rootMargin, threshold, updateActiveSection]);

  return activeSection;
};
