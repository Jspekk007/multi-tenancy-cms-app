import { Controls, Primary, Source, Stories, Subtitle, Title } from '@storybook/addon-docs/blocks';
import { Preview } from '@storybook/react';

const preview: Preview = {
  tags: ['autodocs', 'test'],

  parameters: {
    options: {
      storySort: {
        order: ['Layout', 'Design System', '*'],
      },
    },

    // Add backgrounds for components
    backgrounds: {
      options: {
        light: { name: 'light', value: '#ffffff' },
        dark: { name: 'dark', value: '#111827' },
        gray: { name: 'gray', value: '#f3f4f6' },
      },
    },

    // Show viewport/responsive options
    viewport: {
      options: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1440px', height: '1024px' } },
      },
    },

    // Controls: show props automatically
    controls: { expanded: true },

    // Actions: log events like onClick
    actions: { argTypesRegex: '^on[A-Z].*' },

    // Layout: center or fullscreen
    layout: 'centered',

    // Accessibility addon
    a11y: {
      context: '#storybook-root', // test the whole story container
      config: {},
      options: { checks: { colorContrast: { threshold: 4.5 } } },
    },

    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Primary />

          <Source dark />

          <Controls />
          <Stories />
        </>
      ),
    },
  },

  initialGlobals: {
    viewport: {
      value: 'desktop',
      isRotated: false,
    },

    backgrounds: {
      value: 'light',
    },
  },
};

export default preview;
