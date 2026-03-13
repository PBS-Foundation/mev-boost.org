---
sidebar_position: 15
title: Contributing
keywords: [contributing, development, testing, pull requests, open source]
---

# Contributing

MEV-Boost is open-source software maintained by [Flashbots](https://www.flashbots.net/). Contributions are welcome from the community.

## Quick Links

- [GitHub Repository](https://github.com/flashbots/mev-boost)
- [Open Issues](https://github.com/flashbots/mev-boost/issues)
- [CONTRIBUTING.md](https://github.com/flashbots/mev-boost/blob/develop/CONTRIBUTING.md)
- [Code of Conduct](https://github.com/flashbots/mev-boost/blob/develop/CODE_OF_CONDUCT.md)

## Development Setup

### Prerequisites

- [Go](https://go.dev/) 1.24 or later
- [Make](https://www.gnu.org/software/make/)
- Git

### Clone and Build

```bash
git clone https://github.com/flashbots/mev-boost.git
cd mev-boost
make build
```

### Running Tests

```bash
# Run unit tests
make test

# Run linter
make lint

# Run integration tests with mergemock
make run-mergemock-integration
```

### Running Locally

```bash
# Run with default settings pointed at a test relay
make run
```

## Branch Strategy

- **`develop`** — The default branch. All pull requests target `develop`.
- **`main`** — Stable release branch. Merged from `develop` during releases.

## Pull Request Guidelines

1. **Fork the repository** and create your branch from `develop`.
2. **Write tests** for any new functionality.
3. **Run `make test` and `make lint`** before submitting.
4. **Keep PRs focused** — one feature or fix per PR.
5. **Write a clear description** explaining what the change does and why.

## Reporting Issues

- **Bug reports** — Open a [GitHub Issue](https://github.com/flashbots/mev-boost/issues/new) with logs, configuration details, and steps to reproduce.
- **Security vulnerabilities** — Do **not** open a public issue. Email **security@flashbots.net** instead. See [Security & Bug Bounty](./security) for bounty details.
- **Feature requests** — Open a GitHub Issue or start a discussion on the [Flashbots Forum](https://collective.flashbots.net/).

## Contributing to These Docs

This documentation site is maintained separately at [flashbots/mev-boost.org](https://github.com/flashbots/mev-boost.org).

```bash
git clone https://github.com/flashbots/mev-boost.org.git
cd mev-boost.org
npm install
npm start
```

Docs are written in Markdown/MDX and live in the `docs/` directory. See the [Docusaurus docs](https://docusaurus.io/docs) for formatting guidance.

## Community

- [Flashbots Forum](https://collective.flashbots.net/) — Long-form discussions and proposals.
- [Flashbots Discord](https://discord.com/invite/3TjWjBerRb) — Real-time chat and support.
