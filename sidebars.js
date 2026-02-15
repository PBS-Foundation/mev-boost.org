// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: ['index', 'how-it-works', 'installation'],
    },
    {
      type: 'category',
      label: 'Configuration',
      items: ['usage', 'timing-games'],
    },
    {
      type: 'category',
      label: 'Help',
      items: ['faq', 'troubleshooting'],
    },
    {
      type: 'category',
      label: 'Ecosystem',
      items: ['relays', 'builders'],
    },
    
    {
      type: 'category',
      label: 'Reference',
      items: ['security-audit', 'releases', 'resources'],
    },
  ],
};

export default sidebars;
