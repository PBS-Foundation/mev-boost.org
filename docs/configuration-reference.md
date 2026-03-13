---
sidebar_position: 13
title: Configuration Reference
keywords: [config, configuration, flags, cli, environment variables, yaml, reference]
---

# Configuration Reference

Complete reference for all MEV-Boost configuration options: CLI flags, environment variables, and YAML config file.

## CLI Flags

| Flag | Default | Description |
|------|---------|-------------|
| `-addr` | `localhost:18550` | Listen address for the MEV-Boost HTTP server. |
| `-mainnet` | `true` | Use Ethereum Mainnet. |
| `-sepolia` | `false` | Use Sepolia testnet. |
| `-hoodi` | `false` | Use Hoodi testnet. |
| `-genesis-fork-version` | — | Use a custom genesis fork version (overrides network flags). |
| `-relay` | — | A single relay URL. Can be specified multiple times. Format: `scheme://pubkey@host`. |
| `-relays` | — | Comma-separated list of relay URLs. Format: `scheme://pubkey@host`. |
| `-relay-check` | `false` | Check relay connectivity on startup and on status API calls. |
| `-min-bid` | `0` | Minimum bid value to accept from a relay (in ETH). Bids below this cause fallback to local block building. |
| `-config` | — | Path to YAML configuration file for timing games and relay muxing. |
| `-watch-config` | `false` | Enable hot reloading of the YAML config file (requires `-config`). |
| `-metrics` | `false` | Enable Prometheus metrics server. |
| `-metrics-addr` | `localhost:18551` | Listen address for the Prometheus metrics server. |
| `-loglevel` | `info` | Minimum log level: `trace`, `debug`, `info`, `warn`/`warning`, `error`, `fatal`, `panic`. |
| `-debug` | `false` | Shorthand for `-loglevel debug`. |
| `-json` | `false` | Output logs in JSON format instead of text. |
| `-color` | `false` | Enable colored output for text log format. |
| `-log-no-version` | `false` | Disable adding the version to every log entry. |
| `-log-service` | — | Add a `service=...` tag to all log messages. |
| `-request-timeout-getheader` | `950` | Timeout for `getHeader` requests to relays (milliseconds). |
| `-request-timeout-getpayload` | `4000` | Timeout for `getPayload` requests to relays (milliseconds). |
| `-request-timeout-regval` | `3000` | Timeout for `registerValidator` requests to relays (milliseconds). |
| `-version` | — | Print version and exit. |

## Environment Variables

MEV-Boost can also be configured via environment variables. These are useful for Docker deployments and systemd service files.

| Variable | Equivalent Flag | Default | Description |
|----------|----------------|---------|-------------|
| `BOOST_LISTEN_ADDR` | `-addr` | `localhost:18550` | Listen address for the HTTP server. |
| `MAINNET` | `-mainnet` | `true` | Use Ethereum Mainnet. |
| `SEPOLIA` | `-sepolia` | `false` | Use Sepolia testnet. |
| `RELAYS` | `-relays` | — | Comma-separated relay URLs. |
| `MIN_BID_ETH` | `-min-bid` | `0` | Minimum bid value (ETH). |
| `LOG_JSON` | `-json` | `false` | Enable JSON log format. |
| `LOG_LEVEL` | `-loglevel` | `info` | Minimum log level. |
| `RELAY_TIMEOUT_MS_GETHEADER` | `-request-timeout-getheader` | `950` | `getHeader` request timeout (ms). |
| `RELAY_TIMEOUT_MS_GETPAYLOAD` | `-request-timeout-getpayload` | `4000` | `getPayload` request timeout (ms). |
| `RELAY_TIMEOUT_MS_REGVAL` | `-request-timeout-regval` | `3000` | `registerValidator` request timeout (ms). |
| `REQUEST_MAX_RETRIES` | — | `5` | Maximum number of retries for failed relay requests. |

### Docker Example

```bash
docker run -e RELAYS="https://0xPUBKEY@relay.example.com" \
    -e MIN_BID_ETH=0.05 \
    -e RELAY_TIMEOUT_MS_GETHEADER=900 \
    -p 18550:18550 \
    flashbots/mev-boost
```

## YAML Configuration File

The YAML config file enables advanced features like [timing games](./timing-games) and [relay multiplexing](./relay-muxing). Pass it with the `-config` flag:

```bash
./mev-boost -config config.yaml
```

### Full Example

```yaml
# Global timeouts
timeout_get_header_ms: 950
late_in_slot_time_ms: 2000

# Default relays (used for validators not in any mux group)
relays:
  - url: https://0xPUBKEY@relay-a.example.com
    enable_timing_games: true
    target_first_request_ms: 200
    frequency_get_header_ms: 100

  - url: https://0xPUBKEY@relay-b.example.com
    enable_timing_games: false

# Relay multiplexing (optional)
mux:
  - id: "group-a"
    validator_pubkeys:
      - "0x8a1d7b..."
    timeout_get_header_ms: 900
    late_in_slot_time_ms: 1500
    relays:
      - url: https://0xPUBKEY@group-a-relay.example.com
        enable_timing_games: true
        target_first_request_ms: 200
        frequency_get_header_ms: 100

  - id: "group-b"
    validator_pubkeys:
      - "0x8d1d7b..."
    relays:
      - url: https://0xPUBKEY@group-b-relay.example.com
```

### YAML Fields Reference

#### Global Fields

| Field | Default | Description |
|-------|---------|-------------|
| `timeout_get_header_ms` | `950` | Maximum timeout for `getHeader` requests (ms). |
| `late_in_slot_time_ms` | `2000` | Safety threshold — skip relay requests if this many ms into the slot. |

#### Relay Fields

| Field | Required | Description |
|-------|----------|-------------|
| `url` | Yes | Relay URL in `scheme://pubkey@host` format. |
| `enable_timing_games` | No | Enable timing games for this relay (default: `false`). |
| `target_first_request_ms` | No | Target time into slot for first `getHeader` request (requires timing games). |
| `frequency_get_header_ms` | No | Interval between subsequent `getHeader` requests (requires timing games). |

#### Mux Group Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique identifier for the mux group (appears in logs). |
| `validator_pubkeys` | Yes | List of validator public keys assigned to this group. |
| `relays` | Yes | List of relay configurations for this group. |
| `timeout_get_header_ms` | No | Override global `getHeader` timeout for this group. |
| `late_in_slot_time_ms` | No | Override global late-in-slot threshold for this group. |

## Configuration Precedence

When the same setting can be configured in multiple ways, the order of precedence is:

1. **CLI flags** (highest priority)
2. **Environment variables**
3. **YAML config file**
4. **Default values** (lowest priority)

For relay-specific settings within the YAML config:

1. **Mux group overrides** (if validator is in a mux group)
2. **Global YAML settings**
3. **CLI flag defaults**

## Relay URL Format

Relay URLs follow the format:

```
scheme://pubkey@host
```

- **scheme** — `http` or `https` (always use `https` in production).
- **pubkey** — The relay's public key, used to verify relay identity.
- **host** — The relay's hostname and optional port.

Example:

```
https://0xa1dead01d3ce52e8b1fae965c2a9a14db10e190dd60a8f6e0d1f4a0f29f1d8e5f3b6c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9@relay.example.com
```
