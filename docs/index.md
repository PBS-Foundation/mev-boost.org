---
slug: /
sidebar_position: 1
title: MEV-Boost in a Nutshell
hide_title: true
---

<div className="hero-landing">
  <img src="/img/mev-boost.png" alt="MEV-Boost" className="hero-landing__logo" />
  <p className="hero-landing__tagline">
    Open-source middleware for Ethereum validators to access a competitive block-building market via <strong>proposer-builder separation</strong>.
  </p>
  <div className="hero-landing__actions">
    <a className="button button--primary button--lg" href="/installation">Get Started</a>
    <a className="button button--outline button--primary button--lg" href="https://github.com/flashbots/mev-boost">GitHub</a>
  </div>
  <span className="hero-landing__version">Latest: v1.10 (Fusaka)</span>
</div>

<div className="features-section">
<div className="features-grid">

<div className="feature-card">
  <div className="feature-card__icon">&#x1F50C;</div>
  <h3>Plug & Play</h3>
  <p>Compatible with all Ethereum consensus clients. Install, configure your relays, and start earning maximum rewards.</p>
</div>

<div className="feature-card">
  <div className="feature-card__icon">&#x1F3D7;&#xFE0F;</div>
  <h3>Builder Market</h3>
  <p>Access blocks from a competitive marketplace of builders who optimize for MEV extraction and fair reward distribution.</p>
</div>

<div className="feature-card">
  <div className="feature-card__icon">&#x1F512;</div>
  <h3>Open & Neutral</h3>
  <p>Free, open-source, and audited software. Run by thousands of validators to promote decentralization and censorship resistance.</p>
</div>

</div>
</div>

---

## Quickstart

1. [**Install** the latest version of MEV-Boost](./installation)

2. **Connect** MEV-Boost to desired relays:

```bash
./mev-boost -mainnet -relay-check -relays relay1,relay2
```

:::tip
Use the appropriate network flag: `-mainnet`, `-sepolia`, `-holesky`, or `-hoodi`.
:::

3. **Configure** your consensus client. See the [consensus client compatibility](./relays#consensus-client-compatibility) table for guides.

4. **Verify** your setup by calling the [Relay Data API](https://flashbots.github.io/relay-specs/) to check your validator registration.

## Explore the Docs

- **[How It Works](./how-it-works)** — PBS architecture and MEV-Boost design.
- **[Installation](./installation)** — Binaries, source, Docker, systemd.
- **[Usage](./usage)** — CLI arguments, network flags, relay config, metrics.
- **[Timing Games](./timing-games)** — Advanced bid optimization via strategic request timing.
- **[Security Audit](./security-audit)** — Audit findings and trust assumptions.
- **[Relays & Clients](./relays)** — Relay lists and consensus client compatibility.
- **[Builder Quickstart](./builders)** — Guide for external block builders.
- **[FAQ](./faq)** — Frequently asked questions.
- **[Troubleshooting](./troubleshooting)** — Common issues and fixes.
- **[Releases](./releases)** — Release history and changelogs.
- **[Resources](./resources)** — Community links, dashboards, and references.
