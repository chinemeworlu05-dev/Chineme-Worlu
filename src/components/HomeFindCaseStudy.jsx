import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import useScrollReveal from '../hooks/useScrollReveal';
import './HomeFindCaseStudy.css';
import hfScreenHome from '../assets/hf-screen-home.png';
import hfScreenOnboarding from '../assets/hf-screen-onboarding.png';

const wireframeItems = [
  { id: 13, title: 'Smart Filtering for Precise Results', img: '/case-study/13.png' },
  { id: 14, title: 'Localized Property Discovery', img: '/case-study/14.png' },
  { id: 15, title: 'Verified Professional Credentials', img: '/case-study/15.png' },
  { id: 16, title: 'Comprehensive Property Overview', img: '/case-study/16.png' },
  { id: 17, title: 'Immersive Video Tours', img: '/case-study/17.png' },
  { id: 18, title: 'High-Resolution Visual Previews', img: '/case-study/18.png' },
  { id: 19, title: 'Direct Real-Time Communication', img: '/case-study/19.png' },
];

const finalProductItems = [
  { img: '/case-study/20.png', alt: 'Final product: Filter options' },
  { img: '/case-study/3.png', alt: 'Final product: Location and check availability' },
  { img: '/case-study/11.png', alt: 'Final product: Agent verified profile' },
  { img: '/case-study/5.png', alt: 'Final product: Room-by-room videos tour' },
  { img: '/case-study/6.png', alt: 'Final product: Photos gallery preview' },
  { img: '/case-study/9.png', alt: 'Final product: Direct messaging with Agent David' },
  { img: '/case-study/2.png', alt: 'Final product: Home feed discovery listings' },
  { img: '/case-study/4.png', alt: 'Final product: Property details and transparent pricing' },
  { img: '/case-study/saved.png', alt: 'Final product: Saved favorite properties' },
  { img: '/case-study/7.png', alt: 'Final product: Saved properties feed' },
  { img: '/case-study/8.png', alt: 'Final product: Apartment specifications' },
];

const COUNT_DELAY = 600; // ms — waits for the halves to slice in
const COUNT_DURATION = 1600; // ms — matches the ring's CSS transition

/* Split-circle stat: on scroll into view a ring circles round to the value
   while every number in the halves counts up from 0 in step with it. */
function InsightCircle({ value, decimals = 0, halves }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setActive(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [reduceMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (!active || reduceMotion) return undefined;

    let frame;
    let start;
    const tick = (now) => {
      if (start === undefined) start = now + COUNT_DELAY;
      const t = Math.min(Math.max((now - start) / COUNT_DURATION, 0), 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic, same curve as the ring
      setCount(value * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, value, reduceMotion]);

  const shown = (active && reduceMotion ? value : count).toFixed(decimals);

  return (
    <div
      ref={ref}
      className={`cs-split-circle${active ? ' is-counting' : ''}`}
      style={{ '--cs-ring-value': value }}
    >
      <svg className="cs-split-ring" viewBox="0 0 100 100" aria-hidden="true">
        <circle className="cs-split-ring-track" cx="50" cy="50" r="47" pathLength="100" />
        <circle className="cs-split-ring-fill" cx="50" cy="50" r="47" pathLength="100" />
      </svg>
      <div className="cs-split-circle-inner">
        {halves.map(({ tone, label }) => (
          <div className={`cs-half-circle ${tone}`} key={tone}>
            {label(shown)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomeFindCaseStudy() {
  useScrollReveal();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="case-study-page">
      {/* ====================================================================
          1. NAVIGATION — shared Header component
          ==================================================================== */}
      <Header />

      {/* ====================================================================
          MAIN CASE STUDY CONTENT
          ==================================================================== */}
      <main className="cs-main">

        {/* 2. HERO BANNER */}
        <section className="cs-section cs-hero">
          <div className="cs-hero-card">
            <div className="cs-hero-left">
              <h1 className="cs-hero-title">
                <span className="title-home">HOME</span> <span className="title-find">FIND</span>
              </h1>
              <div className="cs-hero-pills">
                <span className="cs-hero-pill">UX Research</span>
                <span className="cs-hero-pill">Product Design</span>
              </div>
            </div>
            <div className="cs-hero-right">
              <img
                src="/case-study/hero-phones.png"
                alt="Home Find mobile application previews"
                className="cs-hero-phones-img"
                loading="eager"
                decoding="async"
              />
            </div>

            {/* Mobile only: two upright phones, the front one overhanging the card */}
            <div className="cs-hero-phones-mobile">
              <img
                src={hfScreenHome}
                alt="Home Find home search screen"
                className="cs-hero-phone cs-hero-phone--back"
                width="496"
                height="1024"
                loading="eager"
                decoding="async"
              />
              <img
                src={hfScreenOnboarding}
                alt="Home Find onboarding screen"
                className="cs-hero-phone cs-hero-phone--front"
                width="501"
                height="1024"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </section>

        {/* 3. THE PROBLEM */}
        <section className="cs-section cs-problem reveal-on-scroll">
          <h2 className="cs-section-title">THE PROBLEM</h2>
          <div className="cs-problem-card">
            <p className="cs-problem-headline">
              Students and young professionals lack a reliable way to accurately preview rental properties before committing to physical visits.
            </p>
            <p className="cs-problem-body">
              When searching for rental housing, users struggle with wasted time, high viewing fees, and a lack of accurate information regarding property conditions. Current search methods lack the room-by-room visual transparency and verified utilities data needed for informed decision-making, forcing users to visit unsuitable homes in person and endure a process often described as &ldquo;stressful&rdquo; and &ldquo;exhausting&rdquo;.
            </p>
          </div>
        </section>

        {/* 4. THE SOLUTION */}
        <section className="cs-section cs-solution reveal-on-scroll">
          <div className="cs-solution-header">
            <h2 className="cs-section-title">THE SOLUTION</h2>
            <h3 className="cs-section-subtitle cs-underlined">
              Building trust through visual transparency and direct access.
            </h3>
          </div>

          {/* Solution 01 — text left, phones right */}
          <div className="cs-solution-block cs-solution-block-01">
            <div className="cs-sol-text">
              <span className="cs-sol-num">01</span>
              <h4 className="cs-sol-title">Room-by-Room Previews</h4>
              <p className="cs-sol-desc">
                Eliminate wasted trips by viewing detailed photo and video galleries of every room before visiting in person. Access &ldquo;Utility Check&rdquo; videos to verify the condition of essential services like electricity and water reliability.
              </p>
            </div>
            <div className="cs-phones-row-2">
              <img
                src="/case-study/5.png"
                alt="Room-by-room video gallery"
                className="cs-phone-mockup"
                loading="lazy"
                decoding="async"
              />
              <img
                src="/case-study/6.png"
                alt="Property photos overview"
                className="cs-phone-mockup"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          {/* Solution 02 — phones left, text right */}
          <div className="cs-solution-block cs-solution-block-02">
            <div className="cs-phones-row-2">
              <img
                src="/case-study/2.png"
                alt="Property feed discovery"
                className="cs-phone-mockup"
                loading="lazy"
                decoding="async"
              />
              <img
                src="/case-study/4.png"
                alt="Full property transparent details"
                className="cs-phone-mockup"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="cs-sol-text">
              <span className="cs-sol-num">02</span>
              <h4 className="cs-sol-title">Real-Time Transparency</h4>
              <p className="cs-sol-desc">
                See complete property details and full pricing breakdowns upfront, including rent and all associated fees. Make informed decisions quickly with verified listing badges and neighborhood safety information.
              </p>
            </div>
          </div>

          {/* Solution 03 — centered text then 3 phones */}
          <div className="cs-solution-block cs-solution-block-03">
            <div className="cs-sol-text-center">
              <span className="cs-sol-num">03</span>
              <h4 className="cs-sol-title">Direct Professional Access</h4>
              <p className="cs-sol-desc">
                Connect directly with agents or property managers via call, email, or in-app chat without paying unnecessary viewing fees. Review agent profiles and ratings to ensure you are dealing with reliable professionals.
              </p>
            </div>
            <div className="cs-phones-row-3">
              <img
                src="/case-study/9.png"
                alt="In-app direct chat with agent"
                className="cs-phone-mockup"
                loading="lazy"
                decoding="async"
              />
              <img
                src="/case-study/10.png"
                alt="Voice and video call screen"
                className="cs-phone-mockup"
                loading="lazy"
                decoding="async"
              />
              <img
                src="/case-study/11.png"
                alt="Agent David verified profile and ratings"
                className="cs-phone-mockup"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </section>

        {/* 5. RESEARCH & DISCOVERY */}
        <section className="cs-section cs-research reveal-on-scroll">
          <h2 className="cs-section-title">RESEARCH &amp; DISCOVERY</h2>
          <h3 className="cs-section-subtitle cs-underlined cs-centered">Understanding the Problem</h3>
          <p className="cs-research-lead cs-centered">
            I conducted both quantitative and qualitative research to deeply understand how students and young professionals currently search for and rent houses, their pain points, and what factors influence their decisions
          </p>

          <div className="cs-stats-grid">
            <div className="cs-stat-card">
              <span className="cs-stat-num">11</span>
              <span className="cs-stat-label">Survey Response</span>
            </div>
            <div className="cs-stat-card">
              <span className="cs-stat-num">15</span>
              <span className="cs-stat-label">Total Participants</span>
            </div>
            <div className="cs-stat-card">
              <span className="cs-stat-num">4</span>
              <span className="cs-stat-label">In-depth Interviews</span>
            </div>
          </div>

          <div className="cs-methods-header">
            <h4 className="cs-section-subtitle cs-underlined">Research Methods</h4>
          </div>

          <div className="cs-wide-photo-container">
            <img
              src="/case-study/12.png"
              alt="Contextual research and mobile usage in home space"
              className="cs-wide-photo"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Staggered Quant & Qual Cards */}
          <div className="cs-methods-staggered">
            <div className="cs-method-card left-aligned">
              <h4 className="cs-method-title">Quantitative Survey</h4>
              <p className="cs-method-desc">
                I distributed an online survey to capture behavioral patterns at scale. The survey covered current search methods, frustrations, decision factors, and the importance of remote previewing.
              </p>
              <h5 className="cs-questions-sub">Key Questions:</h5>
              <div className="cs-questions-list">
                <p>What is most frustrating about your house search?</p>
                <p>What information matters most to you before visiting?</p>
                <p>How important is it to be able to preview a property remotely?</p>
              </div>
            </div>

            <div className="cs-method-card right-aligned">
              <h4 className="cs-method-title">Qualitative Interviews</h4>
              <p className="cs-method-desc">
                I conducted 4 in-depth interviews with individuals who had recently searched for housing. These conversations revealed emotional journeys, specific agent-related frustrations, and the hidden costs of physical house hunting.
              </p>
            </div>
          </div>

          {/* Interview Participants & Yellow Chat Icons */}
          <div className="cs-interviews-row">
            <div className="cs-participants-card">
              <h4 className="cs-method-title">Interview Participants:</h4>
              <p className="cs-participant-item">
                <span className="cs-participant-name">Treasure:</span> Frustrated by agents ignoring requirements (e.g., being shown a 2-bed when asking for a 3-bed).
              </p>
              <p className="cs-participant-item">
                <span className="cs-participant-name">Miracle. N :</span> Concerned about the condition of the place and the type of neighbors.
              </p>
              <p className="cs-participant-item">
                <span className="cs-participant-name">Miracle. A :</span> Tired of traveling in the &ldquo;hot sun&rdquo; to see &ldquo;rubbish houses&rdquo;; wants to see videos from home.
              </p>
              <p className="cs-participant-item">
                <span className="cs-participant-name">Person 4:</span> Complained about outrageous viewing fees for properties that aren&apos;t worth the rent.
              </p>
            </div>

            <div className="cs-bubble-icons-side">
              <svg className="cs-speech-icon" viewBox="0 0 100 100">
                <path d="M50 15 C28 15 10 30 10 48 C10 59 17 68 28 74 C26 82 20 88 15 90 C23 91 34 87 40 81 C43 81 47 81 50 81 C72 81 90 66 90 48 C90 30 72 15 50 15 Z" />
                <circle cx="35" cy="48" r="5" fill="#000000" />
                <circle cx="50" cy="48" r="5" fill="#000000" />
                <circle cx="65" cy="48" r="5" fill="#000000" />
              </svg>
              <svg className="cs-speech-icon small" viewBox="0 0 100 100">
                <path d="M50 15 C28 15 10 30 10 48 C10 59 17 68 28 74 C26 82 20 88 15 90 C23 91 34 87 40 81 C43 81 47 81 50 81 C72 81 90 66 90 48 C90 30 72 15 50 15 Z" />
                <circle cx="35" cy="48" r="5" fill="#000000" />
                <circle cx="50" cy="48" r="5" fill="#000000" />
                <circle cx="65" cy="48" r="5" fill="#000000" />
              </svg>
            </div>
          </div>
        </section>

        {/* 6. INSIGHTS */}
        <section className="cs-section cs-insights reveal-on-scroll">
          <h2 className="cs-section-title">INSIGHTS</h2>

          {/* Insight 1: Visual Preview Priority */}
          <div className="cs-insight-item reveal-on-scroll">
            <h3 className="cs-section-subtitle cs-underlined">Visual Preview Priority</h3>
            <div className="cs-insight-row">
              <InsightCircle
                value={54}
                halves={[
                  { tone: 'white-bg', label: (n) => `${n}%` },
                  { tone: 'orange-bg', label: () => 'Said Visuals' },
                ]}
              />
              <div className="cs-insight-texts">
                <p className="cs-insight-text">
                  <span className="cs-bold-label">Insight:</span> 54.5% of users said photos and videos of actual property condition was their #1 priority before visiting - more than DOUBLE any other need (next was 18.2%). The core problem wasn&apos;t just connecting users to properties - it was making them feel confident in that connection through visual proof.
                </p>
                <p className="cs-insight-text">
                  <span className="cs-bold-label">Design Implication:</span> I realized the app had to prioritize visual content, not just property listings. So I designed room-by-room photo and video galleries, added a dedicated &ldquo;Utilities Check&rdquo; video category, and organized all media by specific areas (parlour, bedrooms, kitchen, toilets). This transformed the platform from a simple directory into a system where users could make confident decisions before wasting time on visits.
                </p>
              </div>
            </div>
          </div>

          {/* Insight 2: Remote Viewing */}
          <div className="cs-insight-item reveal-on-scroll">
            <h3 className="cs-section-subtitle cs-underlined">Remote Viewing</h3>
            <div className="cs-insight-row reverse">
              <div className="cs-insight-texts">
                <p className="cs-insight-text">
                  <span className="cs-bold-label">Insight:</span> 91% of users said they wanted the ability of remotely viewing a property before visiting. Current solutions don&apos;t offer this, which forces people to travel in person just to discover a listing isn&apos;t right.
                </p>
                <p className="cs-insight-text">
                  <span className="cs-bold-label">Design Implication:</span> I designed Home Find around remote previewing so users can watch room-by-room videos and inspect photos from home. That lets people shortlist with confidence and only visit properties that already feel like a match.
                </p>
              </div>
              <InsightCircle
                value={91}
                halves={[
                  { tone: 'orange-bg-large', label: (n) => `${n}%` },
                  { tone: 'white-bg-small', label: () => 'Wanted Remote Viewing' },
                ]}
              />
            </div>
          </div>

          {/* Insight 3: The Triple Problem */}
          <div className="cs-insight-item reveal-on-scroll">
            <h3 className="cs-section-subtitle cs-underlined">The Triple Problem (Same Pain Points)</h3>
            <div className="cs-insight-row">
              <InsightCircle
                value={27}
                halves={[
                  { tone: 'orange-bg', label: (n) => `${n}% of each` },
                  { tone: 'white-bg', label: (n) => `${n}%` },
                ]}
              />
              <div className="cs-insight-texts">
                <p className="cs-insight-text">
                  <span className="cs-bold-label">Insight:</span> Three problems tied EXACTLY at 27.3% each: wasted time visiting wrong properties, lack of accurate information, and high agent viewing fees. Current solutions only address one or two of these. The opportunity: solve all three simultaneously through one integrated approach - complete information upfront eliminates wasted visits AND reduces agent dependency.
                </p>
                <p className="cs-insight-text">
                  <span className="cs-bold-label">Design Implication:</span> I designed features that address all three problems at once. Complete property details (photos, videos, utilities, specs, neighborhood info) solve the information gap. This accuracy reduces wasted trips. Direct agent contact via call, email, or chat eliminates intermediary fees. Each feature compounds the others, creating a comprehensive solution rather than partial fixes.
                </p>
              </div>
            </div>
          </div>

          {/* Insight 4: Agent Reliability Problem */}
          <div className="cs-insight-item reveal-on-scroll">
            <h3 className="cs-section-subtitle cs-underlined">Agent Reliability Problem</h3>
            <div className="cs-insight-row reverse">
              <div className="cs-insight-texts">
                <p className="cs-insight-text">
                  <span className="cs-bold-label">Insight:</span> 54.5% of users currently search through agents/agencies, yet 27.3% complained about agents not listening to requirements and 27.3% complained about viewing fees. Users depend on agents because alternatives don&apos;t exist, but they don&apos;t trust them. The core issue: no accountability or verification system for agents, so users take &ldquo;leaps of faith&rdquo; repeatedly.
                </p>
                <p className="cs-insight-text">
                  <span className="cs-bold-label">Design Implication:</span> I designed agent profiles with verification elements - number of properties listed (51), ratings (4.5 stars), years active (3 years), and a user rating system. I also added a &ldquo;Report&rdquo; button for safety. This created transparency and accountability while maintaining the direct contact users need, building trust without eliminating the agent relationship entirely.
                </p>
              </div>
              <InsightCircle
                value={54.5}
                decimals={1}
                halves={[
                  { tone: 'orange-bg', label: (n) => `${n}% Out of 100` },
                  { tone: 'white-bg', label: (n) => `${n}%` },
                ]}
              />
            </div>
          </div>
        </section>

        {/* 7. USER PERSONAS */}
        <section className="cs-section cs-persona-section reveal-on-scroll">
          <h2 className="cs-section-title">USER PERSONA 1</h2>
          <div className="cs-persona-card">
            <div className="cs-persona-header">
              <h3 className="cs-persona-role">PERSONA 1: The Student</h3>
              <div className="cs-persona-meta-list">
                <p><strong>Name:</strong> Bolu Okunfor</p>
                <p><strong>Age:</strong> 22</p>
                <p><strong>Occupation:</strong> University Student</p>
                <p><strong>Student Location:</strong> Lagos, Nigeria</p>
                <p><strong>Education:</strong> Undergraduate (Year 3)</p>
              </div>
            </div>

            <div className="cs-persona-bio-block">
              <p><strong>Background:</strong> Bolu is a 3rd year student at the University of Lagos. He is looking for accommodation close to campus. He relies on friends and family for recommendations but finds the process frustrating and time-consuming. He&apos;s tech-savvy but there are no reliable apps that solve his problem.</p>
            </div>

            <div className="cs-persona-lists-grid">
              <div className="cs-persona-list-col">
                <h4 className="cs-persona-list-title goals">Goals:</h4>
                <ul className="cs-persona-bullet-list">
                  <li>Find affordable accommodation near campus</li>
                  <li>See property condition before visiting</li>
                  <li>Avoid paying unnecessary agent fees</li>
                  <li>Find somewhere safe with good utilities</li>
                </ul>
              </div>

              <div className="cs-persona-list-col">
                <h4 className="cs-persona-list-title frustrations">Frustrations:</h4>
                <ul className="cs-persona-bullet-list">
                  <li>Wasted viewing fees on unsuitable homes</li>
                  <li>Agents show wrong properties</li>
                  <li>Can&apos;t verify utilities before moving in</li>
                  <li>Hidden fees surprise him after viewing</li>
                </ul>
              </div>

              <div className="cs-persona-list-col">
                <h4 className="cs-persona-list-title behaviours">Behaviours:</h4>
                <ul className="cs-persona-bullet-list">
                  <li>Uses phone for everything</li>
                  <li>Prefers recommendations from friends</li>
                  <li>Searches on social media for listings</li>
                  <li>Asks family for agent contacts</li>
                </ul>
              </div>
            </div>

            <div className="cs-persona-quote-container">
              <p className="cs-persona-quote-p">
                <strong>Quote:</strong> &ldquo;I just want to see the house properly before I stress myself going there, only to be disappointed.&rdquo;
              </p>
            </div>
          </div>
        </section>

        <section className="cs-section cs-persona-section reveal-on-scroll">
          <h2 className="cs-section-title">USER PERSONA 2</h2>
          <div className="cs-persona-card">
            <div className="cs-persona-header">
              <h3 className="cs-persona-role">PERSONA 2: The Young Professional</h3>
              <div className="cs-persona-meta-list">
                <p><strong>Name:</strong> Femi Adesina</p>
                <p><strong>Age:</strong> 27 | <strong>Occupation:</strong> Marketing Executive</p>
                <p><strong>Location:</strong> Lagos, Nigeria</p>
                <p><strong>Income:</strong> &#8358;350,000 - &#8358;450,000/month</p>
              </div>
            </div>

            <div className="cs-persona-bio-block">
              <p><strong>Background:</strong> Adesola recently got a new job and needs to relocate closer to work. She&apos;s busy and can&apos;t afford to waste weekends visiting multiple properties. She wants a professional, reliable way to find a great apartment that matches her lifestyle and budget without depending on agents who don&apos;t listen.</p>
            </div>

            <div className="cs-persona-lists-grid">
              <div className="cs-persona-list-col">
                <h4 className="cs-persona-list-title goals">Goals:</h4>
                <ul className="cs-persona-bullet-list">
                  <li>Find a property that matches her exact requirements</li>
                  <li>Avoid wasting travel time</li>
                  <li>Know about neighborhood safety before visiting</li>
                  <li>Transparent rental costs upfront</li>
                  <li>Connect directly with reliable agents</li>
                </ul>
              </div>

              <div className="cs-persona-list-col">
                <h4 className="cs-persona-list-title frustrations">Frustrations:</h4>
                <ul className="cs-persona-bullet-list">
                  <li>No time to visit multiple properties</li>
                  <li>Unprofessional agents who delay</li>
                  <li>Can&apos;t find trustworthy neighborhood information</li>
                  <li>Hidden fees surprise her after viewing</li>
                  <li>Existing apps don&apos;t show enough detail</li>
                </ul>
              </div>

              <div className="cs-persona-list-col">
                <h4 className="cs-persona-list-title behaviours">Behaviours:</h4>
                <ul className="cs-persona-bullet-list">
                  <li>Uses apps for everything</li>
                  <li>Research-driven decision maker</li>
                  <li>Values time over money</li>
                  <li>Reads reviews before committing</li>
                  <li>Shares experiences with colleagues</li>
                </ul>
              </div>
            </div>

            <div className="cs-persona-quote-container">
              <p className="cs-persona-quote-p">
                <strong>Quote:</strong> &ldquo;I told the agent exactly what I wanted - 2 bedrooms, good electricity. They still took me somewhere completely different. It&apos;s exhausting!&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* 8. HOW MIGHT WE... */}
        <section className="cs-section cs-hmw reveal-on-scroll">
          <h2 className="cs-section-title">HOW MIGHT WE...</h2>
          <h3 className="cs-section-subtitle cs-underlined">
            Reframing the problems as opportunities for design:
          </h3>
          <div className="cs-hmw-bubbles-container">
            <div className="cs-hmw-bubble b1">
              How might we help students and young professionals preview properties remotely to save time and money?
            </div>
            <div className="cs-hmw-bubble b2">
              How might we provide accurate, room-by-room property information to build trust before a physical visit?
            </div>
            <div className="cs-hmw-bubble b3">
              How might we reduce the time users waste on unsuitable properties through better filering and matching?
            </div>
          </div>
        </section>

        {/* 9. THE STRUCTURE AND FLOW */}
        <section className="cs-section cs-flows reveal-on-scroll">
          <h2 className="cs-section-title">
            THE STRUCTURE AND FLOW ORGANISED BASED ON THE RESEARCG INSIGHTS
          </h2>

          <div className="cs-flow-item">
            <h3 className="cs-section-subtitle cs-underlined">
              User Flow 1: Search And Find Property
            </h3>
            <img
              src="/case-study/flow-1.png"
              alt="User Flow 1: Search And Find Property"
              className="cs-flow-img"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="cs-flow-item">
            <h3 className="cs-section-subtitle cs-underlined">
              User Flow 2: View Property And Information
            </h3>
            <img
              src="/case-study/flow-2.png"
              alt="User Flow 2: View Property And Information"
              className="cs-flow-img"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="cs-flow-item">
            <h3 className="cs-section-subtitle cs-underlined">
              User Flow 3: Contact Agent Directly
            </h3>
            <img
              src="/case-study/flow-3.png"
              alt="User Flow 3: Contact Agent Directly"
              className="cs-flow-img"
              loading="lazy"
              decoding="async"
            />
          </div>
        </section>

        {/* 10. RESEARCH IMPACT & KEY TAKEAWAYS */}
        <section className="cs-section cs-impact reveal-on-scroll">
          <h2 className="cs-section-title">RESEARCH IMPACT &amp; KEY TAKEAWAYS</h2>
          <p className="cs-impact-lead">
            The research phase fundamentally shifted the design direction for HomeFinder. By analyzing user feedback, I moved from a general listing concept to a verification-centered platform that prioritizes transparency and efficiency.
          </p>

          <div className="cs-impact-block indented-right">
            <h4 className="cs-impact-block-title">Three Critical Discoveries</h4>
            <div className="cs-impact-list">
              <p className="cs-impact-point">
                &bull; <strong>Trust is the Primary Barrier:</strong> Most users feel a &ldquo;neutral confidence&rdquo; when searching for homes, describing the process as a &ldquo;leap of faith&rdquo;. The core problem isn&apos;t just a lack of houses, but a lack of confidence in the listings found.
              </p>
              <p className="cs-impact-point">
                &bull; <strong>Availability Outweighs Price:</strong> For many participants, knowing a property is available immediately is more important than the cost. Speed becomes a critical factor because house hunting is often an urgent, high-stress activity.
              </p>
              <p className="cs-impact-point">
                &bull; <strong>The Digital Trust Gap:</strong> A vast majority of users rely on word-of-mouth and personal referrals rather than search engines. Current platforms fail because they lack the &ldquo;trustworthy signals&rdquo; that personal connections provide.
              </p>
            </div>
          </div>

          <div className="cs-impact-block indented-left">
            <h4 className="cs-impact-block-title">Design Transformation</h4>
            <div className="cs-impact-list">
              <p className="cs-impact-point">
                &bull; <strong>Building Accountability:</strong> I designed detailed agent profiles and verification badges to replace uncertainty with transparency.
              </p>
              <p className="cs-impact-point">
                &bull; <strong>Real-Time Engagement:</strong> To solve the need for speed, I implemented &ldquo;Active Now&rdquo; indicators and direct contact methods (call, email, chat) so users don&apos;t have to wait for callbacks.
              </p>
              <p className="cs-impact-point">
                &bull; <strong>Digitizing Social Proof:</strong> I integrated a room-by-room review system and &ldquo;Utility Check&rdquo; videos to provide the same reliable validation users get from friends.
              </p>
            </div>
          </div>
        </section>

        {/* 11. WIREFRAMES — Automatic Continuous Horizontal Animation */}
        <section className="cs-section cs-wireframes reveal-on-scroll">
          <h2 className="cs-section-title">WIREFRAMES</h2>

          <div className="cs-marquee-container" aria-label="Wireframe screens horizontal carousel">
            <div className="cs-marquee-track cs-wireframes-track">
              {[...wireframeItems, ...wireframeItems].map((item, index) => (
                <div key={index} className="cs-wireframe-item">
                  <span className="cs-wireframe-pill">{item.title}</span>
                  <img
                    src={item.img}
                    alt={item.title}
                    className="cs-wireframe-phone"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 12. COLOURS USED */}
        <section className="cs-section cs-colours reveal-on-scroll">
          <h2 className="cs-section-title">COLOURS USED</h2>
          <div className="cs-colours-card">
            <div className="cs-swatch light-text" style={{ backgroundColor: '#2E5BFF' }}>#2E5BFF</div>
            <div className="cs-swatch light-text" style={{ backgroundColor: '#FF6B35' }}>#FF6B35</div>
            <div className="cs-swatch light-text" style={{ backgroundColor: '#10B981' }}>#10B981</div>
            <div className="cs-swatch dark-text" style={{ backgroundColor: '#F5F5F5' }}>#F5F5F5</div>
            <div className="cs-swatch dark-text" style={{ backgroundColor: '#FFFFFF' }}>#FFFFFF</div>
            <div className="cs-swatch light-text" style={{ backgroundColor: '#1F2937' }}>#1F2937</div>
            <div className="cs-swatch light-text" style={{ backgroundColor: '#6B7280' }}>#6B7280</div>
            <div className="cs-swatch dark-text" style={{ backgroundColor: '#E5E7EB' }}>#E5E7EB</div>
          </div>
        </section>

        {/* 13. FINAL PRODUCT — Automatic Continuous Horizontal Animation */}
        <section className="cs-section cs-final-product reveal-on-scroll">
          <div className="cs-final-product-header">
            <h2 className="cs-section-title">FINAL PRODUCT</h2>
            <span className="cs-final-product-count">40 + Screens</span>
          </div>

          <div className="cs-marquee-container" aria-label="Final product screens horizontal carousel">
            <div className="cs-marquee-track cs-final-track">
              {[...finalProductItems, ...finalProductItems].map((item, index) => (
                <div key={index} className="cs-final-item">
                  <img
                    src={item.img}
                    alt={item.alt}
                    className="cs-final-phone"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 14. WHAT I LEARNED & NEXT PROJECT */}
        <section className="cs-section cs-learned reveal-on-scroll">
          <h2 className="cs-section-title">WHAT I LEARNED</h2>

          <div className="cs-learned-bubble-container">
            <div className="cs-learned-circle-bubble">
              <h3 className="cs-learned-bubble-title">What I&apos;d Do Differently</h3>
              <div className="cs-learned-points">
                <p className="cs-learned-point">
                  <strong>Agent-Side Research:</strong> While I focused on house hunters, I&apos;d also interview agents to understand their pain points. This would help design a better experience for both sides of the platform.
                </p>
                <p className="cs-learned-point">
                  <strong>Usability Testing:</strong> I would conduct proper usability testing with 5-8 users before moving to high-fidelity designs. This would help catch problems earlier and improve design decisions.
                </p>
                <p className="cs-learned-point">
                  <strong>Older User Consideration:</strong> I would conduct additional research focusing on older users (40+) to ensure the app is simple and easy enough for people who are less comfortable with technology, making HomeFinder accessible to a wider age range.
                </p>
              </div>
            </div>
          </div>

          <div className="cs-footer-cta">
            <a href="https://www.figma.com" target="_blank" rel="noopener noreferrer" className="cs-figma-btn">
              View Figma File &rarr;
            </a>
            <span className="cs-next-label">Next Project</span>
            <Link to="/projects/merit-mfb" className="cs-next-project-pill">
              Merit MFB &rarr;
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
