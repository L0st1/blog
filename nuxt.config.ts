import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: '2026-01-16',
  typescript: {
    strict: true,
    typeCheck: true
  },
  routeRules: {
    '/blog/**': { prerender: true }
  }
})