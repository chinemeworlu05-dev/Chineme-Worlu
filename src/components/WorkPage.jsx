import { useEffect, useRef } from 'react';
import Header from './Header';
import ProjectCard from './ProjectCard';
import './WorkPage.css';

import homeFindLogo from '../assets/home-find-logo.png';
import meritLogo from '../assets/merit-mfb-logo.png';
import novaLogo from '../assets/nova-logo.png';

/* Cards zig-zag down the page: left, right, left */
const PROJECTS = [
  {
    id: 'work-nova',
    title: 'Nova',
    logoSrc: novaLogo,
    bgColor: '#3762FF',
    logoScale: 0.8,
    caseStudyUrl: '/projects/nova',
  },
  {
    id: 'work-homefind',
    title: 'Home Find',
    logoSrc: homeFindLogo,
    bgColor: '#FF6015',
    caseStudyUrl: '/projects/homefind',
  },
  {
    id: 'work-merit-mfb',
    title: 'Merit MFB',
    logoSrc: meritLogo,
    bgColor: '#3E68A1',
    caseStudyUrl: '/projects/merit-mfb',
  },
];

export default function WorkPage() {
  const cardsRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  /* Cards on screen when the page opens pop up straight away (staggered);
     the rest pop as they scroll into view, so none animate unseen. */
  useEffect(() => {
    const slots = [...cardsRef.current.querySelectorAll('.work-card-slot')];
    if (!('IntersectionObserver' in window)) {
      slots.forEach((slot) => slot.classList.add('is-popped'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-popped');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    slots.forEach((slot) => observer.observe(slot));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="work-page">
      <Header />

      <main>
        <h1 className="sr-only">Works</h1>

        {/* Each card pops up in turn (see the observer above) */}
        <section className="work-cards" aria-label="Projects" ref={cardsRef}>
          {PROJECTS.map((project, i) => (
            <div className="work-card-slot" style={{ '--work-i': i }} key={project.id}>
              <ProjectCard logoAlt={project.title} {...project} />
            </div>
          ))}
        </section>
      </main>

      <footer className="work-footer">
        <p>&copy; 2026 Chineme Worlu</p>
      </footer>
    </div>
  );
}
