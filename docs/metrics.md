---
sidebar_position: 7
title: Metrics & Monitoring
keywords: [metrics, prometheus, grafana, monitoring, observability, alerts]
---

# Metrics & Monitoring

MEV-Boost exposes a [Prometheus](https://prometheus.io/)-compatible metrics endpoint for monitoring performance, relay behavior, and bid activity.

:::info
Prometheus metrics support was added in **MEV-Boost v1.10**.
:::

## Enabling Metrics

Start MEV-Boost with the `-metrics` flag:

```bash
./mev-boost -metrics -relay $YOUR_RELAY
```

By default, the metrics server listens on `localhost:18551`. To change the address:

```bash
./mev-boost -metrics -metrics-addr 0.0.0.0:9009 -relay $YOUR_RELAY
```

### Systemd Example

```ini
[Service]
ExecStart=/home/mev-boost/bin/mev-boost \
    -mainnet \
    -relay-check \
    -metrics \
    -metrics-addr 127.0.0.1:18551 \
    -relay https://0xPUBKEY@relay.example.com
```

## Verifying Metrics

Once running, you can verify the metrics endpoint:

```bash
curl http://localhost:18551/metrics
```

You should see Prometheus-formatted output with `mevboost_` prefixed metrics.

## Available Metrics

### Request Latency

| Metric | Type | Description |
|--------|------|-------------|
| `mevboost_get_header_latency_ms` | Histogram | Latency of `getHeader` requests to relays (milliseconds). |
| `mevboost_get_payload_latency_ms` | Histogram | Latency of `getPayload` requests to relays (milliseconds). |
| `mevboost_register_validator_latency_ms` | Histogram | Latency of `registerValidator` requests to relays (milliseconds). |

### Bid Activity

| Metric | Type | Description |
|--------|------|-------------|
| `mevboost_best_bid_value` | Gauge | Value of the best bid received (in wei). |
| `mevboost_bids_received_total` | Counter | Total number of bids received from relays. |
| `mevboost_no_bid_total` | Counter | Total number of slots where no bid was received. |

### Relay Status

| Metric | Type | Description |
|--------|------|-------------|
| `mevboost_relay_errors_total` | Counter | Total number of errors from relay requests, labeled by relay and error type. |

:::note
Metric names and labels may vary between versions. Check the `/metrics` endpoint output for the definitive list for your version.
:::

## Prometheus Configuration

Add MEV-Boost as a scrape target in your `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'mev-boost'
    static_configs:
      - targets: ['localhost:18551']
    scrape_interval: 15s
```

If you're already monitoring your consensus and execution clients, add MEV-Boost alongside them:

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

## Grafana Dashboard

You can build a Grafana dashboard to visualize MEV-Boost metrics. Useful panels include:

- **Bid values over time** — Track `mevboost_best_bid_value` to see how bid values change across slots.
- **Relay latency heatmap** — Use `mevboost_get_header_latency_ms` histogram buckets to identify slow relays.
- **Error rate by relay** — Graph `mevboost_relay_errors_total` by relay label to spot unreliable relays.
- **No-bid rate** — Track `mevboost_no_bid_total` to understand how often fallback to local building occurs.

### Example PromQL Queries

**Average `getHeader` latency over the last hour:**

```promql
rate(mevboost_get_header_latency_ms_sum[1h]) / rate(mevboost_get_header_latency_ms_count[1h])
```

**Error rate per relay over the last 5 minutes:**

```promql
rate(mevboost_relay_errors_total[5m])
```

**Percentage of slots with no bid:**

```promql
rate(mevboost_no_bid_total[1h]) / rate(mevboost_bids_received_total[1h] + mevboost_no_bid_total[1h]) * 100
```

## Alerting Recommendations

Consider setting up alerts for:

| Condition | Suggested Threshold | Why |
|-----------|---------------------|-----|
| MEV-Boost down | Metrics endpoint unreachable for >1 min | Validators will fall back to local block building. |
| High relay error rate | >50% errors for a single relay over 5 min | A relay may be degraded; consider removing it. |
| All relays returning no bids | No bids for >10 consecutive slots | Check relay connectivity and validator registration. |
| High `getHeader` latency | p99 >800ms | Bids may arrive too late, causing missed proposals. |

## Community Dashboards

- [mevboost.org](https://www.mevboost.org) — Overview of relays and builders producing recent blocks.
- [mevboost.pics](https://mevboost.pics) — Charts and dashboards about the MEV-Boost ecosystem.
- [Flashbots Relay Dashboard](https://boost-relay.flashbots.net) — Flashbots relay status and recent deliveries.
