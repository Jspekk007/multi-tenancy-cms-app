import { createRequire } from 'node:module'
import { resolve, dirname, join } from 'path'
import vue from '@vitejs/plugin-vue'

const require = createRequire(import.meta.url)

export default {
  framework: {
    name: getAbsolutePath('@storybook/vue3-vite'),
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  stories: [
    '../components/**/*.stories.@(js|ts|jsx|tsx|mdx)',
    './stories/**/*.stories.@(js|ts|jsx|tsx|mdx)',
  ],
  addons: [getAbsolutePath('@storybook/addon-docs')],
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
            @use "@/assets/scss/tokens/typography" as *;
            @use "@/assets/scss/tokens/colors" as *;
            @use "@/assets/scss/tokens/spacing" as *;
            @use "@/assets/scss/tokens/breakpoints" as *;
            @use "@/assets/scss/tokens/misc" as *;
            @use "@/assets/scss/tokens/mixins" as *;
          `,
        },
      },
    }
    return config
  },
}

function getAbsolutePath(value: string): unknown {
  return dirname(require.resolve(join(value, 'package.json')))
}
