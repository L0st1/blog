import process from 'node:process'
import matter from 'gray-matter'
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
        // 默认 depth: 2 约到 h3；含四级标题时需放开，且需能扫到嵌套在块内的标题
        toc: {
          depth: 4,
          searchDepth: 4,
        },
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

  /**
   * 路由以 frontmatter 的 `path`（连字符 slug）为准；path-meta 仍会按文件名 slugify，此处用 gray-matter 覆盖。
   */
  hooks: {
    'content:file:afterParse': (ctx) => {
      const body = ctx.file.body
      if (typeof body !== 'string') {
        return
      }
      const routePath = matter(body).data.path
      if (typeof routePath === 'string' && routePath.length > 0) {
        const content = ctx.content as unknown as { path: string }
        content.path = `/${routePath.replace(/^\/+/, '')}`
      }
    },
  },
})
