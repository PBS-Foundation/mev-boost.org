---
sidebar_position: 10
title: Troubleshooting
---

# Troubleshooting

Common issues and solutions when running MEV-Boost.

## Connection Issues

### MEV-Boost fails to start

**Symptom**: `mev-boost` exits immediately or shows a bind error.

**Solutions**:
- Check if port `18550` is already in use: `lsof -i :18550`
- Use a different address with `-addr`: `./mev-boost -addr 0.0.0.0:18551 ...`
- Ensure you're running the correct binary for your platform

### Relay connection errors on startup

**Symptom**: `relay check failed` or `context deadline exceeded` on startup.

**Solutions**:
- Verify your relay URLs are correct and include the scheme (`https://`)
- Check your network/firewall allows outbound HTTPS connections
- The `-relay-check` flag validates relays on startup. If a relay is temporarily down, you can remove `-relay-check` (not recommended for production)
- Ensure you're using the correct relay URL for your network (mainnet vs testnet)

### Beacon node can't connect to MEV-Boost

**Symptom**: Beacon node logs show errors connecting to the builder API endpoint.

**Solutions**:
- Confirm MEV-Boost is running: `curl http://localhost:18550/eth/v1/builder/status`
- If running in Docker, ensure the port is exposed: `-p 18550:18550`
- Check the `-addr` flag matches what your beacon node is configured to connect to
- If MEV-Boost is on a different machine, bind to `0.0.0.0` instead of `localhost`

## Block Proposal Issues

### No bids received from relays

**Symptom**: Logs show `no bid received` or `no payload` for your slot.

**Solutions**:
- This is normal if no builder submitted a profitable block for your slot
- Check that your validator is correctly registered with relays (see [Verifying Your Setup](./usage#verifying-your-setup))
- Ensure you're connected to multiple relays for better coverage
- Check if your `-min-bid` is set too high — lower it or remove it temporarily to test

### Fallback to local block building

**Symptom**: Validator proposes a locally-built block instead of a relay block.

This happens when:
- MEV-Boost is unreachable
- No relay returned a bid in time
- The bid was below your `-min-bid` threshold
- The relay bid was invalid or failed verification

This is **expected behavior** — your validator will still propose blocks, just without MEV rewards.

## Version & Upgrade Issues

### Required upgrades for network forks

MEV-Boost must be updated before Ethereum network upgrades (hard forks). Running an outdated version after a fork will cause proposal failures.

| Network Upgrade | Minimum Version |
|-----------------|-----------------|
| Fusaka          | v1.10           |
| Pectra          | v1.9            |

Always check the [releases page](https://github.com/flashbots/mev-boost/releases) before a scheduled upgrade.

### Checking your version

```bash
./mev-boost -version
```

Or with Docker:

```bash
docker run flashbots/mev-boost -version
```

## Systemd Issues

### Service fails to start

Check logs for details:

```bash
sudo journalctl -u mev-boost -f --no-pager -n 50
```

Common causes:
- **Wrong binary path** in `ExecStart` — verify the path exists
- **Permission errors** — ensure the `mev-boost` user has execute permissions on the binary
- **Invalid flags** — check for typos in relay URLs or flags

### Service keeps restarting

If MEV-Boost exits repeatedly:

```bash
sudo systemctl status mev-boost
```

Look at the exit code. Common issues:
- Port already in use (exit code 1)
- Invalid relay URL format
- Network connectivity issues to relays

## Metrics & Monitoring

### Prometheus metrics not appearing

- Ensure you started MEV-Boost with `-metrics`
- Check the metrics endpoint: `curl http://localhost:18551/metrics`
- If using a custom port, verify `-metrics-addr` matches your Prometheus scrape config

## Getting Help

If your issue isn't covered here:

1. Search existing [GitHub Issues](https://github.com/flashbots/mev-boost/issues)
2. Ask on the [Flashbots Forum](https://collective.flashbots.net/)
3. Join the [Flashbots Discord](https://discord.com/invite/3TjWjBerRb)
4. Open a [new GitHub Issue](https://github.com/flashbots/mev-boost/issues/new) with logs and configuration details
