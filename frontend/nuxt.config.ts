import { resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/storybook',
  ],
  devtools: { enabled: true },
  css: ['@/assets/scss/main.scss'],
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
            @use "@/assets/scss/variables" as *;
            @use "@/assets/scss/mixins" as *;
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
