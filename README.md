# MEV-Boost Documentation

The official documentation site for [MEV-Boost](https://github.com/flashbots/mev-boost), the open-source middleware for Ethereum validators to access a competitive block-building market via proposer-builder separation (PBS).

## 🚀 Quick Links

- **Live Site**: [https://mev-boost.org](https://mev-boost.org)
- **MEV-Boost Repository**: [github.com/flashbots/mev-boost](https://github.com/flashbots/mev-boost)
- **Docker Images**: [hub.docker.com/r/flashbots/mev-boost](https://hub.docker.com/r/flashbots/mev-boost)

## 🛠️ Tech Stack

This documentation site is built with [Docusaurus](https://docusaurus.io/), featuring:
- Client-side search with `@easyops-cn/docusaurus-search-local`
- Mermaid diagrams for architecture visualization
- Custom Flashbots branding and theming
- Responsive design with dark mode support

## Installation

```bash
npm install
```

## Local Development

```bash
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true npm run deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> npm run deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
