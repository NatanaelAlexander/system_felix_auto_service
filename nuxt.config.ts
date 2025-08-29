// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['reka-ui/nuxt'],
  css: ['./app/main.css'],
  vite: {
    plugins: [tailwindcss()]
  }
})