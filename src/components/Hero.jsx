import React, { useEffect, useState } from 'react';

const TITLE = 'CHINEME';

/* Typed part of the subtitle. BREAK_AT is where the mobile line break sits
   (after "I Design and "), matching the original <br className="hero-sub-br" />. */
const TYPED = 'I Design and Build Digital Products.';
const BREAK_AT = 13;

const TYPE_START_DELAY = 1300; // ms — lets the CHINEME reveal land first
const TYPE_SPEED = 65;
const DELETE_SPEED = 32;
const HOLD_FULL = 2200;
const HOLD_EMPTY = 500;

/* Types the subtitle out, holds, deletes it and repeats. Reduced motion
   shows the full text with no cursor. */
function useTypewriter() {
  const [reduceMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [count, setCount] = useState(reduceMotion ? TYPED.length : 0);
  const [deleting, setDeleting] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const id = setTimeout(() => setStarted(true), TYPE_START_DELAY);
    return () => clearTimeout(id);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion || !started) return undefined;

    let delay;
    let next;
    if (!deleting && count === TYPED.length) {
      delay = HOLD_FULL;
      next = () => setDeleting(true);
    } else if (deleting && count === 0) {
      delay = HOLD_EMPTY;
      next = () => setDeleting(false);
    } else {
      delay = deleting ? DELETE_SPEED : TYPE_SPEED;
      next = () => setCount((c) => c + (deleting ? -1 : 1));
    }

    const id = setTimeout(next, delay);
    return () => clearTimeout(id);
  }, [count, deleting, started, reduceMotion]);

  return { count, showCursor: !reduceMotion };
}

/* Renders a slice of TYPED, inserting the mobile line break (which sits just
   before character BREAK_AT) if that character falls inside the slice */
function withBreak(from, to) {
  const text = TYPED.slice(from, to);
  if (BREAK_AT < from || BREAK_AT >= to) return text;
  const at = BREAK_AT - from;
  return (
    <>
      {text.slice(0, at)}
      <br className="hero-sub-br" />
      {text.slice(at)}
    </>
  );
}

export default function Hero() {
  const { count, showCursor } = useTypewriter();

  const handleScrollClick = () => {
    const projectsEl = document.getElementById('projects');
    if (projectsEl) {
      projectsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="hero-section">
      <div className="hero-center-content">
        <h1 className="hero-title" aria-label={TITLE}>
          {TITLE.split('').map((letter, i) => (
            <span
              className="hero-letter"
              aria-hidden="true"
              style={{ '--letter-i': i }}
              key={i}
            >
              {letter}
            </span>
          ))}
          <span className="hero-dot" aria-hidden="true"></span>
        </h1>
        <p className="hero-subtitle">
          <span className="sr-only">Hey! I'm Chineme Worlu, I Design and Build Digital Products.</span>
          <span aria-hidden="true">
            Hey! I'm Chineme Worlu ,
            {/* Untyped characters stay in the flow as invisible text, so the
                line never reflows while typing. */}
            <span className="hero-typed">{withBreak(0, count)}</span>
            {showCursor && <span className="hero-cursor" />}
            <span className="hero-untyped">{withBreak(count, TYPED.length)}</span>
          </span>
        </p>
      </div>

      <div
        className="hero-scroll-indicator"
        onClick={handleScrollClick}
        role="button"
        tabIndex={0}
        aria-label="Scroll to view projects"
      >
        <span className="scroll-text">Scrool to view</span>
        <svg
          className="scroll-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="9.5" r="5.5" />
          <path d="M7 17.5c2.5 1.8 7.5 1.8 10 0" />
        </svg>
      </div>
    </section>
  );
}
