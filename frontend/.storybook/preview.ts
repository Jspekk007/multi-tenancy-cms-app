import '@/assets/scss/tokens/main.scss';

import { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    // Sort stories in the sidebar
    options: {
      storySort: {
        order: ['Layout', 'Design System', '*'], // Layout first, then DS
      },
    },

    // Add backgrounds for components
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#111827' },
        { name: 'gray', value: '#f3f4f6' },
      ],
    },

    // Show viewport/responsive options
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1440px', height: '1024px' } },
      },
      defaultViewport: 'desktop',
    },

    // Controls: show props automatically
    controls: { expanded: true },

    // Actions: log events like onClick
    actions: { argTypesRegex: '^on[A-Z].*' },

    // Layout: center or fullscreen
    layout: 'centered',

    // Accessibility addon
    a11y: {
      element: '#root', // test the whole story container
      config: {},
      options: { checks: { colorContrast: { threshold: 4.5 } } },
    },

    // Documentation styling
    docs: {
      theme: undefined, // optional: can import a custom theme
      source: { type: 'code' },
    },
  },
};

export default preview;
