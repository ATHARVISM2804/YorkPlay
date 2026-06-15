import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface RevealImageProps {
  children: ReactNode;
  className?: string;
  direction?: 'left' | 'right' | 'bottom';
}

/**
 * Clip-path wipe reveal with slow scale settle.
 * Falls back to simple opacity fade on reduced motion.
 */
export default function RevealImage({
  children,
  className = '',
  direction = 'left',
}: RevealImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (prefersReducedMotion) {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.5 });
      return;
    }

    const clipFrom: Record<string, string> = {
      left: 'inset(0 100% 0 0)',
      right: 'inset(0 0 0 100%)',
      bottom: 'inset(100% 0 0 0)',
    };

    gsap.set(el, {
      clipPath: clipFrom[direction],
      scale: 1.15,
    });

    gsap.to(el, {
      clipPath: 'inset(0 0% 0 0)',
      scale: 1,
      duration: 1.4,
      ease: 'power3.inOut',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        once: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [prefersReducedMotion, direction]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ overflow: 'hidden', willChange: 'clip-path, transform' }}
    >
      {children}
    </div>
  );
}
