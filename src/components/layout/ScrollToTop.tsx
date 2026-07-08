import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

/**
 * ScrollToTop — resets scroll to the very top on every route change.
 *
 * Strategy (layered for reliability):
 *  1. Tell Lenis to jump instantly to 0 — bypasses its smooth animation.
 *  2. Reset native window + documentElement scroll as fallback.
 *  3. One rAF later reset again in case Lenis restores position after React re-mounts.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Lenis instant jump (if available)
    const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }

    // 2. Native scroll reset
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // 3. rAF safety net — fires after React has finished rendering the new page
    const raf = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      const l = (window as Window & { __lenis?: Lenis }).__lenis;
      if (l) l.scrollTo(0, { immediate: true });
    });

    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}
