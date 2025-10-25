import { createRequire } from 'node:module';

import type { StorybookConfig } from '@storybook/react-vite';
import { dirname, join, resolve } from 'path';

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  stories: [
    '../src/**/*.stories.@(ts|tsx|js|jsx|mdx)',
    '../.storybook/foundations/**/*.stories.@(ts|tsx|js|jsx|mdx)',
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-docs'],

  viteFinal(config) {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias || {}),
        '@': resolve(__dirname, '../src'),
      },
    };

    // 👇 Add this section
    config.css = {
      ...config.css,
      modules: {
        // Treat files as CSS modules *only* if they end with `.module.scss`
        scopeBehaviour: 'local', // Use 'local' or 'global' depending on your requirement
      },
      preprocessorOptions: {
        ...(config.css?.preprocessorOptions || {}),
        scss: {
          additionalData: `
            @use "@/assets/scss/tokens/typography" as *;
            @use "@/assets/scss/tokens/colors" as *;
            @use "@/assets/scss/tokens/spacing" as *;
            @use "@/assets/scss/tokens/breakpoints" as *;
            @use "@/assets/scss/tokens/misc" as *;
            @use "@/assets/scss/tokens/mixins" as *;
          `,
        },
      },
    };

    return config;
  },
};

export default config;

function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, 'package.json')));
}
