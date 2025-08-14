import { useState, useEffect, useCallback } from "react";

export function useKeyboardNavigation({ 
  itemCount, 
  gridColumns, 
  onNavigateToDetail,
  viewMode = "grid" 
}) {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Calculate grid dimensions
  const getGridDimensions = useCallback(() => {
    if (viewMode === "list") {
      return { columns: 1, rows: itemCount };
    }
    const columns = gridColumns;
    const rows = Math.ceil(itemCount / columns);
    return { columns, rows };
  }, [itemCount, gridColumns, viewMode]);

  // Navigate with arrow keys
  const handleKeyDown = useCallback((event) => {
    if (itemCount === 0) return;
    
    const { columns, rows } = getGridDimensions();
    
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        setFocusedIndex(prev => {
          if (prev === -1) return 0;
          return Math.min(prev + 1, itemCount - 1);
        });
        break;
        
      case "ArrowLeft":
        event.preventDefault();
        setFocusedIndex(prev => {
          if (prev === -1) return 0;
          return Math.max(prev - 1, 0);
        });
        break;
        
      case "ArrowDown":
        event.preventDefault();
        setFocusedIndex(prev => {
          if (prev === -1) return 0;
          const nextRow = prev + columns;
          return Math.min(nextRow, itemCount - 1);
        });
        break;
        
      case "ArrowUp":
        event.preventDefault();
        setFocusedIndex(prev => {
          if (prev === -1) return 0;
          const prevRow = prev - columns;
          return Math.max(prevRow, 0);
        });
        break;
        
      case "Enter":
        if (focusedIndex >= 0 && focusedIndex < itemCount) {
          event.preventDefault();
          onNavigateToDetail?.(focusedIndex);
        }
        break;
        
      case "Home":
        event.preventDefault();
        setFocusedIndex(0);
        break;
        
      case "End":
        event.preventDefault();
        setFocusedIndex(itemCount - 1);
        break;
        
      case "Escape":
        event.preventDefault();
        setFocusedIndex(-1);
        break;
        
      default:
        break;
    }
  }, [itemCount, focusedIndex, onNavigateToDetail, getGridDimensions]);

  // Reset focus when items change
  useEffect(() => {
    if (focusedIndex >= itemCount) {
      setFocusedIndex(itemCount > 0 ? itemCount - 1 : -1);
    }
  }, [itemCount, focusedIndex]);

  // Add/remove event listeners
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return {
    focusedIndex,
    setFocusedIndex,
    clearFocus: () => setFocusedIndex(-1),
    isFocused: (index) => focusedIndex === index,
  };
}