// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'MEV-Boost',
  tagline: 'Proposer-Builder Separation for Ethereum',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://mev-boost.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'flashbots',
  projectName: 'mev-boost',

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  markdown: {
    mermaid: true,
  },

  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      ({
        docsRouteBasePath: '/',
        indexBlog: false,
        hashed: true,
      }),
    ],
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/flashbots/mev-boost.org/tree/main/',

        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/mev-boost.png',
      announcementBar: {
        id: 'fusaka_upgrade',
        content: '⚡ <b>MEV-Boost v1.10</b> is required for the Fusaka upgrade — <a href="/releases">view release notes</a>',
        backgroundColor: '#1a1a2e',
        textColor: '#00e5ff',
        isCloseable: true,
      },
      colorMode: {
        respectPrefersColorScheme: true,
      },
      mermaid: {
        theme: { light: 'neutral', dark: 'dark' },
      },
      navbar: {
        title: 'mev-boost',
        logo: {
          alt: 'mev-boost',
          src: 'img/logo_square.png',
          srcDark: 'img/logo_square.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/flashbots/mev-boost',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Installation',
                to: '/installation',
              },
              {
                label: 'Usage',
                to: '/usage',
              },
              {
                label: 'FAQ',
                to: '/faq',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Forum',
                href: 'https://collective.flashbots.net/',
              },
              {
                label: 'Discord',
                href: 'https://discord.com/invite/3TjWjBerRb',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/flashbots/mev-boost',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Flashbots',
                href: 'https://www.flashbots.net/',
              },
              {
                label: 'mevboost.org',
                href: 'https://www.mevboost.org/',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Flashbots. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'ini', 'yaml', 'json'],
      },
    }),
};

export default config;
