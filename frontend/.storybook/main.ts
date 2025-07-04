import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

export default {
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  stories: ['../components/**/*.stories.@(js|ts|jsx|tsx|mdx)'],
  addons: ['@storybook/addon-essentials'],
  viteFinal(config) {
    config.plugins = [
      ...(config.plugins || []),
      vue(),
    ] // Add Vue plugin

    config.resolve = {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias || {}),
        '@': resolve(__dirname, '../'), // alias @ to frontend root
      },
    }
    config.css = {
      ...config.css,
      preprocessorOptions: {
        ...(config.css?.preprocessorOptions || {}),
        scss: {
          additionalData: `
            @use "@/assets/scss/variables" as *;
            @use "@/assets/scss/mixins" as *;
          `,
        },
      },
    }
    return config
  },
}
