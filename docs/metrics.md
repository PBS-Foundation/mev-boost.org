---
sidebar_position: 7
title: Metrics & Monitoring
keywords: [metrics, prometheus, grafana, monitoring, observability, alerts]
---

# Metrics & Monitoring

MEV-Boost can expose a [Prometheus](https://prometheus.io/)-compatible `/metrics` endpoint from the same process. It is a second HTTP listener, off unless you pass `-metrics`. It is not a separate service, and nothing is exported until the flag is set.

:::info
Prometheus metrics were added in **MEV-Boost v1.10**. v1.11 reports latency in milliseconds and uses Prometheus histogram buckets (`le`), via [#877](https://github.com/flashbots/mev-boost/pull/877) and [#876](https://github.com/flashbots/mev-boost/pull/876).
:::

The series below are the ones registered in [`server/metrics.go`](https://github.com/flashbots/mev-boost/blob/develop/server/metrics.go). Names are created on first use, so a quiet process may not list them yet. Scrape `/metrics` for the labels your version actually emits. The endpoint also includes the Go and process metrics written by the metrics library.

## Enabling metrics

```bash
./mev-boost -metrics -relay $YOUR_RELAY
```

The listener defaults to `localhost:18551`. To change it:

```bash
./mev-boost -metrics -metrics-addr 0.0.0.0:9009 -relay $YOUR_RELAY
```

Keep this port on localhost or a private network. It has no authentication.

### Systemd example

```ini
[Service]
ExecStart=/home/mev-boost/bin/mev-boost \
    -mainnet \
    -relay-check \
    -metrics \
    -metrics-addr 127.0.0.1:18551 \
    -relay https://0xPUBKEY@relay.example.com
```

## Verifying metrics

```bash
curl http://localhost:18551/metrics
```

Series use the prefix `mev_boost_`. A fresh process shows the winning-bid histogram and the runtime metrics; relay and bid series appear after the first request.

## Available metrics

### Requests MEV-Boost answered

| Metric | Type | Labels | Description |
|--------|------|--------|-------------|
| `mev_boost_beacon_node_status_code_total` | Counter | `http_status_code`, `endpoint` | Responses MEV-Boost returned to the beacon node. `endpoint` is the builder-API route, such as `/eth/v1/builder/validators` or the `getHeader` route template. |

This is the counter to use for "did we return a bid?". A `204` on the header or execution-payload-bid endpoint is a slot with no bid returned. A `200` is a bid. A `202` on the signed-block endpoint means a relay accepted the block.

### Relay calls

| Metric | Type | Labels | Description |
|--------|------|--------|-------------|
| `mev_boost_relay_latency` | Histogram | `endpoint`, `relay` | Time spent in the relay HTTP call, in **milliseconds**. `relay` is the hostname only. |
| `mev_boost_relay_status_code_total` | Counter | `http_status_code`, `endpoint`, `relay` | HTTP status the relay returned. Connection failures and timeouts are not counted here; they show up as a missing relay response and, on the beacon-node counter, as `204` or `500`. |
| `mev_boost_relay_last_slot` | Gauge | `relay` | Slot of the last bid recorded from that relay. |
| `mev_boost_millisec_into_slot` | Histogram | `endpoint` | How many milliseconds into the slot a `getHeader` request arrived. |

### Bids

| Metric | Type | Labels | Description |
|--------|------|--------|-------------|
| `mev_boost_bid_values` | Histogram | `relay` | Bid value in **ETH**. On the current `getHeader` path the value is the bid's `value` converted from wei. On the [ePBS](./epbs) path it is `value` plus `execution_payment`, converted from gwei. |
| `mev_boost_winning_bid_value` | Histogram | — | Value of the bid MEV-Boost returned from `getHeader`. This is `bidInfo.value.Float64()` with **no wei-to-ETH conversion**, so it is not in the same unit as `mev_boost_bid_values`. The ePBS path does not update this series. |
| `mev_boost_bids_below_min_bid_total` | Counter | `relay` | `getHeader` bids ignored because they were below `-min-bid`. ePBS bids are not filtered by `-min-bid`. |

:::note
On the `getHeader` path, `mev_boost_bid_values` is updated when a relay response is decoded and again when that bid passes validation. Use the histogram for the value distribution, and use `mev_boost_beacon_node_status_code_total` to count requests.
:::

There is no `mevboost_get_header_latency_ms`, `mevboost_best_bid_value`, `mevboost_bids_received_total`, `mevboost_no_bid_total`, or `mevboost_relay_errors_total` series. Latency, bid value, and errors are the `mev_boost_*` series in the tables above.

### ePBS endpoints

The Gloas handlers use the same series. `endpoint` is the route template:

- `/eth/v1/builder/execution_payload_bid/{slot}/{parent_hash}/{parent_root}/{proposer_pubkey}`
- `/eth/v1/builder/builder_preferences/{proposer_pubkey}`
- `/eth/v1/builder/beacon_blocks`

Copy the label from the scrape output before writing a matcher. The route templates contain `{`, which is easy to get wrong in PromQL.

| Question | Series |
|----------|--------|
| What did MEV-Boost answer the beacon node? | `mev_boost_beacon_node_status_code_total`: `200` or `204` for a bid, the relay's status or `500` for preferences, `202` or `500` for the signed block, `400` or `401` for a rejected request |
| What did the relay answer? | `mev_boost_relay_status_code_total` by `relay` (hostname) |
| How long did the relay take? | `mev_boost_relay_latency` |
| What was the bid worth? | `mev_boost_bid_values` (ETH, including the execution payment) and `mev_boost_relay_last_slot` |

## Prometheus configuration

```yaml
scrape_configs:
  - job_name: 'mev-boost'
    static_configs:
      - targets: ['localhost:18551']
    scrape_interval: 15s
```

Alongside consensus and execution clients:

```yaml
scrape_configs:
  - job_name: 'beacon-node'
    static_configs:
      - targets: ['localhost:5054']

  - job_name: 'execution-client'
    static_configs:
      - targets: ['localhost:6060']

  - job_name: 'mev-boost'
    static_configs:
      - targets: ['localhost:18551']
```

## Grafana

Useful panels:

- **Responses to the beacon node** — `mev_boost_beacon_node_status_code_total` by `http_status_code` and `endpoint`. A rising `204` rate on the header endpoint is slots with no bid returned.
- **Relay latency** — `mev_boost_relay_latency` buckets, split by `relay`, to find a slow relay.
- **Relay status codes** — `mev_boost_relay_status_code_total` by `relay` and `http_status_code`.
- **Bid values** — `mev_boost_bid_values` (ETH) by `relay`.
- **Bids under `-min-bid`** — `mev_boost_bids_below_min_bid_total`.
- **Last slot per relay** — `mev_boost_relay_last_slot`, to see which relays have gone quiet.

### Example PromQL

**Average relay latency, in milliseconds, over the last hour.** Restrict `endpoint` to the route you care about; the example matches `getHeader`:

```promql
sum by (relay) (
  rate(mev_boost_relay_latency_sum{endpoint=~"/eth/v1/builder/header.*"}[1h])
)
/
sum by (relay) (
  rate(mev_boost_relay_latency_count{endpoint=~"/eth/v1/builder/header.*"}[1h])
)
```

**Relay status codes over the last 5 minutes:**

```promql
sum by (relay, http_status_code) (rate(mev_boost_relay_status_code_total[5m]))
```

**Share of `getHeader` responses that were `204` (no bid) over the last hour:**

```promql
sum(rate(mev_boost_beacon_node_status_code_total{http_status_code="204", endpoint=~"/eth/v1/builder/header.*"}[1h]))
/
sum(rate(mev_boost_beacon_node_status_code_total{endpoint=~"/eth/v1/builder/header.*"}[1h]))
```

**ePBS bids returned to the beacon node:**

```promql
sum by (http_status_code) (
  rate(mev_boost_beacon_node_status_code_total{endpoint=~"/eth/v1/builder/execution_payload_bid.*"}[15m])
)
```

## Alerting

| Condition | Suggested threshold | Why |
|-----------|---------------------|-----|
| MEV-Boost down | Metrics endpoint unreachable for >1 min | The beacon node falls back to local block building. |
| Relay errors | A relay's non-2xx `mev_boost_relay_status_code_total` share stays above half of its requests for 5 min | That relay is degraded. Consider removing it. |
| No bids returned | `http_status_code="204"` on the header or execution-payload-bid endpoint for >10 consecutive slots | Check relay connectivity and validator registration. |
| High relay latency | p99 of `mev_boost_relay_latency` >800 ms | Bids may arrive after the proposer has moved on. |

## Community dashboards

These sites describe the public relay and builder market. They do not scrape your node's `/metrics` endpoint.

- [mevboost.org](https://www.mevboost.org) — Relays and builders producing recent blocks.
- [mevboost.pics](https://mevboost.pics) — Charts about the MEV-Boost ecosystem.
- [Flashbots Relay Dashboard](https://boost-relay.flashbots.net) — Flashbots relay status and recent deliveries.
