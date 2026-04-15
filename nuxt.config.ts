import process from 'node:process'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2026-01-16',

  experimental: {
    appManifest: false,
  },

  modules: [
    '@nuxt/content',
    '@vercel/analytics',
    '@vercel/speed-insights',
  ],

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
