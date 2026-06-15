import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { type ReactNode } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Cinematic curtain wipe between routes.
 * An --ink panel sweeps across, the new page reveals behind it.
 * Falls back to crossfade on reduced motion.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname}>
        {/* Curtain overlay */}
        <motion.div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--color-ink)',
            zIndex: 9990,
            originX: 0,
            pointerEvents: 'none',
          }}
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0, transition: { duration: 0.7, ease: [0.85, 0, 0.15, 1], delay: 0.15 } }}
          exit={{ scaleX: 1, transition: { duration: 0.5, ease: [0.85, 0, 0.15, 1] } }}
        />

        {/* Page content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.4 } }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
