import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/react-vite';
import { dirname, join, resolve } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  staticDirs: ['../public'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs', '@storybook/addon-a11y'],

  viteFinal(config) {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias || {}),
        '@': resolve(__dirname, '../src'),
      },
    };

    config.css = {
      ...config.css,
      modules: {
        scopeBehaviour: 'local',
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
