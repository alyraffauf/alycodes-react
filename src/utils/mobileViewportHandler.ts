/**
 * Mobile Viewport Handler
 * Utility to handle various mobile viewport behaviors and optimizations
 */

// Fix iOS 100vh issue (where 100vh is taller than the visible viewport)
export const fixIOSVh = (): void => {
  // First we get the viewport height and multiply it by 1% to get a value for a vh unit
  const vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  // Update on resize and orientation change
  window.addEventListener('resize', () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });
};

// Fix position:fixed elements when keyboard appears on mobile
export const fixMobileKeyboard = (): void => {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  if (!isMobile) return;

  const inputs = document.querySelectorAll('input, textarea');

  inputs.forEach((input: Element) => {
    input.addEventListener('focus', () => {
      // Add a class to the body when keyboard is likely to be shown
      document.body.classList.add('keyboard-open');

      // Scroll to the input after a short delay
      setTimeout(() => {
        (input as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    });

    input.addEventListener('blur', () => {
      // Remove the class when keyboard is hidden
      document.body.classList.remove('keyboard-open');
    });
  });
};

// Disable pull-to-refresh on mobile but keep normal scrolling behavior
export const disablePullToRefresh = (): void => {
  let startY: number;

  document.addEventListener('touchstart', (e: TouchEvent) => {
    startY = e.touches[0].pageY;
  }, { passive: true });

  document.addEventListener('touchmove', (e: TouchEvent) => {
    const y = e.touches[0].pageY;
    const isScrollingDown = startY < y;
    const isAtTop = window.scrollY === 0;

    // If we're at the top of the page and trying to scroll down further, prevent default
    if (isAtTop && isScrollingDown) {
      e.preventDefault();
    }
  }, { passive: false });
};

// Improve tap response time by applying active state on touchstart instead of click
export const improveTapResponse = (): void => {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  if (!isMobile) return;

  const buttons = document.querySelectorAll('button, .btn, .nav-link, [role="button"]');

  buttons.forEach((button: Element) => {
    button.addEventListener('touchstart', () => {
      (button as HTMLElement).classList.add('is-active');
    }, { passive: true });

    button.addEventListener('touchend', () => {
      setTimeout(() => {
        (button as HTMLElement).classList.remove('is-active');
      }, 100);
    }, { passive: true });
  });
};

// Initialize all mobile viewport optimizations
export const initMobileViewport = (): void => {
  // Only run on mobile devices
  if (!/Mobi|Android/i.test(navigator.userAgent)) return;

  fixIOSVh();
  fixMobileKeyboard();
  disablePullToRefresh();
  improveTapResponse();

  // Add a class to the body for mobile-specific CSS targeting
  document.body.classList.add('is-mobile');

  // Add iOS class if needed
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    document.body.classList.add('is-ios');
  }
};
