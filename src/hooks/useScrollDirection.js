import { useState, useEffect } from "react";

export function useScrollDirection(threshold = 10) {
  const [scrollDirection, setScrollDirection] = useState("up");
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      
      // Check if at top of page
      setIsAtTop(scrollY < 20);
      
      // Only update direction if we've scrolled more than threshold
      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }
      
      // Determine scroll direction
      const direction = scrollY > lastScrollY ? "down" : "up";
      setScrollDirection(direction);
      
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    const handleScroll = () => requestTick();

    // Add event listener
    window.addEventListener("scroll", handleScroll);
    
    // Initial check
    updateScrollDirection();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return {
    scrollDirection,
    isAtTop,
    isScrollingUp: scrollDirection === "up",
    isScrollingDown: scrollDirection === "down",
    shouldShowHeader: scrollDirection === "up" || isAtTop,
  };
}