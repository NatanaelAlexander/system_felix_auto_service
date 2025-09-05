// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['reka-ui/nuxt'],
  css: ['./app/main.css'],
  runtimeConfig: {
    // Variables privadas del servidor
    appUrlTurso: process.env.APP_URL_TURSO,
    appTokenTurso: process.env.APP_TOKEN_TURSO,
    appSecretWord: process.env.APP_SECRET_WORD,
    // Variables públicas
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE
    }
  },
  vite: {
    plugins: [tailwindcss()]
  }
})