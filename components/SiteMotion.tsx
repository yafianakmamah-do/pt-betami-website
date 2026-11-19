'use client';

import { useEffect } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { usePathname } from 'next/navigation';

const revealItems = [
  '.business-chapter',
  '.internship-about__visual',
  '.internship-profile__portrait',
  '.internship-profile__details > div',
  '.internship-closing__visual',
  '.cinematic-page--contact > section > div > .grid > div',
  '.cinematic-page--sustainability > section > div > .grid > div:not(.relative)',
];

export default function SiteMotion() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.25 });

  useEffect(() => {
    if (reduceMotion) return;

    const main = document.querySelector<HTMLElement>('main.cinematic-home, main.cinematic-page');
    if (!main) return;

    const revealed = new Set<HTMLElement>();
    const parallaxImages = new Set<HTMLImageElement>();
    let frame = 0;

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        element.dataset.siteRevealed = 'true';
        revealObserver.unobserve(element);
      });
    }, { threshold: 0.01 });

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const image = entry.target as HTMLImageElement;
        if (entry.isIntersecting) parallaxImages.add(image);
        else {
          parallaxImages.delete(image);
          image.style.removeProperty('--site-parallax-y');
        }
      });
      requestFrame();
    }, { rootMargin: '140px 0px' });

    const updateParallax = () => {
      frame = 0;
      const viewportCenter = window.innerHeight / 2;
      parallaxImages.forEach((image) => {
        const rect = image.getBoundingClientRect();
        const distance = (rect.top + rect.height / 2 - viewportCenter) / window.innerHeight;
        const offset = Math.max(-14, Math.min(14, distance * -24));
        image.style.setProperty('--site-parallax-y', `${offset.toFixed(2)}px`);
      });
    };

    function requestFrame() {
      if (!frame) frame = window.requestAnimationFrame(updateParallax);
    }

    const registerTargets = (root: ParentNode) => {
      root.querySelectorAll<HTMLElement>(
        'main.cinematic-home > section:not(.home-opening), main.cinematic-page > section:not(.editorial-hero)',
      ).forEach((section) => {
        if (section.dataset.siteReveal) return;
        section.dataset.siteReveal = 'section';
        revealed.add(section);
        revealObserver.observe(section);
      });

      let itemIndex = 0;
      revealItems.forEach((selector) => {
        root.querySelectorAll<HTMLElement>(selector).forEach((item) => {
          if (item.dataset.siteReveal) return;
          item.dataset.siteReveal = 'item';
          item.style.setProperty('--site-motion-delay', `${Math.min(itemIndex++, 5) * 70}ms`);
          revealed.add(item);
          revealObserver.observe(item);
        });
      });

      root.querySelectorAll<HTMLImageElement>(
        'main > section:not(.home-opening):not(.editorial-hero) img:not([role="presentation"]):not(.internship-lightbox__image)',
      ).forEach((image) => {
        if (image.dataset.siteParallax) return;
        image.dataset.siteParallax = 'true';
        parallaxImages.add(image);
        imageObserver.observe(image);
      });

      requestFrame();
    };

    registerTargets(document);
    const mutationObserver = new MutationObserver((records) => {
      if (records.some((record) => record.addedNodes.length > 0)) registerTargets(main);
    });
    mutationObserver.observe(main, { childList: true, subtree: true });

    window.addEventListener('scroll', requestFrame, { passive: true });
    window.addEventListener('resize', requestFrame);

    return () => {
      mutationObserver.disconnect();
      revealObserver.disconnect();
      imageObserver.disconnect();
      window.removeEventListener('scroll', requestFrame);
      window.removeEventListener('resize', requestFrame);
      if (frame) window.cancelAnimationFrame(frame);
      revealed.forEach((element) => {
        delete element.dataset.siteReveal;
        delete element.dataset.siteRevealed;
        element.style.removeProperty('--site-motion-delay');
      });
      parallaxImages.forEach((image) => {
        delete image.dataset.siteParallax;
        image.style.removeProperty('--site-parallax-y');
      });
    };
  }, [pathname, reduceMotion]);

  if (reduceMotion || pathname.startsWith('/admin')) return null;

  return (
    <motion.div
      className="site-scroll-progress"
      style={{ scaleX: progress }}
      aria-hidden="true"
    />
  );
}
