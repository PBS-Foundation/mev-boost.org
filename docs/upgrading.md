---
sidebar_position: 11
title: Upgrading
keywords: [upgrade, migration, update, hard fork, network upgrade, version]
---

# Upgrading MEV-Boost

## Before You Upgrade

1. **Check the [release notes](https://github.com/flashbots/mev-boost/releases)** for breaking changes or new requirements.
2. **Back up your configuration** — especially systemd service files and YAML config files.
3. **Plan for brief downtime** — your validator will fall back to local block building while MEV-Boost restarts.

## Upgrade Methods

### Pre-built Binaries

```bash
# Download the latest release
curl -L https://github.com/flashbots/mev-boost/releases/latest/download/mev-boost_linux_amd64 -o mev-boost

# Make it executable
chmod +x mev-boost

# Verify the version
./mev-boost -version

# Restart the service
sudo systemctl restart mev-boost
```

### From Source

```bash
cd mev-boost
git fetch origin
git checkout v1.12  # Replace with target version
make build

sudo systemctl restart mev-boost
```

### Docker

```bash
docker pull flashbots/mev-boost:latest
# Or pin a specific version:
docker pull flashbots/mev-boost:1.12

# Restart your container
docker restart mev-boost
```

## Required Upgrades for Network Forks

MEV-Boost **must** be updated before Ethereum network upgrades (hard forks). Running an outdated version after a fork will cause proposal failures.

| Network Upgrade | Date | Minimum MEV-Boost Version |
|-----------------|------|---------------------------|
| Fusaka | Dec 3, 2025 (epoch 411392) | v1.10 |
| Pectra | — | v1.9 |

:::warning
Always upgrade MEV-Boost **before** a scheduled hard fork. After the fork, an outdated version will fail to produce valid blocks.
:::

## Version History and Migration Notes

### v1.11 to v1.12

**New feature: Relay Multiplexing**

- No breaking changes. Existing configurations continue to work.
- To use relay muxing, create a YAML config file with `mux` groups. See [Relay Multiplexing](./relay-muxing).
- The `-config` and `-watch-config` flags are required for mux support.

### v1.10 to v1.11

**New feature: Timing Games**

- No breaking changes. Existing configurations continue to work.
- To use timing games, create a YAML config file. See [Timing Games](./timing-games).
- New flags: `-config`, `-watch-config`, `-color`.
- Metrics latency units changed from microseconds to milliseconds. **Update your Grafana dashboards and alert thresholds** if you rely on latency metrics.

### v1.9 to v1.10

**Required for Fusaka upgrade**

- New features: Prometheus metrics (`-metrics`, `-metrics-addr`), `X-Timeout-Ms` header support.
- New flags: `-metrics`, `-metrics-addr`.
- `getPayloadV2` API support added with fallback to V1.
- No breaking changes to existing configurations.

### v1.8 to v1.9

**Required for Pectra upgrade**

- SSZ encoded message support added.
- RISC-V platform support added.
- Built with Go 1.24.
- Relay monitor support removed.

## Post-Upgrade Checklist

After upgrading, verify your setup:

```bash
# 1. Check the version
./mev-boost -version

# 2. Check the service is running
sudo systemctl status mev-boost

# 3. Verify relay connectivity
curl http://localhost:18550/eth/v1/builder/status

# 4. Check logs for errors
sudo journalctl -u mev-boost -f --no-pager -n 50

# 5. If using metrics, verify they're being scraped
curl http://localhost:18551/metrics
```

## Rollback

If an upgrade causes issues, you can roll back to the previous version:

```bash
# If using binaries, replace with the previous version
curl -L https://github.com/flashbots/mev-boost/releases/download/v1.11/mev-boost_linux_amd64 -o mev-boost
chmod +x mev-boost
sudo systemctl restart mev-boost

# If using Docker
docker pull flashbots/mev-boost:1.11
docker restart mev-boost
```

:::tip
Keep the previous binary or Docker image tag available so you can roll back quickly if needed.
:::
