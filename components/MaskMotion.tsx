'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type MaskTextProps = { children: ReactNode; className?: string; delay?: number; };

export function MaskText({ children, className, delay = 0 }: MaskTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <span className={`inline-block overflow-hidden ${className ?? ""}`}>
      <motion.span
        ref={ref}
        className="inline-block"
        initial={shouldReduceMotion ? false : { y: '110%', opacity: 0 }}
        animate={isInView ? { y: '0%', opacity: 1 } : {}}
        transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: 'inline-block' }}
      >
        {children}
      </motion.span>
    </span>
  );
}

type MaskHeadingProps = { text: string; className?: string; baseDelay?: number; };

export function MaskHeading({ text, className, baseDelay = 0 }: MaskHeadingProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const words = text.split(' ');
  return (
    <div ref={ref} className={`flex flex-wrap gap-x-[0.25em] ${className ?? ""}`} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden" aria-hidden="true">
          <motion.span
            className="inline-block"
            initial={shouldReduceMotion ? false : { y: '110%', opacity: 0 }}
            animate={isInView ? { y: '0%', opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: baseDelay + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'inline-block' }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  );
}
