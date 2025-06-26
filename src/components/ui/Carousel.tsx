import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
  slideClassName?: string;
  showNavButtons?: boolean;
  showDotIndicators?: boolean;
}

export default function Carousel<T>({
  items,
  renderItem,
  autoPlay = true,
  autoPlayInterval = 5000,
  className = "",
  slideClassName = "",
  showNavButtons = true,
  showDotIndicators = true,
}: CarouselProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Update isAutoPlaying when autoPlay prop changes
  useEffect(() => {
    setIsAutoPlaying(autoPlay);
  }, [autoPlay]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(handleNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isAutoPlaying, handleNext, autoPlayInterval]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <div
      className={`relative overflow-hidden flex justify-center items-center ${className}`}
      onMouseEnter={() => autoPlay && setIsAutoPlaying(false)}
      onMouseLeave={() => autoPlay && setIsAutoPlaying(true)}
    >
      <div className="flex justify-center items-center min-h-[170px] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className={`flex justify-center items-center w-full ${slideClassName}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            {renderItem(items[currentIndex])}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      {showNavButtons && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 text-white rounded-full 
                     opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity duration-200 hover:bg-black/30"
            aria-label="Previous Item"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 text-white rounded-full 
                     opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity duration-200 hover:bg-black/30"
            aria-label="Next Item"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDotIndicators && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pb-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlaying(false);
              }}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex
                  ? "bg-blue-500"
                  : "bg-gray-600 dark:bg-gray-200 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
