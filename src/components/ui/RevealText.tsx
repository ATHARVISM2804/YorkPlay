import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface RevealTextProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  delay?: number;
  /** If true, animates on mount instead of on scroll */
  immediate?: boolean;
}

/**
 * Line-by-line text reveal using GSAP ScrollTrigger.
 * Splits text into words, masks up from below with stagger.
 * Falls back to simple opacity fade on reduced motion.
 */
export default function RevealText({
  children,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  immediate = false,
}: RevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const words = container.querySelectorAll('.reveal-word');

    if (prefersReducedMotion) {
      // Simple fade-in
      gsap.fromTo(
        container,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, delay }
      );
      return;
    }

    gsap.set(words, { y: '110%', opacity: 0 });

    const trigger = immediate
      ? undefined
      : {
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            once: true,
          },
        };

    gsap.to(words, {
      y: '0%',
      opacity: 1,
      duration: 0.9,
      stagger: 0.04,
      ease: 'power3.out',
      delay,
      ...trigger,
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === container) st.kill();
      });
    };
  }, [children, prefersReducedMotion, delay, immediate]);

  // Split text into words wrapped in spans
  const words = children.split(' ');

  return (
    <Tag
      className={className}
      ref={containerRef as React.Ref<HTMLHeadingElement>}
      style={{ overflow: 'hidden' }}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            marginRight: '0.3em',
          }}
        >
          <span
            className="reveal-word"
            style={{
              display: 'inline-block',
              willChange: 'transform',
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
}
