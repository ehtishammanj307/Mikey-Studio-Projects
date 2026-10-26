import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

// Global Lenis instance ref — set by SmoothScroll so scrollToSection can use it
let lenisInstance: Lenis | null = null;

export function setLenisInstance(lenis: Lenis | null) {
  lenisInstance = lenis;
}

export function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '');

  useEffect(() => {
    let current = sectionIds[0] ?? '';
    const observer = new IntersectionObserver(
      (entries) => {
        // Process entries to find the most visible section
        let bestId = current;
        let bestRatio = 0;
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestId = entry.target.id;
          }
        });
        if (bestRatio > 0) {
          current = bestId;
          setActiveId(bestId);
        }
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    const elements: Element[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    });

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds.join(',')]);

  return activeId;
}

export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}

export function scrollToSection(href: string) {
  const el = document.querySelector(href) as HTMLElement | null;
  if (!el) return;

  const headerOffset = 72;

  if (lenisInstance) {
    // Use Lenis for smooth scroll coordination
    const targetY = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    lenisInstance.scrollTo(targetY, { offset: 0 });
  } else {
    // Fallback: native scroll with header offset
    const targetY = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }
}
