---
sidebar_position: 7
title: FAQ
---

# Frequently Asked Questions

## Node Operators

### What is MEV-Boost?

`mev-boost` is open source middleware run by Ethereum validators to access a competitive block-building market. It is an implementation of [proposer-builder separation (PBS)](https://ethresear.ch/t/proposer-block-builder-separation-friendly-fee-market-designs/9725) for proof-of-stake Ethereum.

### Why should I run MEV-Boost?

Running MEV-Boost allows validators to maximize their staking rewards by outsourcing block construction to specialized builders. Builders compete to produce the most valuable blocks, and the resulting fees are passed to the proposing validator.

### Is MEV-Boost safe to run?

MEV-Boost has been [audited](https://github.com/flashbots/mev-boost/blob/develop/docs/audit-20220620.md) and is open source. However, as with any software, validators should:

- Only connect to **trusted relays**
- Keep MEV-Boost **up to date** with the latest releases
- Monitor their setup and verify it is working correctly

### What happens if MEV-Boost goes down?

If MEV-Boost is unavailable, the beacon node will fall back to **local block production** using the execution client. Your validator will still propose blocks — they just won't include MEV rewards from the builder market.

### Can I run multiple relays?

Yes. It is recommended to connect to multiple relays for redundancy and to maximize the chance of receiving the best bid. You can specify multiple relays using the `-relay` flag or a comma-separated list with `-relays`.

### What is the `-min-bid` flag?

The `-min-bid` flag sets a minimum bid threshold. If no builder bid meets this threshold, MEV-Boost will not return a bid and the beacon node will fall back to local block production. This helps ensure you only use builder blocks when they provide meaningful additional value.

### How do I verify my setup is working?

Query the [Relay Data API](https://flashbots.github.io/relay-specs/) to check your validator registration:

```
https://boost-relay.flashbots.net/relay/v1/data/validator_registration?pubkey=YOUR_VALIDATOR_PUBKEY
```

The `fee_recipient` field should match the address you configured.

## Block Builders

### How do I submit blocks as a builder?

See the [Builder Quickstart](./builders) guide for details on submitting blocks to Flashbots relays.

### What networks can I build for?

Builders can submit blocks to relays on **Mainnet**, **Sepolia**, **Holesky**, and **Hoodi** networks.

---

This world is confusing, but we are in this together ⚡

If you have additional questions, please ask on the [Forum](https://collective.flashbots.net/), [GitHub](https://github.com/flashbots/mev-boost/issues), or [Discord](https://discord.com/invite/3TjWjBerRb)!
