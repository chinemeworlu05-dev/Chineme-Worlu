import { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import './NovaCaseStudy.css';

/* The live NOVA landing page. If emptied, the "View Site" links render as
   plain text instead of dead links. */
const SITE_URL = 'https://nova-card-puce.vercel.app/';

const SKILLS = [
  'Figma', 'HTML', 'CSS', 'React', 'TypeScript', 'Vite', 'shadcn/ui',
  'Bun', 'TanStack Start', 'Git', 'Vercel',
];

const LIGHT_SCREENS = [
  { src: '/nova/light-1-splash.webp', alt: 'NOVA splash screen, light' },
  { src: '/nova/light-2-splash-blue.webp', alt: 'NOVA splash screen, blue' },
  { src: '/nova/light-3-onboarding.webp', alt: 'NOVA onboarding screen' },
  { src: '/nova/light-4-home.webp', alt: 'NOVA home screen with total balance' },
  { src: '/nova/light-5-card.webp', alt: 'NOVA USD dollar card controls screen' },
  { src: '/nova/light-6-profile.webp', alt: 'NOVA profile and security settings screen' },
  { src: '/nova/light-7-payment.webp', alt: 'NOVA payment successful receipt screen' },
];

const DARK_SCREENS = [
  { src: '/nova/dark-1-home.webp', alt: 'NOVA home screen, dark mode' },
  { src: '/nova/dark-2-card.webp', alt: 'NOVA USD dollar card controls screen, dark mode' },
  { src: '/nova/dark-3-profile.webp', alt: 'NOVA profile screen, dark mode' },
  { src: '/nova/dark-4-payment.webp', alt: 'NOVA payment receipt screen, dark mode' },
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

/* One row of phones scrolling sideways in a seamless loop. Each half of the
   track repeats the set `copies` times so it always overfills wide screens;
   only the first set is exposed to assistive tech, every repeat is hidden. */
function ScreenMarquee({ screens, copies, duration }) {
  const half = Array.from({ length: copies }, () => screens).flat();

  return (
    <div className="nova-marquee">
      <div className="nova-marquee-track" style={{ '--nova-marquee-dur': duration }}>
        {[...half, ...half].map((screen, i) => {
          const duplicate = i >= screens.length;
          return (
            <img
              key={`${screen.src}-${i}`}
              src={screen.src}
              alt={duplicate ? '' : screen.alt}
              aria-hidden={duplicate || undefined}
              className="nova-marquee-phone"
              loading="lazy"
              decoding="async"
            />
          );
        })}
      </div>
    </div>
  );
}

const STATEMENT = 'Designed to put your money and control in your hands';

/* Adds .is-in to each [data-reveal] block the first time it scrolls into
   view; the CSS animates its parts from there. */
function useReveal() {
  useEffect(() => {
    const blocks = document.querySelectorAll('.nova-page [data-reveal]');
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
      { rootMargin: '0px 0px -10% 0px', threshold: 0.2 }
    );

    blocks.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function NovaCaseStudy() {
  useReveal();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="nova-page">
      <Header />

      <main>
        {/* 1. HERO */}
        <section className="nova-hero">
          <img
            src="/nova/hero-glass.webp"
            alt=""
            className="nova-hero-art"
            width="1156"
            height="1734"
            decoding="async"
          />

          <div className="nova-hero-content">
            <h1 className="nova-hero-logo">
              <img
                src="/nova/nova-logo-white.png"
                alt="NOVA"
                width="1460"
                height="712"
                decoding="async"
              />
            </h1>

            <p className="nova-hero-intro">
              I designed NOVA, a mobile app for a USD dollar card, to give people full
              control over how they spend online globally. The app features a clean, modern
              interface with simple navigation that highlights key actions like freezing the
              card, viewing details, topping up, and managing security settings. I then built
              a responsive landing page to introduce the product, presenting each section in a
              structured layout that makes it easy for visitors to explore its features,
              security, and how to get started.
            </p>

            <h2 className="nova-meta-title">DATE</h2>
            <p className="nova-meta-text">2026</p>

            <h2 className="nova-meta-title">SKILLS</h2>
            <p className="nova-meta-text nova-meta-skills">{SKILLS.join(', ')}</p>
          </div>
        </section>

        {/* 2. LANDING PAGE — desktop */}
        <section className="nova-split nova-split--web" data-reveal>
          <img
            src="/nova/landing-desktop.webp"
            alt="NOVA landing page on desktop: Your Dollar Card. Your Money. Your Control."
            className="nova-split-media"
            width="1474"
            height="1049"
            loading="lazy"
            decoding="async"
          />

          <div className="nova-split-copy">
            <h2 className="nova-split-title">
              I built NOVA&rsquo;s landing page to introduce the app and its features to
              visitors.
            </h2>
            <p className="nova-split-text">
              The page has a responsive layout with a clear structure that makes it easy to
              explore the product, its security, and how to get started.
            </p>
            <ViewSite className="nova-view-site" />
          </div>
        </section>

        {/* 3. STATEMENT BAND */}
        <section className="nova-statement" data-reveal>
          <img
            src="/nova/crystals.webp"
            alt=""
            className="nova-statement-art"
            width="1652"
            height="1366"
            loading="lazy"
            decoding="async"
          />
          <h2 className="nova-statement-text" aria-label={STATEMENT}>
            {STATEMENT.split(' ').map((word, i) => (
              <Fragment key={i}>
                <span className="nova-word" aria-hidden="true" style={{ '--i': i }}>
                  {word}
                </span>{' '}
              </Fragment>
            ))}
          </h2>
        </section>

        {/* 4. LANDING PAGE — mobile */}
        <section className="nova-split nova-split--mobile" data-reveal>
          <div className="nova-split-copy">
            <h2 className="nova-split-title">
              Designed for seamless mobile experiences and intuitive navigation
            </h2>
            <p className="nova-split-text">
              Designed with users in mind, NOVA features a clean interface, intuitive
              navigation, and a modern visual experience. Every screen is crafted to make
              interactions simple, accessible, and effortless, showcasing a user-centered
              approach to mobile design.
            </p>
            <ViewSite className="nova-view-site" />
          </div>

          <img
            src="/nova/landing-mobile.webp"
            alt="NOVA landing page on mobile"
            className="nova-split-media"
            width="667"
            height="1450"
            loading="lazy"
            decoding="async"
          />
        </section>

        {/* 5. APP SCREENS */}
        <section className="nova-screens" aria-labelledby="nova-screens-title">
          <h2 className="nova-screens-intro" id="nova-screens-title" data-reveal>
            I also designed NOVA, a mobile app for a USD dollar card that gives people full
            control over their money and here they are..
          </h2>

          <div className="nova-mode nova-mode--light" data-reveal>
            <h3 className="nova-mode-label"><span>Light Mode</span></h3>
            <ScreenMarquee screens={LIGHT_SCREENS} copies={2} duration="80s" />
          </div>
        </section>

        <section className="nova-mode nova-mode--dark" aria-label="Dark mode screens" data-reveal>
          <h3 className="nova-mode-label"><span>Dark Mode</span></h3>
          <ScreenMarquee screens={DARK_SCREENS} copies={3} duration="70s" />
        </section>

        {/* 6. OUTRO */}
        <section className="nova-outro" data-reveal>
          <ViewSite className="nova-outro-link" />
          <p className="nova-next-label">Next Project</p>
          <Link to="/projects/homefind" className="nova-next-pill">
            Home Find &rarr;
          </Link>
        </section>
      </main>
    </div>
  );
}
