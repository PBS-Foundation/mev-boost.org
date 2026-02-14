---
sidebar_position: 3
title: Installation
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installation

The most common setup is to install MEV-Boost on the same machine as the beacon client. Multiple beacon clients can use a single MEV-Boost instance. The default port is `18550`.

See also [Rémy Roy's guide](https://github.com/eth-educators/ethstaker-guides/blob/main/docs/prepare-for-the-merge.md) for comprehensive instructions on installing, configuring and running MEV-Boost.

<Tabs>
<TabItem value="binaries" label="Binaries" default>

Each release includes binaries for Linux, Windows and macOS. You can find the latest release at:

**[https://github.com/flashbots/mev-boost/releases](https://github.com/flashbots/mev-boost/releases)**

1. Download the binary for your platform from the latest release
2. Make it executable: `chmod +x mev-boost`
3. Verify it works:

```bash
./mev-boost -help
```

</TabItem>
<TabItem value="source" label="From Source">

Requires [Go 1.18+](https://go.dev/doc/install).

**Option A: `go install`**

```bash
go install github.com/flashbots/mev-boost@latest
mev-boost -help
```

**Option B: Clone and Build**

```bash
git clone https://github.com/flashbots/mev-boost.git
cd mev-boost

# Use the stable branch (always the latest released version)
git checkout stable

# Or check out a specific release tag
# git checkout tags/YOUR_VERSION

# Build
make build

# Verify
./mev-boost -help
```

</TabItem>
<TabItem value="docker" label="Docker">

MEV-Boost Docker images are maintained at [hub.docker.com/r/flashbots/mev-boost](https://hub.docker.com/r/flashbots/mev-boost).

1. [Install Docker Engine](https://docs.docker.com/engine/install/)
2. Pull and run the latest image:

```bash
docker pull flashbots/mev-boost:latest

docker run flashbots/mev-boost -help
```

Run with relay configuration:

```bash
docker run flashbots/mev-boost \
    -mainnet \
    -relay-check \
    -relays YOUR_RELAY_URL
```

</TabItem>
<TabItem value="systemd" label="Systemd Service">

Run MEV-Boost as a systemd service. Create `/etc/systemd/system/mev-boost.service`:

```ini
[Unit]
Description=mev-boost
Wants=network-online.target
After=network-online.target

[Service]
User=mev-boost
Group=mev-boost
WorkingDirectory=/home/mev-boost
Type=simple
Restart=always
RestartSec=5
ExecStart=/home/mev-boost/bin/mev-boost \
    -relay-check \
    -relay YOUR_RELAY_CHOICE_A \
    -relay YOUR_RELAY_CHOICE_B \
    -relay YOUR_RELAY_CHOICE_C

[Install]
WantedBy=multi-user.target
```

Then enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable mev-boost
sudo systemctl start mev-boost
```

Check the status:

```bash
sudo systemctl status mev-boost
sudo journalctl -u mev-boost -f
```

</TabItem>
</Tabs>
