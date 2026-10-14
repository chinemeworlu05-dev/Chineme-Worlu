import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectCard from './components/ProjectCard';
import Experience from './components/Experience';
import About from './components/About';
import Footer from './components/Footer';

import homeFindLogo from './assets/home-find-logo.png';
import meritLogo from './assets/merit-mfb-logo.png';
import novaLogo from './assets/nova-logo.png';

import useScrollReveal from './hooks/useScrollReveal';

// Lazy-load secondary case study route for optimal initial bundle performance
const HomeFindCaseStudy = lazy(() => import('./components/HomeFindCaseStudy'));
const MeritMfbCaseStudy = lazy(() => import('./components/MeritMfbCaseStudy'));
const NovaCaseStudy = lazy(() => import('./components/NovaCaseStudy'));
const WorkPage = lazy(() => import('./components/WorkPage'));

function RouteLoader() {
  return (
    <div className="route-loader-bar" role="progressbar" aria-label="Loading page">
      <div className="route-loader-progress" />
    </div>
  );
}

// Stacked project cards, top to bottom; each blurs once the next one slides over it
const CARD_IDS = ['projects', 'homefind', 'merit-mfb'];

function Portfolio() {
  useScrollReveal();
  const { hash } = useLocation();

  // Arriving from another page: open at the top (the hero), or at the
  // section a nav link asked for (e.g. /#about) — never mid-page.
  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1));
    if (target) {
      target.scrollIntoView({ behavior: 'instant' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [hash]);

  const [blurredCards, setBlurredCards] = useState([]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rects = CARD_IDS.map((id) => document.getElementById(id)?.getBoundingClientRect());
          if (rects.every(Boolean)) {
            // When the next card's top enters this card's visible area, trigger smooth blur
            const next = rects.map((rect, i) => i < rects.length - 1 && rects[i + 1].top <= rect.bottom - 40);
            setBlurredCards((prev) => (prev.join() === next.join() ? prev : next));
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="portfolio-app">
      <Header />
      <main className="main-content">
        <Hero />
        <section className="projects-container reveal-on-scroll">
          <ProjectCard
            id="projects"
            title="Nova"
            logoSrc={novaLogo}
            logoAlt="Nova"
            bgColor="#3762FF"
            logoScale={0.8}
            caseStudyUrl="/projects/nova"
            isBlurred={blurredCards[0]}
          />
          <ProjectCard
            id="homefind"
            title="Home Find"
            logoSrc={homeFindLogo}
            logoAlt="Home Find"
            bgColor="#FF6015"
            caseStudyUrl="/projects/homefind"
            figmaUrl="https://www.figma.com/design/v6sJbSW6cLoETGKfHETcJA/HOMEFIND--Project-?node-id=0-1&t=25e0U4l117l7kDJi-1"
            isBlurred={blurredCards[1]}
          />
          <ProjectCard
            id="merit-mfb"
            title="Merit MFB"
            logoSrc={meritLogo}
            logoAlt="Merit MFB"
            bgColor="#3E68A1"
            caseStudyUrl="/projects/merit-mfb"
            figmaUrl="https://www.figma.com/design/AsoYtartgiSbAzpHOEmD2c/Merit-MFB?node-id=0-1&t=0FAyv0v57aEfN1hR-1"
          />
        </section>
        <Experience />
        <About />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/projects/homefind" element={<HomeFindCaseStudy />} />
        <Route path="/projects/merit-mfb" element={<MeritMfbCaseStudy />} />
        <Route path="/projects/nova" element={<NovaCaseStudy />} />
        <Route path="/works" element={<WorkPage />} />
        <Route path="/work" element={<Navigate to="/works" replace />} />
      </Routes>
    </Suspense>
  );
}

