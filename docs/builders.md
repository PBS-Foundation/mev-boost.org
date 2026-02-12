---
sidebar_position: 6
title: Builder Quickstart
---

# Builder Quickstart

External builders can submit blocks to the Flashbots Relays on Mainnet, Goerli and Sepolia networks.

## Getting Started

1. **Read the documentation** — Familiarize yourself with the [Flashbots Block Builders Official Documentation](https://docs.flashbots.net/flashbots-mev-boost/block-builders).

2. **Understand the API** — Review the [Relay API documentation - Block Builder API](https://flashbots.github.io/relay-specs/).

3. **Join the community** — Participate in the [Block Builder Self-Help Group forum](https://collective.flashbots.net/c/builders/14) for support and discussion.

4. **Reference implementation** — Check out [boost-geth-builder](https://github.com/flashbots/boost-geth-builder), an example builder implementation built by Flashbots.

## How Block Building Works

1. **Builders** construct full blocks by ordering transactions to maximize MEV extraction and validator rewards.
2. **Builders submit blocks** to one or more relays via the Builder API.
3. **Relays validate** the blocks and make them available to proposers via MEV-Boost.
4. **Proposers** (validators running MEV-Boost) select the most profitable block header.
5. The **relay reveals** the full block contents once the proposer signs the header.

## Builder API

Builders interact with relays using the [Builder API specification](https://ethereum.github.io/builder-specs). Key endpoints include:

- `POST /relay/v1/builder/blocks` — Submit a new block
- `GET /relay/v1/builder/validators` — Get the list of registered validators

## Resources

- [Flashbots Builder Docs](https://docs.flashbots.net/flashbots-mev-boost/block-builders)
- [Builder API Specs](https://ethereum.github.io/builder-specs)
- [Block Builder Self-Help Group](https://collective.flashbots.net/c/builders/14)
- [boost-geth-builder (reference implementation)](https://github.com/flashbots/boost-geth-builder)
