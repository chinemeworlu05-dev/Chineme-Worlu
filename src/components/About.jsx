import React from 'react';

export default function About() {
  return (
    <section id="about" className="about-section reveal-on-scroll">
      <div className="section-container">
        <h2 className="section-title reveal-text">ABOUT</h2>
        <div className="about-content-wrapper">
          <p className="about-description reveal-text" style={{ '--reveal-i': 1 }}>
            I'm a Product Designer and Engineer who designs web and mobile
            products and builds them into live experiences. Figma is where I design, and I use
            code and AI tools to bring those designs to life. I enjoy the full
            journey from understanding a user’s problem to shipping something
            people can actually use. I pay attention to small details like
            spacing, consistency, and clarity, because they decide whether a
            product feels trustworthy. I’m based in Lagos, Nigeria, and I’m open
            to new opportunities.
          </p>
        </div>
      </div>
    </section>
  );
}
