import { useEffect } from 'react';

/**
 * Lightweight scroll reveal hook using IntersectionObserver.
 * Observes all elements with the `.reveal-on-scroll` class and adds
 * `.is-revealed` when they enter the viewport.
 */
export default function useScrollReveal() {
  useEffect(() => {
    const selector = '.reveal-on-scroll, .cs-section:not(.cs-hero), .merit-section:not(.merit-hero)';
    const elements = document.querySelectorAll(selector);

    elements.forEach((el) => {
      if (!el.classList.contains('reveal-on-scroll')) {
        el.classList.add('reveal-on-scroll');
      }
    });

    // If browser doesn't support IntersectionObserver, reveal everything immediately
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target); // Reveal once
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.08,
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
