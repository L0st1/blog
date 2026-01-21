import {
  defineConfig,
  presetIcons,
  presetWind4,
} from 'unocss'

export default defineConfig({
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
