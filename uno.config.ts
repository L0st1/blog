import {
  defineConfig,
  presetIcons,
  presetWind4,
} from 'unocss'

export default defineConfig({
  // Markdown is not always in Vite’s module graph (e.g. Nuxt Content DB), so
  // utilities written only in content/**/*.md are not extracted unless we scan these files.
  // https://unocss.dev/integrations/nuxt#content-injection
  // 允许md文档注入原子类样式
  content: {
    filesystem: ['content/**/*.md'],
  },
  shortcuts: [
    ['form-article-title', `text-[16px] font-semibold mb-[10px] rounded flex justify-between`],
  ],
  presets: [
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetWind4(),
  ],
})
