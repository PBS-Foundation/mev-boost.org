---
sidebar_position: 16
title: Security & Bug Bounty
keywords: [security, bug bounty, vulnerability, audit, responsible disclosure]
---

# Security & Bug Bounty

## Bug Bounty Program

Flashbots maintains an active bug bounty program for MEV-Boost. If you discover a security vulnerability, you can earn rewards based on severity.

### Rewards

| Severity | Reward |
|----------|--------|
| Critical | Up to **$25,000 USD** |
| High | Up to **$10,000 USD** |
| Medium | Up to **$5,000 USD** |
| Low | Up to **$1,000 USD** |

### Scope

The bug bounty covers:

- [mev-boost](https://github.com/flashbots/mev-boost) — The MEV-Boost middleware itself.
- [go-boost-utils](https://github.com/flashbots/go-boost-utils) — Shared utility library used by MEV-Boost.

### How to Report

1. **Do not** open a public GitHub issue for security vulnerabilities.
2. Email **security@flashbots.net** with:
   - A description of the vulnerability
   - Steps to reproduce
   - Potential impact assessment
   - Any suggested fixes (optional)
3. You will receive an acknowledgment within 48 hours.
4. Flashbots will work with you to understand, validate, and fix the issue.

See the full [SECURITY.md](https://github.com/flashbots/mev-boost/blob/develop/SECURITY.md) for complete details and terms.

## Security Audit

**Auditor**: [lotusbumi](https://github.com/lotusbumi)
**Date**: 2022-06-20

A security assessment of MEV-Boost was conducted for the Flashbots Collective. The full report is available on [GitHub](https://github.com/flashbots/mev-boost/blob/develop/docs/audit-20220620.md).

### System Overview

[MEV-Boost](https://github.com/flashbots/mev-boost) allows out-of-protocol proposer/builder separation on PoS Ethereum. The system consists of several actors:

- **Builders** — Receive bundles from searchers and construct blocks. They send block headers with bid values to relays. If their bid is selected, they unblind the block contents.
- **Relays** — Store registered validators and receive builder bids to make them available to validators.
- **Validator Clients** — Register with relays through MEV-Boost, request block headers for their proposing slots, and sign the selected header so the builder can reveal the full block.
- **MEV-Boost** — Middleware that receives HTTP requests from the validator client and forwards them to relays, selecting the block header with the highest bid.

### Trust Assumptions

The current system depends on trust between actors:

**Validators/MEV-Boost assume**:
- Relays will not send blocks that could cause slashing
- Relays will not send blocks exceeding the gas limit from validator registration
- Relays will not use a false bid value

**Relays assume**:
- Validators will periodically send registration information
- Builders will be online to share block contents if the auction is won
- Builders will not use a false bid value

**Builders assume**:
- Relays will not share their blocks with other relays/builders
- Relays will verify that validators commit to a specific `blockhash`

### Findings Summary

| Severity | Count | Status |
|----------|-------|--------|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 1 | Fixed |
| Low | 4 | All Fixed |

### Medium: Signing library skips membership check

The `VerifySignature` function in `go-boost-utils` called the upstream `blst` library with `sigGroupCheck` set to `false`, skipping a required subgroup check per the [IETF BLS Signature specification](https://tools.ietf.org/html/draft-irtf-cfrg-bls-signature). This could potentially enable signature forgeries.

**Status**: Fixed in [PR#21](https://github.com/flashbots/go-boost-utils/pull/21).

### Low: Server-Side Request Forgery via unchecked redirects

A malicious relay could exploit HTTP redirects to trigger requests to internal services accessible from the MEV-Boost host.

**Status**: Fixed in [PR#205](https://github.com/flashbots/mev-boost/pull/205).

### Low: Denial of service via server timeouts

Default `http.Server` timeout configuration and `MaxHeaderBytes` values allowed resource exhaustion through large header requests.

**Status**: Fixed in [PR#210](https://github.com/flashbots/mev-boost/pull/210).

### Low: Client timeout can be set to insecure values

Setting the client timeout to `0` disables it entirely, allowing a malicious relay to stall communication indefinitely — critical during block proposal when the proposer boost window is ~4 seconds.

**Status**: Fixed in [PR#210](https://github.com/flashbots/mev-boost/pull/210).

### Low: JSON Decoder allows extra information in memory

Request payloads were processed without `DisallowUnknownFields`, allowing extra data to be loaded into memory.

**Status**: Fixed in [PR#211](https://github.com/flashbots/mev-boost/pull/211).
