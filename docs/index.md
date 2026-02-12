---
slug: /
sidebar_position: 1
title: MEV-Boost in a Nutshell
---

# MEV-Boost in a Nutshell

MEV-Boost is an implementation of [proposer-builder separation (PBS)](https://ethresear.ch/t/proposer-block-builder-separation-friendly-fee-market-designs/9725) built by [Flashbots](https://www.flashbots.net/) for proof of stake Ethereum. Validators running MEV-Boost maximize their staking reward by selling blockspace to an open market of builders.

MEV-Boost is free, open-source, neutral software built with love, for the community. For information on MEV-Boost software and roadmap, see the [MEV-Boost Repository](https://github.com/flashbots/mev-boost/).

## Quickstart

1. [Install the latest version of MEV-Boost](./installation)

2. Connect MEV-Boost to desired MEV-Boost relays:

```bash
./mev-boost -mainnet -relay-check -relays relay1,relay2
```

:::tip
Remember to use the appropriate network flag for the specific network and relay URL, e.g. `-mainnet`, `-sepolia`, `-holesky` or `-hoodi`.
:::

3. Configure a consensus client. Detailed instructions are available on the [MEV-Boost testing wiki](https://github.com/flashbots/mev-boost/wiki/Testing), and guides for connecting the client to MEV-Boost can be found in the [consensus client compatibility](./relays#consensus-client-compatibility) section.

4. Confirm that the setup works by calling the [Relay Data API](https://flashbots.github.io/relay-specs/) to see your validator registration.

## What's Next?

- **[How It Works](./how-it-works)** — Learn about PBS architecture and how MEV-Boost fits in.
- **[Installation](./installation)** — Detailed install guide (binaries, source, Docker, systemd).
- **[Usage](./usage)** — CLI arguments, network flags, relay configuration, metrics.
- **[Relays & Consensus Clients](./relays)** — Relay lists and client compatibility guides.
- **[Builder Quickstart](./builders)** — Guide for external block builders.
- **[FAQ](./faq)** — Frequently asked questions.
- **[Releases](./releases)** — Release history and changelogs.
- **[Resources](./resources)** — Community links, dashboards, and references.
