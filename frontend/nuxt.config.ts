import { resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/storybook',
  ],
  devtools: { enabled: true },
  css: ['@/assets/scss/tokens/main.scss'],
  compatibilityDate: '2025-05-15',

  vite: {
    resolve: {
      alias: {
        '@': resolve(__dirname, '.'),
      },
    },
    css: {
      preprocessorOptions: {
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
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
