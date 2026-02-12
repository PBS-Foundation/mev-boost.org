---
sidebar_position: 4
title: Usage
---

# Usage

A single MEV-Boost instance can be used by multiple beacon nodes and validators.

Aside from running MEV-Boost on your local network, you must configure:

- **Individual beacon nodes** to connect to MEV-Boost. Beacon node configuration varies by consensus client. Guides for each client can be found in the [Relays & Consensus Clients](./relays) section.
- **Individual validators** to configure a preferred relay selection. Validators should take precautions to only connect to trusted relays. Read more about [the role of relays](https://docs.flashbots.net/flashbots-mev-boost/relay).

:::note
The documentation here reflects the latest state of the `main` branch, which may have CLI flags or functionality not present in the latest release. Please refer to the [specific release documentation](https://github.com/flashbots/mev-boost/releases) for available command line flags.
:::

## Network Flags

### Mainnet

Run MEV-Boost pointed at a mainnet relay:

```bash
./mev-boost -relay-check -relay URL-OF-TRUSTED-RELAY
```

### Sepolia Testnet

```bash
./mev-boost -sepolia -relay-check -relay URL-OF-TRUSTED-RELAY
```

### Holesky Testnet

```bash
./mev-boost -holesky -relay-check -relay URL-OF-TRUSTED-RELAY
```

### Hoodi Testnet

```bash
./mev-boost -hoodi -relay-check -relay URL-OF-TRUSTED-RELAY
```

## CLI Arguments

```
$ ./mev-boost -help
Usage of mev-boost:
  -addr string
        listen-address for mev-boost server (default "localhost:18550")
  -debug
        shorthand for '-loglevel debug'
  -genesis-fork-version string
        use a custom genesis fork version
  -holesky
        use Holesky
  -hoodi
        use Hoodi
  -json
        log in JSON format instead of text
  -color
        enable colored output for text log format
  -log-no-version
        disables adding the version to every log entry
  -log-service string
        add a 'service=...' tag to all log messages
  -loglevel string
        minimum loglevel: trace, debug, info, warn/warning, error, fatal, panic (default "info")
  -mainnet
        use Mainnet (default true)
  -min-bid float
        minimum bid to accept from a relay [eth]
  -relay value
        a single relay, can be specified multiple times
  -relay-check
        check relay status on startup and on the status API call
  -relays string
        relay urls - single entry or comma-separated list (scheme://pubkey@host)
  -config string
        path to YAML configuration file for enabling advanced features
  -watch-config
        enable hot reloading of config file (requires -config)
  -request-timeout-getheader int
        timeout for getHeader requests to the relay [ms] (default 950)
  -request-timeout-getpayload int
        timeout for getPayload requests to the relay [ms] (default 4000)
  -request-timeout-regval int
        timeout for registerValidator requests [ms] (default 3000)
  -sepolia
        use Sepolia
  -version
        only print version
  -metrics
        enables a metrics server (default: false)
  -metrics-addr string
        listening address for the metrics server (default: "localhost:18551")
```

## Specifying Relays: `-relays` vs `-relay`

There are two different flags for specifying relays:

- **`-relays`** — a comma-separated string of relay URLs
- **`-relay`** — specifies a single relay, but can be used multiple times

These two commands are equivalent:

```bash
./mev-boost -relay-check \
    -relays $YOUR_RELAY_CHOICE_A,$YOUR_RELAY_CHOICE_B,$YOUR_RELAY_CHOICE_C
```

```bash
./mev-boost -relay-check \
    -relay $YOUR_RELAY_CHOICE_A \
    -relay $YOUR_RELAY_CHOICE_B \
    -relay $YOUR_RELAY_CHOICE_C
```

## Setting a Minimum Bid with `-min-bid`

The `-min-bid` flag allows setting a minimum bid value. If no bid from the builder network delivers at least this value, MEV-Boost will not return a bid to the beacon node, making it fall back to local block production.

Example for setting a minimum bid value of 0.06 ETH:

```bash
./mev-boost \
    -min-bid 0.06 \
    -relay $YOUR_RELAY_CHOICE_A \
    -relay $YOUR_RELAY_CHOICE_B \
    -relay $YOUR_RELAY_CHOICE_C
```

## Enabling Metrics

The `-metrics` flag exposes a Prometheus metrics server. The address/port can be changed with `-metrics-addr`:

```bash
./mev-boost \
    -metrics \
    -metrics-addr localhost:9009 \
    -relay $YOUR_RELAY_CHOICE_A
```

## Timing Games (Advanced)

The Timing Games feature allows MEV-Boost to optimize block proposal by strategically timing `getHeader` requests to relays. Instead of sending a single request immediately, it can delay the initial request and send multiple follow-up requests to capture the latest, most valuable bids before the proposal deadline.

:::warning
This feature is strictly meant for advanced users. Extra care should be taken when setting up timing game parameters.
:::

For detailed configuration options, parameters, and visual diagrams, see [docs/timing-games.md](https://github.com/flashbots/mev-boost/blob/develop/docs/timing-games.md).

## test-cli

`test-cli` is a utility to execute all proposer requests against MEV-Boost + relay. See the [test-cli README](https://github.com/flashbots/mev-boost/blob/develop/cmd/test-cli/README.md).

## Verifying Your Setup

You can check if your setup works by looking up the validator registration of your proposer using the [Relay Data API](https://flashbots.github.io/relay-specs/).

For example, if your validator's public key is `0xb606e206...a5999`, you can check registration by querying:

```
https://boost-relay.flashbots.net/relay/v1/data/validator_registration?pubkey=YOUR_VALIDATOR_PUBKEY
```

The `fee_recipient` field in the response should match the address you provided when registering your validator.
