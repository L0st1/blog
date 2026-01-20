import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: '2026-01-16',
  typescript: {
    strict: true,
    typeCheck: true
  },
  routeRules: {
    '/blog/**': { prerender: true }
  },
  runtimeConfig: {
    public: {
      mathjaxMode: process.env.MATHJAX_MODE || 'ssr',      // 'ssr' | 'client'
      mathjaxOutput: process.env.MATHJAX_OUTPUT || 'svg'   // 'svg' | 'chtml'
    }
  }
})