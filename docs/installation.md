---
sidebar_position: 3
title: Installation
---

# Installation

The most common setup is to install MEV-Boost on the same machine as the beacon client. Multiple beacon clients can use a single MEV-Boost instance. The default port is `18550`.

See also [Rémy Roy's guide](https://github.com/eth-educators/ethstaker-guides/blob/main/docs/prepare-for-the-merge.md) for comprehensive instructions on installing, configuring and running MEV-Boost.

## Binaries

Each release includes binaries for Linux, Windows and macOS. You can find the latest release at:

👉 [https://github.com/flashbots/mev-boost/releases](https://github.com/flashbots/mev-boost/releases)

## From Source

Requires [Go 1.18+](https://go.dev/doc/install).

### go install

Install the latest MEV-Boost release:

```bash
go install github.com/flashbots/mev-boost@latest
mev-boost -help
```

### Clone and Build

Ensure you are downloading the most updated MEV-Boost release. Releases are available at [https://github.com/flashbots/mev-boost/releases](https://github.com/flashbots/mev-boost/releases).

```bash
# By default, the develop branch includes ongoing merged PRs for a future release.
git clone https://github.com/flashbots/mev-boost.git
cd mev-boost

# You can use the stable branch, which is always updated with the latest released version
git checkout stable

# If you want to build a specific release, check out the tag.
# See also https://github.com/flashbots/mev-boost/releases
git checkout tags/YOUR_VERSION

# Build most recent version of MEV-Boost
make build

# Show help. This confirms MEV-Boost is able to start.
./mev-boost -help
```

## From Docker Image

MEV-Boost Docker images are maintained at [https://hub.docker.com/r/flashbots/mev-boost](https://hub.docker.com/r/flashbots/mev-boost).

1. [Install Docker Engine](https://docs.docker.com/engine/install/)
2. Pull and run the latest image:

```bash
# Get the MEV-Boost image
docker pull flashbots/mev-boost:latest

# Run it
docker run flashbots/mev-boost -help
```

## Systemd Configuration

You can run MEV-Boost as a systemd service. Create the file `/etc/systemd/system/mev-boost.service`:

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

Then enable and start the service:

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
