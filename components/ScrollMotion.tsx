'use client';

import { useRef, type ReactNode } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect } from 'react';

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export function ScrollReveal({ children, className, delay = 0, y = 28 }: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className ? `${className} scroll-reveal` : 'scroll-reveal'}
      initial={shouldReduceMotion ? false : { opacity: 0, y: Math.max(y, 42), scale: 0.975 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.95, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

type CountUpProps = {
  value: number;
  suffix?: string;
  duration?: number;
  delay?: number;
  className?: string;
};

export function CountUp({ value, suffix = '', duration = 1.6, delay = 0, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const shouldReduceMotion = useReducedMotion();
  const count = useMotionValue(shouldReduceMotion ? value : 0);
  const rounded = useTransform(count, (latest) => `${Math.round(latest)}${suffix}`);

  useEffect(() => {
    if (!isInView) return;
    if (shouldReduceMotion) {
      count.set(value);
      return;
    }

    const controls = animate(count, value, { duration, delay, ease: 'easeOut' });
    return () => controls.stop();
  }, [count, delay, duration, isInView, shouldReduceMotion, value]);

  return <motion.span ref={ref} className={className} aria-label={`${value}${suffix}`}>{rounded}</motion.span>;
}

type ScrollParallaxProps = {
  children: ReactNode;
  className?: string;
  distance?: number;
};

export function ScrollParallax({ children, className, distance = 18 }: ScrollParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={shouldReduceMotion ? false : { clipPath: 'inset(12% 0 0 0)', opacity: 0.72 }}
      whileInView={shouldReduceMotion ? undefined : { clipPath: 'inset(0% 0 0 0)', opacity: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: shouldReduceMotion ? 0 : 1, ease: [0.22, 1, 0.36, 1] }}
      style={shouldReduceMotion ? undefined : { y }}
    >
      {children}
    </motion.div>
  );
}
