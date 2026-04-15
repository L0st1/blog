import process from 'node:process'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2026-01-16',

  experimental: {
    appManifest: false,
  },

  css: ['@unocss/reset/tailwind.css', '~/assets/css/main.css'],

  modules: [
    '@nuxtjs/color-mode',
    '@unocss/nuxt',
    'motion-v/nuxt',
    '@nuxt/content',
    '@vercel/analytics',
    '@vercel/speed-insights',
  ],

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  content: {
    build: {
      markdown: {
        // 数学语法解析
        remarkPlugins: {
          'remark-math': {},
        },
        // 使用 KaTeX 在构建期静态渲染
        rehypePlugins: {
          'rehype-katex': {},
        },
        // Shiki 与 @nuxtjs/color-mode 联动：亮/暗各一套主题
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
          },
        },
      },
    },
  },

  nitro: {
    // 为 / 启用预渲染
    prerender: {
      routes: ['/'],
      crawlLinks: true,
    },
  },

  typescript: {
    strict: true,
    // On Windows with pnpm, Nuxt's dev-time type checker (vite-plugin-checker)
    // can fail resolving TypeScript lib.*.d.ts files. Prefer running
    // `nuxi typecheck` / `pnpm run typecheck:watch` instead.
    typeCheck: process.platform !== 'win32',
  },

  routeRules: {
    '/': { prerender: true },
    '/blog/**': { prerender: true, swr: false },
  },
})
