import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import './PaschalCaseStudy.css';

/* Paschal's live portfolio. If emptied, the "View Site" links render as
   plain text instead of dead links. */
const SITE_URL = 'https://paschalworks.vercel.app/';

const SKILLS = [
  'Figma', 'HTML', 'CSS', 'React', 'TypeScript', 'Vite', 'Shadcn/ui',
  'Bun', 'TanStack Start', 'Git', 'Vercel',
];

/* All mockup videos are 2560 x 1920 */
const VIDEO_W = 2560;
const VIDEO_H = 1920;

/* The walkthroughs play this much faster than they were recorded */
const PLAYBACK_RATE = 1.5;

/* The laptop videos fill their card, except `whole` ones, which are shown
   uncropped at full height like the phones. The phone videos are shown at full height
   instead (cover would crop the top of the phone), on a background matching
   the video's own edges; `fade` melts sides that aren't a flat colour.
   Every card's background is shaded darker while the device stays bright:
   the phones never move, so `device` is the phone's outline in video pixels
   (x, y, w, h and corner radius r) and everything outside it is shaded; the
   laptops get a vignette that leaves the centre clear. */
const VIDEOS = [
  { src: '/paschal/mockup-1.webm', label: "Paschal's portfolio on desktop", fade: true, whole: true },
  { src: '/paschal/mockup-2.webm', label: "Paschal's portfolio on desktop, second walkthrough", fade: true, whole: true },
  {
    src: '/paschal/mobile-mockup-1.webm',
    label: "Paschal's portfolio on mobile",
    bg: '#000000',
    fade: true,
    device: { x: 924, y: 237, w: 676, h: 1415, r: 118 },
  },
  {
    src: '/paschal/mobile-mockup-2.webm',
    label: "Paschal's portfolio on mobile, second walkthrough",
    bg: '#acacac',
    device: { x: 991, y: 261, w: 571, h: 1206, r: 100 },
  },
];

function ViewSite({ className }) {
  const label = (
    <>
      View Site <span aria-hidden="true">&rarr;</span>
    </>
  );

  return SITE_URL ? (
    <a className={className} href={SITE_URL} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  ) : (
    <span className={className}>{label}</span>
  );
}

/* A looping mockup video that only plays (and downloads) while on screen */
function MockupVideo({ src, label, bg, fade = false, whole = false, device = null }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    video.defaultPlaybackRate = PLAYBACK_RATE;
    video.playbackRate = PLAYBACK_RATE;
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
      { threshold: 0.15 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const video = (
    <video
      ref={ref}
      className="paschal-video"
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
    />
  );

  if (!device && !whole) {
    return (
      <div className="paschal-video-card" data-reveal>
        {video}
        <div className="paschal-video-shade paschal-video-shade--vignette" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div
      className={`paschal-video-card paschal-video-card--full${fade ? ' paschal-video-card--fade' : ''}`}
      style={bg ? { backgroundColor: bg } : undefined}
      data-reveal
    >
      <div className="paschal-video-frame">
        {video}
        {/* A phone-shaped hole whose shadow shades everything around it */}
        {device && <div
          className="paschal-video-shade paschal-video-shade--device"
          aria-hidden="true"
          style={{
            left: `${(device.x / VIDEO_W) * 100}%`,
            top: `${(device.y / VIDEO_H) * 100}%`,
            width: `${(device.w / VIDEO_W) * 100}%`,
            height: `${(device.h / VIDEO_H) * 100}%`,
            borderRadius: `${(device.r / device.w) * 100}% / ${(device.r / device.h) * 100}%`,
          }}
        />}
      </div>
      {!device && (
        <div className="paschal-video-shade paschal-video-shade--vignette" aria-hidden="true" />
      )}
    </div>
  );
}

/* Adds .is-in to each [data-reveal] block the first time it scrolls into
   view; the CSS animates it from there. */
function useReveal() {
  useEffect(() => {
    const blocks = document.querySelectorAll('.paschal-page [data-reveal]');
    if (!('IntersectionObserver' in window)) {
      blocks.forEach((el) => el.classList.add('is-in'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
    );

    blocks.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function PaschalCaseStudy() {
  useReveal();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="paschal-page">
      <Header />

      <main>
        {/* 1. HERO */}
        <section className="paschal-hero">
          <img
            src="/paschal/hero-spheres.jpg"
            alt=""
            className="paschal-hero-art"
            width="1600"
            height="1218"
            decoding="async"
          />

          <div className="paschal-hero-content">
            <h1 className="paschal-hero-title">Paschal Portfolio</h1>

            <p className="paschal-hero-intro">
              I built Paschal&rsquo;s portfolio to showcase his work as a video motion editor.
              The site features a clean, professional design with intuitive navigation that
              highlights his expertise in creating engaging and impactful learning experiences.
              Each project is presented in a structured layout, making it easy for visitors to
              explore his skills, approach, and accomplishments.
            </p>

            <h2 className="paschal-meta-title">DATE</h2>
            <p className="paschal-meta-text">2026</p>

            <h2 className="paschal-meta-title">SKILLS</h2>
            <p className="paschal-meta-text paschal-meta-skills">{SKILLS.join(', ')}</p>
          </div>
        </section>

        <div className="paschal-view-site-row">
          <ViewSite className="paschal-view-site" />
        </div>

        {/* 2. MOCKUP VIDEOS */}
        <section className="paschal-videos" aria-label="Site walkthrough videos">
          {VIDEOS.map((video) => (
            <MockupVideo key={video.src} {...video} />
          ))}
        </section>

        {/* 3. OUTRO */}
        <section className="paschal-outro" data-reveal>
          <ViewSite className="paschal-view-site" />
          <p className="paschal-next-label">Next Project</p>
          <Link to="/projects/nova" className="paschal-next-pill">
            NOVA &rarr;
          </Link>
        </section>
      </main>
    </div>
  );
}
