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

### `localhost` vs `127.0.0.1` latency (Windows)

**Symptom**: MEV-Boost proposals keep failing with timeouts on Windows.

On Windows, using `localhost` instead of `127.0.0.1` can add ~300ms of DNS resolution latency. With MEV-Boost's tight timeout windows (default `getHeader` timeout is 950ms), this extra delay can cause bids to arrive too late.

**Solution**: Use `127.0.0.1` explicitly in all configuration — both in MEV-Boost's `-addr` flag and in your beacon node's builder endpoint setting.

```bash
# Instead of: --builder-endpoint http://localhost:18550
--builder-endpoint http://127.0.0.1:18550
```

### "Failed to register validator with builder network"

**Symptom**: Consensus client logs show errors like:
```
Failed to send validator registrations to the builder network
RemoteServiceNotAvailableException: builder not available
```

**Solutions**:
- Confirm MEV-Boost is running and reachable: `curl http://127.0.0.1:18550/eth/v1/builder/status`
- For **Teku**: ensure `--validators-builder-registration-default-enabled=true` and `--builder-endpoint=http://127.0.0.1:18550` are set
- For **Prysm**: ensure `--http-mev-relay=http://127.0.0.1:18550` is set on the beacon node
- For **Lighthouse**: ensure `--builder http://127.0.0.1:18550` is set on the beacon node
- If running separate beacon and validator services, check that the beacon node (not just the validator) is configured for MEV-Boost

## Block Proposal Issues

### No bids received from relays

**Symptom**: Logs show `no bid received` or `no payload` for your slot.

**Solutions**:
- This is normal if no builder submitted a profitable block for your slot
- Check that your validator is correctly registered with relays (see [Verifying Your Setup](./usage#verifying-your-setup))
- Ensure you're connected to multiple relays for better coverage
- Check if your `-min-bid` is set too high — lower it or remove it temporarily to test

### Missed proposal: "sent too late" / relay timeout

**Symptom**: MEV-Boost logs show `error making request to relay`, `sent too late`, and eventually `no payload received from relay!`. Your block proposal is missed entirely.

This is one of the most commonly reported issues on [r/ethstaker](https://www.reddit.com/r/ethstaker/). It typically happens when:
- A slow relay holds up the bidding auction past the proposal deadline
- The `getHeader` request completes, but by the time the signed blinded block is submitted back to the relay (`getPayload`), it's too late

**Solutions**:
- **Use multiple relays** for redundancy — but be aware a single slow relay can delay the auction
- **Remove consistently slow relays** from your configuration. Check relay latency in your logs
- **Set `-min-bid`** so that low-value bids don't hold up your proposal for minimal gain
- Keep MEV-Boost, consensus client, and execution client **all up to date**
- Consider [Timing Games](./timing-games) to optimize `getHeader` request timing

### "No payload received from relay" (502 error)

**Symptom**: MEV-Boost receives a bid and the consensus client signs the header, but when submitting the blinded block back to the relay, the relay returns a 502 error or times out:
```
error making request to relay ... could not read response body: context deadline exceeded
no payload received from relay!
```

**Solutions**:
- This is typically a relay-side issue, not a problem with your setup
- Ensure you're connected to **multiple relays** so another relay can serve the payload
- Check the [relay status pages](./relays) for known outages
- If it happens repeatedly with a specific relay, consider removing it temporarily

### Local block proposed instead of MEV block

**Symptom**: Beacon logs show `Local block is more profitable than relay block` even though the relay value appears higher. The `builder_boost_factor` shows `Some(0)`.

```
INFO Local block is more profitable than relay block,
  builder_boost_factor: Some(0), boosted_relay_value: 0,
  relay_value: 50956939974241468, local_block_value: 20996127714216269
```

**Solutions**:
- A `builder_boost_factor` of `0` means your consensus client is configured to **always prefer local blocks**. This overrides MEV-Boost entirely
- For **Lighthouse**: check `--builder-boost-factor`. Set it to `100` for equal comparison, or remove the flag entirely to use the default behavior
- For **Prysm**: ensure `--local-block-value-boost` is not set to an extreme value
- For **Teku**: check `--builder-bid-compare-factor`

### Validator registration not found

**Symptom**: Querying the relay data API returns `"no registration found"` for your validator pubkey, even though MEV-Boost appears to be running.

```
curl https://boost-relay.flashbots.net/relay/v1/data/validator_registration?pubkey=0xYOUR_KEY
# Returns: "no registration found"
```

**Solutions**:
- Ensure your consensus client has builder/MEV-Boost registration enabled (this is client-specific — see [Relays & Clients](./relays#consensus-client-compatibility))
- Registrations are sent periodically. Wait a few epochs after starting MEV-Boost, then check again
- Check MEV-Boost logs for `registerValidator` entries — if you don't see them, the consensus client isn't sending registrations
- Verify the fee recipient address is set correctly in your validator client

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

### Missing backslash in service file

**Symptom**: MEV-Boost starts but ignores some relay flags, or fails with unexpected errors.

A frequently reported issue on [r/ethstaker](https://www.reddit.com/r/ethstaker/) is a missing `\` continuation character in the systemd service file. Each line in a multi-line `ExecStart` must end with `\` except the last one:

```ini
# WRONG — missing backslash after -relay-check
ExecStart=/home/mev-boost/bin/mev-boost \
    -relay-check
    -relay https://...

# CORRECT
ExecStart=/home/mev-boost/bin/mev-boost \
    -relay-check \
    -relay https://...
```

After fixing, always reload and restart:

```bash
sudo systemctl daemon-reload
sudo systemctl restart mev-boost
```

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
