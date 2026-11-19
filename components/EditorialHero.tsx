'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

type EditorialHeroProps = {
  image: string;
  title: string;
  description: string;
  eyebrow?: string;
  priority?: boolean;
  actions?: { href: string; label: string; variant?: 'primary' | 'secondary' }[];
};

export default function EditorialHero({
  image,
  title,
  description,
  eyebrow = 'PT Benih Tamiang · Aceh Tamiang',
  priority = true,
  actions = [],
}: EditorialHeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="editorial-hero">
      <motion.div
        className="editorial-hero__image"
        initial={reduceMotion ? false : { scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image src={image} alt="" fill priority={priority} quality={75} sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="editorial-hero__shade" />
      <motion.div
        className="editorial-hero__content"
        initial={reduceMotion ? false : { opacity: 0, y: 34 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.9, delay: reduceMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="editorial-hero__eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        {actions.length > 0 && (
          <div className="editorial-hero__actions">
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`editorial-hero__action editorial-hero__action--${action.variant ?? 'primary'}`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        )}
        <span className="editorial-hero__index" aria-hidden="true">BETAMI / 01</span>
      </motion.div>
    </section>
  );
}
