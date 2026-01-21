/**
 * Markdown 渲染工具（独立于 Nuxt Content）
 * - 使用 markdown-it + Shiki 代码高亮
 * - 不包含数学公式渲染（数学由 Nuxt Content 的 remark-math + rehype-katex 负责）
 */

import MarkdownIt from 'markdown-it'
import shikiPlugin from '@shikijs/markdown-it'

/**
 * 将 Markdown 内容渲染为 HTML
 */
export async function renderMarkdown(content: string): Promise<string> {
  const md = MarkdownIt({
    html: true,
    linkify: true,
    typographer: false
  })

  md.use(await shikiPlugin({
    themes: { light: 'github-light', dark: 'github-dark' }
  }))

  return md.render(content)
}
