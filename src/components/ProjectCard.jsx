import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/* Reveals the card's logo (its visible title) once the card scrolls into view */
function useTitleReveal() {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setRevealed(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, revealed];
}

/* Plays the card's background video only while it is on screen */
function useVisiblePlayback() {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (!('IntersectionObserver' in window)) {
      video.play().catch(() => {});
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return ref;
}

export default function ProjectCard({
  id,
  title,
  logoSrc,
  logoAlt,
  bgColor,
  figmaUrl = null,
  caseStudyUrl = null,
  isBlurred = false,
  logoScale = 1, // shrinks a logo that reads larger than the others
  videoSrc = null, // a looping mockup video that fills the card instead of a logo

}) {
  const [titleRef, titleRevealed] = useTitleReveal();
  const videoRef = useVisiblePlayback();

  const cardInner = videoSrc ? (
    <video
      ref={videoRef}
      className="project-card-video"
      src={videoSrc}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  ) : (
    <>
      <div
        ref={titleRef}
        className={`project-card-logo-container project-title-reveal${titleRevealed ? ' is-revealed' : ''}`}
      >
        <img
          src={logoSrc}
          alt={logoAlt || title}
          className="project-card-logo"
          style={logoScale !== 1 ? { scale: logoScale } : undefined}
          loading="lazy"
          decoding="async"
        />
      </div>
    </>
  );

  if (caseStudyUrl) {
    return (
      <Link
        id={id}
        to={caseStudyUrl}
        className={`project-card${videoSrc ? ' project-card--video' : ''} ${isBlurred ? 'card-blurred' : ''}`}
        style={{ backgroundColor: bgColor }}
        aria-label={`View ${title} Case Study`}
      >
        {cardInner}
      </Link>
    );
  }

  // No case study or Figma link yet: a plain, non-clickable card
  if (!figmaUrl) {
    return (
      <div
        id={id}
        className={`project-card${videoSrc ? ' project-card--video' : ''} project-card--static ${isBlurred ? 'card-blurred' : ''}`}
        style={{ backgroundColor: bgColor }}
        role="img"
        aria-label={title}
      >
        {cardInner}
      </div>
    );
  }

  return (
    <a
      id={id}
      href={figmaUrl}
      className={`project-card${videoSrc ? ' project-card--video' : ''} ${isBlurred ? 'card-blurred' : ''}`}
      style={{ backgroundColor: bgColor }}
      target={figmaUrl ? '_blank' : undefined}
      rel={figmaUrl ? 'noopener noreferrer' : undefined}
      aria-label={`View ${title} Project`}
    >
      {cardInner}
    </a>
  );
}
