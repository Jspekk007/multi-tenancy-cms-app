// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: ['@nuxt/eslint'],
  devtools: { enabled: true },
  css: ['@/assets/css/main.css'],
  compatibilityDate: '2025-05-15',

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/scss/variables.scss" as *;
            @use "@/assets/scss/mixins.scss" as *;
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
