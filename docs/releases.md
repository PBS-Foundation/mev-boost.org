---
sidebar_position: 8
title: Releases
---

# Releases

All releases with binaries and full changelogs are available at [github.com/flashbots/mev-boost/releases](https://github.com/flashbots/mev-boost/releases).

## v1.12-alpha1

### Features

- **Relay multiplexing**: allows different validators to use different relay sets for `getHeader` requests ([#826](https://github.com/flashbots/mev-boost/pull/826))

## v1.11

### Features

- **Timing games for bid optimization**: allows configuring timing games for `getHeader` calls to optimize bid selection ([#839](https://github.com/flashbots/mev-boost/pull/839))

### Enhancements

- Add `--log-color` flag for colored text output in logs ([#871](https://github.com/flashbots/mev-boost/pull/871))
- Update latency metrics from microseconds to milliseconds ([#877](https://github.com/flashbots/mev-boost/pull/877))

### Bug Fixes

- Metrics: use Prometheus-standard `le` (less than or equal) labels ([#876](https://github.com/flashbots/mev-boost/pull/876))

## v1.10

:::warning
This was a required update for the Fusaka upgrade (epoch [411392](https://github.com/ethereum/consensus-specs/pull/4689), Dec 3, 2025).
:::

**Docker Image**: [`flashbots/mev-boost:1.10`](https://hub.docker.com/layers/flashbots/mev-boost/1.10/images/sha256-2367b08cc5e9bc4d46c944d909326d985d6222228bfa4c1207afaeb2e1fdafe2)

### Features

- Support for the **Fusaka** release
- Support for the new [GetPayloadV2 API](https://github.com/ethereum/builder-specs/pull/123)
- Support for **Prometheus Metrics**
- Support for an [X-Timeout-Ms](https://github.com/ethereum/builder-specs/pull/131) header in `getHeader` requests

### Enhancements

- Update all dependencies to their latest versions
- Fix a bug with parsing custom genesis time
- Fallback to `getPayloadV1` API if the `getPayloadV2` API fails
- Add JSON Content-Type for relay `getPayload` if the relay doesn't support SSZ
- Change no-bid-found log level to debug

## v1.9

### Features

- Add support for the **Pectra** upgrade
- Add support for **SSZ encoded messages**
- Add support for **RISC-V** platforms

### Enhancements

- Build with Go 1.24
- Update all dependencies to their latest versions
- Split core functionality into more files for improved organization
- Add `HeaderDateMilliseconds` for improved request timing tracking
- Re-add support for past upgrades (Bellatrix and Capella)
- Remove support for relay monitors
