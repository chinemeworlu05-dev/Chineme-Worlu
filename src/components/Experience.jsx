import React from 'react';

const experiences = [
  {
    company: 'BoldStart Digital',
    role: 'Junior Web Designer (Contract)',
    dates: 'Jul 2026 - Aug 2026',
  },
  {
    company: 'Favy Tech Academy',
    role: 'Product Design Lead (Part-time)',
    dates: 'Feb 2026 - May 2026',
  },
];

export default function Experience() {
  return (
    <section id="experience" className="experience-section reveal-on-scroll">
      <div className="section-container">
        <h2 className="section-title reveal-text">EXPERIENCE</h2>
        <div className="experience-list">
          {experiences.map((item, index) => (
            <React.Fragment key={index}>
              <hr className="experience-divider" />
              <div className="experience-item reveal-text" style={{ '--reveal-i': index + 1 }}>
                <div className="experience-info">
                  <h3 className="experience-heading">{item.company}</h3>
                  <p className="experience-subtext">{item.role}</p>
                </div>
                <div className="experience-dates">
                  <span>{item.dates}</span>
                </div>
              </div>
            </React.Fragment>
          ))}
          <hr className="experience-divider" />
        </div>
      </div>
    </section>
  );
}
