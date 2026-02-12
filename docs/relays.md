---
sidebar_position: 5
title: Relays & Consensus Clients
---

# Relays & Consensus Clients

## Relay List

For a comprehensive list of relay URL endpoints by network and operator maintained by the community, please refer to:

- [Ethstaker Relay List](https://github.com/remyroy/ethstaker/blob/main/MEV-relay-list.md) ([alternative](https://ethstaker.cc/mev-relay-list/))
- [Lido Relay Providers](https://research.lido.fi/t/lido-on-ethereum-call-for-relay-providers/2844)

Lists of available relays are also maintained by relay operators themselves. Validators should take precautions to **only connect to trusted relays**. Read more about [the role of relays](https://docs.flashbots.net/flashbots-mev-boost/relay).

### Flashbots Relay

The Flashbots relay is available on Mainnet and testnets:

| Network  | Relay URL |
|----------|-----------|
| Mainnet  | `https://boost-relay.flashbots.net` |

For the most up-to-date relay URLs, check the [Flashbots documentation](https://docs.flashbots.net/).

## Consensus Client Compatibility

MEV-Boost is designed to be compatible with the standard [Ethereum Builder API](https://github.com/ethereum/builder-specs). This means it is compatible with **all consensus and execution clients**.

Below are links to guides for configuring MEV-Boost with each major consensus client:

| Consensus Client | Guide |
|------------------|-------|
| **Lighthouse**   | [Lighthouse MEV-Boost docs](https://lighthouse-book.sigmaprime.io/builders.html) |
| **Lodestar**     | [Lodestar MEV-Boost docs](https://chainsafe.github.io/lodestar/run/mev-and-builder-integration/) |
| **Nimbus**       | [Nimbus MEV-Boost docs](https://nimbus.guide/external-block-builder.html) |
| **Prysm**        | [Prysm MEV-Boost docs](https://docs.prylabs.network/docs/advanced/builder) |
| **Teku**         | [Teku MEV-Boost docs](https://docs.teku.consensys.io/how-to/configure/builder-network) |

For detailed testing instructions, see the [MEV-Boost testing wiki](https://github.com/flashbots/mev-boost/wiki/Testing).
