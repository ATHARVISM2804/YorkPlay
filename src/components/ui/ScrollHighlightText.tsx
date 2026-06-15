import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface ScrollHighlightTextProps {
  children: string;
  className?: string;
}

export default function ScrollHighlightText({ children, className = '' }: ScrollHighlightTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion) return;

    const words = container.querySelectorAll('.highlight-word');

    // Create a scroll-driven timeline that lights up the text word by word
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 75%', // starts when the top is 75% down the viewport
        end: 'bottom 45%', // ends when the bottom is 45% down
        scrub: 0.5,
      },
    });

    tl.fromTo(
      words,
      {
        opacity: 0.12,
        color: '#7A6A52', // var(--color-muted)
      },
      {
        opacity: 1,
        color: '#F0E6D2', // var(--color-paper)
        stagger: 0.1,
        ease: 'none',
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === container) st.kill();
      });
    };
  }, [children, prefersReducedMotion]);

  const words = children.split(' ');

  return (
    <p
      ref={containerRef}
      className={className}
      style={{
        lineHeight: 1.5,
      }}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="highlight-word"
          style={{
            display: 'inline-block',
            marginRight: '0.28em',
            opacity: prefersReducedMotion ? 1 : 0.12,
            willChange: 'opacity, color',
          }}
        >
          {word}
        </span>
      ))}
    </p>
  );
}
