import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import './MeritMfbCaseStudy.css';

const FIGMA_URL =
  'https://www.figma.com/design/AsoYtartgiSbAzpHOEmD2c/Merit-MFB?node-id=0-1&t=0FAyv0v57aEfN1hR-1';

const PROBLEMS = [
  {
    title: 'Financial Exclusion',
    body: "Millions of Africans don't have access to reliable banking services no savings account, no easy way to send money, and no financial tools to help them grow.",
  },
  {
    title: 'Slow and Expensive Transfers',
    body: 'Sending money across Africa is still slow, costly, and frustrating with hidden fees and unreliable networks.',
  },
  {
    title: 'No Savings Culture',
    body: "Most people don't save consistently because there's no simple, motivating system to help them set goals and stay disciplined.",
  },
  {
    title: 'Poor Mobile Banking Experience',
    body: 'Existing banking apps in Africa are outdated, confusing, and not built for everyday users especially those who are new to digital banking.',
  },
  {
    title: 'No Financial Visibility',
    body: "People can't track their spending, monitor their balance easily, or understand where their money is going.",
  },
];

const SOLUTIONS = [
  {
    title: 'Accessible Digital Banking',
    body: 'Merit MFB gives every African access to a full digital bank account from their phone no branch visits, no paperwork.',
  },
  {
    title: 'Instant Payments and Transfers',
    body: 'Send money instantly across Africa with low fees, real time transaction tracking, and a simple contact based flow.',
  },
  {
    title: 'Smart Savings Goals',
    body: 'Users create savings goals, set deadlines, and enable auto save making saving feel effortless and rewarding.',
  },
  {
    title: 'Clean and Intuitive UI',
    body: 'Designed from the ground up for African users simple, fast, and easy to use for both first-time and experienced digital banking users.',
  },
  {
    title: 'Full Financial Visibility',
    body: 'A clear dashboard showing balance, recent activity, credits, debits, and savings progress all in one place.',
  },
];

/* Order follows the reference: Goal Details, onboarding, profile, dashboard */
const SCREENS = [
  { src: '/merit/44.png', alt: 'Merit MFB savings goal details screen' },
  { src: '/merit/55.png', alt: 'Merit MFB cross-border payments onboarding screen' },
  { src: '/merit/66.png', alt: 'Merit MFB profile and referral screen' },
  { src: '/merit/22.png', alt: 'Merit MFB home dashboard screen' },
];

/* A single row of phones scrolling horizontally */
const MARQUEE_COPIES = 3;

function buildLane(phase) {
  const sequence = [...SCREENS.slice(phase), ...SCREENS.slice(0, phase)];
  const half = Array.from({ length: MARQUEE_COPIES }, () => sequence).flat();
  return [...half, ...half.map((screen) => ({ ...screen, duplicated: true }))];
}

const LANES = [buildLane(0)];

function InfoCard({ index, offset, title, body }) {
  return (
    <article
      className={`merit-card is-${offset}`}
      id={`item-${index + 1}`}
      style={{ '--merit-slice-i': index }}
    >
      <h3 className="merit-card-title">
        {index + 1}. {title}
      </h3>
      <p className="merit-card-body">{body}</p>
    </article>
  );
}

/* Cards alternate bleeding off the right and left edges, continuing across both sections.
   On scroll into view they slice in from the edge they bleed past and settle into place. */
function CardList({ items, startOffset }) {
  const listRef = useRef(null);
  const [sliced, setSliced] = useState(false);

  useEffect(() => {
    const el = listRef.current;
    if (!el || !('IntersectionObserver' in window)) {
      setSliced(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSliced(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`merit-cards${sliced ? ' is-sliced' : ''}`} ref={listRef}>
      {items.map((item, i) => (
        <InfoCard
          key={item.title}
          index={i}
          offset={(startOffset === 'right') === (i % 2 === 0) ? 'right' : 'left'}
          {...item}
        />
      ))}
    </div>
  );
}

export default function MeritMfbCaseStudy() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="merit-page">
      <Header />

      <main className="merit-main">
        <section className="merit-hero">
          <div className="merit-brand">
            <img
              src="/merit/merit_icon.png"
              alt=""
              className="merit-brand-icon"
              width="438"
              height="456"
              loading="eager"
              decoding="async"
            />
            <img
              src="/merit/merit_wordmark.png"
              alt="Merit MFB"
              className="merit-brand-wordmark"
              width="786"
              height="74"
              loading="eager"
              decoding="async"
            />
          </div>

          <div className="merit-hero-phones">
            <img
              src="/merit/11.png"
              alt="Merit MFB splash screen"
              className="merit-hero-phone"
              width="939"
              height="1900"
              loading="eager"
              decoding="async"
            />
            <img
              src="/merit/22.png"
              alt="Merit MFB home dashboard screen"
              className="merit-hero-phone"
              width="939"
              height="1900"
              loading="eager"
              decoding="async"
            />
            <img
              src="/merit/33.png"
              alt="Merit MFB transactions screen"
              className="merit-hero-phone"
              width="939"
              height="1900"
              loading="eager"
              decoding="async"
            />
          </div>
        </section>

        <section className="merit-section merit-section--problem" aria-labelledby="problem-title">
          <h2 className="merit-heading" id="problem-title">THE PROBLEM</h2>
          <CardList items={PROBLEMS} startOffset="right" />
        </section>

        <section className="merit-section merit-section--solution" aria-labelledby="solution-title">
          <h2 className="merit-heading" id="solution-title">SOLUTION</h2>
          <CardList items={SOLUTIONS} startOffset="left" />
        </section>

        <section className="merit-section merit-section--screens" aria-labelledby="screens-title">
          <div className="merit-screens-head">
            <h2 className="merit-heading" id="screens-title">SCREENS</h2>
            <span className="merit-screens-count">26 + Screens</span>
          </div>

          <div className="merit-marquee">
            {LANES.map((lane, laneIndex) => (
              <div className="merit-marquee-lane" key={`lane-${laneIndex}`}>
                <div className="merit-marquee-track">
                  {lane.map((screen, i) => (
                    <img
                      key={`${screen.src}-${i}`}
                      src={screen.src}
                      alt={screen.duplicated ? '' : screen.alt}
                      className="merit-marquee-phone"
                      width="939"
                      height="1900"
                      loading="eager"
                      decoding="async"
                      aria-hidden={screen.duplicated || undefined}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="merit-outro">
          <a
            className="merit-figma-link"
            href={FIGMA_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Figma File &rarr;
          </a>

          <p className="merit-next-label">Next Project</p>

          <Link to="/projects/nova" className="merit-next-pill">
            NOVA &rarr;
          </Link>
        </section>
      </main>
    </div>
  );
}
