import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  // 已改用 KaTeX 在构建期静态渲染（rehype-katex）
  // 此插件留存为空实现，防止遗留引用导致报错。
})
