import React from 'react';

const features = [
  {
    icon: '🔌',
    title: 'Plug & Play',
    description:
      'Compatible with all Ethereum consensus clients. Install, configure your relays, and start earning maximum rewards.',
  },
  {
    icon: '🏗️',
    title: 'Builder Market',
    description:
      'Access blocks from a competitive marketplace of builders who optimize for MEV extraction and fair reward distribution.',
  },
  {
    icon: '🔒',
    title: 'Open & Neutral',
    description:
      'Free, open-source, and audited software. Run by thousands of validators to promote decentralization and censorship resistance.',
  },
];

export default function Hero() {
  return (
    <>
      <div className="hero-landing">
        <img
          src="/img/mev-boost.png"
          alt="MEV-Boost"
          className="hero-landing__logo"
        />
        <p className="hero-landing__tagline">
          Open-source middleware for Ethereum validators to access a competitive
          block-building market via{' '}
          <strong>proposer-builder separation</strong>.
        </p>
        <div className="hero-landing__actions">
          <a
            className="button button--primary button--lg"
            href="/installation"
          >
            Get Started
          </a>
          <a
            className="button button--outline button--primary button--lg"
            href="https://github.com/flashbots/mev-boost"
          >
            GitHub
          </a>
        </div>
        <span className="hero-landing__version">
          Latest: v1.12
        </span>
      </div>
      <div className="features-section">
        <div className="features-grid">
          {features.map(({ icon, title, description }) => (
            <div className="feature-card" key={title}>
              <div className="feature-card__icon">{icon}</div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
