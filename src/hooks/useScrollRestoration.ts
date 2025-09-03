import { useEffect, useRef, useCallback } from "react";

interface ScrollPosition {
  x: number;
  y: number;
}

interface ScrollRestorationOptions {
  debounceMs?: number;
  maxRetries?: number;
  retryDelay?: number;
  enableHistory?: boolean;
}

// Global cache for scroll positions to persist across component unmounts
const globalScrollCache = new Map<string, ScrollPosition>();
const scrollListeners = new Map<string, () => void>();

export const useScrollRestoration = (
  key: string,
  options: ScrollRestorationOptions = {},
) => {
  const {
    debounceMs = 150, // Slightly longer debounce for better performance
    maxRetries = 5, // More retries for better accuracy
    retryDelay = 100, // Longer initial delay
    enableHistory = true,
  } = options || {};

  const restoredRef = useRef(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);

  // Improved save function with better accuracy and debouncing
  const saveScrollPosition = useCallback(() => {
    // Clear existing timeout to debounce saves
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      try {
        // Use multiple attempts to get the most accurate position
        const getAccuratePosition = (): ScrollPosition => {
          // Force layout calculation for accuracy
          document.documentElement.offsetHeight;

          return {
            x: Math.round(window.scrollX || window.pageXOffset || 0),
            y: Math.round(window.scrollY || window.pageYOffset || 0),
          };
        };

        let position = getAccuratePosition();

        // Double-check position after a small delay for accuracy
        setTimeout(() => {
          const verifyPosition = getAccuratePosition();
          // If positions are close, use the more recent one
          if (Math.abs(verifyPosition.y - position.y) <= 2) {
            position = verifyPosition;
          }

          // Save to both sessionStorage and global cache
          globalScrollCache.set(key, position);

          if (enableHistory) {
            sessionStorage.setItem(`scroll_${key}`, JSON.stringify(position));
          }
        }, 10);
      } catch (error) {
        console.warn("Failed to save scroll position:", error);
      }
    }, debounceMs);
  }, [key, debounceMs, enableHistory]);

  // Optimized restore function with retry logic
  const restoreScrollPosition = useCallback(() => {
    if (restoredRef.current) return;

    const attemptRestore = (retryCount = 0): void => {
      try {
        // Try global cache first (faster)
        let position = globalScrollCache.get(key);

        // Fallback to sessionStorage
        if (!position && enableHistory) {
          const saved = sessionStorage.getItem(`scroll_${key}`);
          if (saved) {
            position = JSON.parse(saved);
          }
        }

        if (!position) {
          restoredRef.current = true;
          return;
        }

        // Comprehensive content readiness check for accurate scroll restoration
        const isContentReady = () => {
          // Basic document readiness
          const documentReady = document.readyState === "complete";
          const hasScrollableContent =
            document.body.scrollHeight > 0 &&
            document.documentElement.scrollHeight > 0;

          // Check if images are loaded (they can affect layout)
          const images = Array.from(document.images);
          const imagesLoaded = images.every((img) => img.complete);

          // Check if fonts are loaded (they can affect text layout)
          const fontsLoaded = document.fonts
            ? document.fonts.ready
            : Promise.resolve();

          // Ensure no pending layout changes
          const noLayoutChanges =
            document.documentElement.scrollHeight ===
            document.documentElement.scrollHeight;

          return (
            documentReady &&
            hasScrollableContent &&
            imagesLoaded &&
            noLayoutChanges
          );
        };

        if (!isContentReady() && retryCount < maxRetries) {
          setTimeout(
            () => attemptRestore(retryCount + 1),
            retryDelay * Math.pow(2, retryCount), // Exponential backoff
          );
          return;
        }

        // Calculate more accurate scroll boundaries
        const maxX = Math.max(
          0,
          document.documentElement.scrollWidth - window.innerWidth,
        );
        const maxY = Math.max(
          0,
          document.documentElement.scrollHeight - window.innerHeight,
        );

        const validPosition: ScrollPosition = {
          x: Math.max(0, Math.min(position.x, maxX)),
          y: Math.max(0, Math.min(position.y, maxY)),
        };

        // Use the most reliable scroll method with better timing
        const performScroll = () => {
          // Force layout calculation first
          document.documentElement.offsetHeight;

          // Use window.scrollTo with instant behavior for precision
          window.scrollTo({
            left: validPosition.x,
            top: validPosition.y,
            behavior: "instant",
          });
        };

        // Perform scroll with double RAF for better timing
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            performScroll();
          });
        });

        // Verify restoration with improved accuracy
        setTimeout(() => {
          requestAnimationFrame(() => {
            const currentX = window.scrollX || window.pageXOffset || 0;
            const currentY = window.scrollY || window.pageYOffset || 0;
            const tolerance = 1; // Much tighter tolerance for better accuracy

            const isRestored =
              Math.abs(currentX - validPosition.x) <= tolerance &&
              Math.abs(currentY - validPosition.y) <= tolerance;

            if (!isRestored && retryCount < maxRetries) {
              retryCountRef.current = retryCount + 1;
              setTimeout(
                () => attemptRestore(retryCount + 1),
                retryDelay * Math.pow(2, retryCount), // Exponential backoff
              );
            } else {
              restoredRef.current = true;
              retryCountRef.current = 0;

              // Clean up stored position after successful restoration
              if (enableHistory) {
                sessionStorage.removeItem(`scroll_${key}`);
              }
              globalScrollCache.delete(key);
            }
          });
        }, 50); // Small delay to ensure scroll has completed
      } catch (error) {
        console.warn("Failed to restore scroll position:", error);
        restoredRef.current = true;
      }
    };

    // Wait for comprehensive content loading for maximum accuracy
    const startRestoration = () => {
      // Additional delay for navigation scenarios where content may still be loading
      const baseDelay = 50;
      const navigationDelay = 100;

      // Wait for fonts to load if supported
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          setTimeout(() => attemptRestore(), baseDelay);
          // Extra attempt for navigation scenarios
          setTimeout(() => attemptRestore(), navigationDelay);
        });
      } else {
        setTimeout(() => attemptRestore(), baseDelay);
        setTimeout(() => attemptRestore(), navigationDelay);
      }
    };

    if (document.readyState === "complete") {
      startRestoration();
    } else {
      // Listen for multiple completion events
      window.addEventListener("load", startRestoration, { once: true });
      document.addEventListener("DOMContentLoaded", startRestoration, {
        once: true,
      });

      // Multiple fallbacks with increasing delays
      setTimeout(() => attemptRestore(), 100);
      setTimeout(() => attemptRestore(), 250);
      setTimeout(() => attemptRestore(), 500);
    }
  }, [key, maxRetries, retryDelay, enableHistory]);

  // Clear scroll position and cache
  const clearScrollPosition = useCallback(() => {
    try {
      if (enableHistory) {
        sessionStorage.removeItem(`scroll_${key}`);
      }
      globalScrollCache.delete(key);
      restoredRef.current = false;
      retryCountRef.current = 0;

      // Remove scroll listener if it exists
      const listener = scrollListeners.get(key);
      if (listener) {
        window.removeEventListener("scroll", listener);
        scrollListeners.delete(key);
      }
    } catch (error) {
      console.warn("Failed to clear scroll position:", error);
    }
  }, [key, enableHistory]);

  // Get current scroll position
  const getCurrentScrollPosition = useCallback((): ScrollPosition => {
    return {
      x: window.scrollX || window.pageXOffset || 0,
      y: window.scrollY || window.pageYOffset || 0,
    };
  }, []);

  // Check if restoration is needed
  const shouldRestore = useCallback((): boolean => {
    return (
      globalScrollCache.has(key) ||
      (enableHistory && sessionStorage.getItem(`scroll_${key}`) !== null)
    );
  }, [key, enableHistory]);

  // Set up automatic scroll saving on scroll events with improved accuracy
  useEffect(() => {
    // Remove existing listener if any
    const existingListener = scrollListeners.get(key);
    if (existingListener) {
      window.removeEventListener("scroll", existingListener);
    }

    // Create optimized scroll listener with throttling for better accuracy
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      if (restoredRef.current) {
        // Clear any pending scroll saves to avoid over-saving
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }

        // Save position after scrolling stops for better accuracy
        scrollTimeout = setTimeout(() => {
          saveScrollPosition();
        }, 50); // Short delay to capture final position
      }
    };

    // Store listener reference
    scrollListeners.set(key, handleScroll);

    // Add passive listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      scrollListeners.delete(key);

      // Clear timeouts on cleanup
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [key, saveScrollPosition]);

  // Auto-restore on mount with enhanced timing
  useEffect(() => {
    // Add a small delay for navigation scenarios
    const navigationDelay = setTimeout(() => {
      restoreScrollPosition();
    }, 50);

    // Cleanup on unmount
    return () => {
      clearTimeout(navigationDelay);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [restoreScrollPosition]);

  return {
    saveScrollPosition,
    restoreScrollPosition,
    clearScrollPosition,
    getCurrentScrollPosition,
    shouldRestore,
    isRestored: restoredRef.current,
  };
};

// Utility function to clear all scroll positions
export const clearAllScrollPositions = (): void => {
  try {
    globalScrollCache.clear();

    // Clear all scroll-related items from sessionStorage
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith("scroll_")) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => sessionStorage.removeItem(key));
  } catch (error) {
    console.warn("Failed to clear all scroll positions:", error);
  }
};

// Utility function to get all stored scroll positions (for debugging)
export const getAllScrollPositions = (): Record<string, ScrollPosition> => {
  const positions: Record<string, ScrollPosition> = {};

  try {
    // Get from global cache
    globalScrollCache.forEach((position, key) => {
      positions[key] = position;
    });

    // Get from sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith("scroll_")) {
        try {
          const scrollKey = key.replace("scroll_", "");
          const position = JSON.parse(sessionStorage.getItem(key) || "{}");
          if (!positions[scrollKey]) {
            positions[scrollKey] = position;
          }
        } catch (parseError) {
          console.warn(
            `Failed to parse scroll position for ${key}:`,
            parseError,
          );
        }
      }
    }
  } catch (error) {
    console.warn("Failed to get all scroll positions:", error);
  }

  return positions;
};

export default useScrollRestoration;
