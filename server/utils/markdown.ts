/**
 * Markdown 渲染工具
 * 
 * 支持两种数学公式渲染模式：
 * - SSR 模式（默认）：服务端使用 MathJax 将公式渲染为 SVG/CHTML
 * - Client 模式：服务端保护公式语法，由客户端 MathJax 渲染
 * 
 * 环境变量：
 * - MATHJAX_MODE: 'ssr' | 'client'（默认 'ssr'）
 * - MATHJAX_OUTPUT: 'svg' | 'chtml'（默认 'svg'，仅 SSR 模式有效）
 */

import MarkdownIt from 'markdown-it'
import shikiPlugin from '@shikijs/markdown-it'
import mathjax3 from 'markdown-it-mathjax3'

// ============================================================================
// 渲染器实例缓存（单例模式，避免重复初始化）
// ============================================================================

/** SSR 模式渲染器：包含 MathJax 插件 */
let ssrRenderer: MarkdownIt | null = null

/** Client 模式渲染器：不包含 MathJax，公式由前端处理 */
let clientRenderer: MarkdownIt | null = null

// ============================================================================
// 渲染器工厂
// ============================================================================

/**
 * 获取 Markdown 渲染器
 * @param mode - 渲染模式：'ssr' 或 'client'
 */
async function getRenderer(mode: 'ssr' | 'client'): Promise<MarkdownIt> {
  if (mode === 'client') {
    return clientRenderer ?? (clientRenderer = await createClientRenderer())
  }
  return ssrRenderer ?? (ssrRenderer = await createSsrRenderer())
}

/**
 * 创建 Client 模式渲染器
 * - 不加载 MathJax 插件
 * - 公式将被 protectMath/restoreMath 保护，输出原始 TeX 供前端处理
 */
async function createClientRenderer(): Promise<MarkdownIt> {
  const md = MarkdownIt({
    html: true,       // 允许 HTML 标签
    linkify: true,    // 自动识别链接
    typographer: false // 关闭智能标点，避免干扰 LaTeX 语法
  })

  // 代码高亮（Shiki）
  md.use(await shikiPlugin({
    themes: { light: 'github-light', dark: 'github-dark' }
  }))

  return md
}

/**
 * 创建 SSR 模式渲染器
 * - 加载 MathJax 插件，服务端直接渲染公式为 SVG/CHTML
 */
async function createSsrRenderer(): Promise<MarkdownIt> {
  const output = (process.env.MATHJAX_OUTPUT || 'svg').toLowerCase()

  const md = MarkdownIt({
    html: true,
    linkify: true,
    typographer: false
  })

  // MathJax 配置
  const mathjaxOptions: Record<string, unknown> = {
    tex: {
      inlineMath: [['$', '$']],      // 行内公式分隔符
      displayMath: [['$$', '$$']],   // 块级公式分隔符
      tags: 'ams'                     // 公式编号风格
    }
  }

  // 输出格式配置
  if (output === 'chtml') {
    // CHTML：使用网络字体，某些环境下更清晰
    mathjaxOptions.chtml = {
      displayAlign: 'center',
      displayIndent: '0'
    }
  } else {
    // SVG（默认）：矢量图形，缩放不失真
    mathjaxOptions.svg = {
      scale: 1,           // 1x 基准缩放，避免二次缩放模糊
      minScale: 1,        // 不向下缩放
      exFactor: 0.5,      // ex 尺寸因子（接近默认值）
      displayAlign: 'center',
      displayIndent: '0',
      fontCache: 'local'  // 局部缓存，减少不同尺寸复用导致的失真
    }
  }

  // 插件加载顺序很重要：MathJax 必须先于其他插件
  // 确保 $ 分隔符优先被识别，避免 _ 被解析为斜体
  md.use(mathjax3, mathjaxOptions)

  // 代码高亮（Shiki）
  md.use(await shikiPlugin({
    themes: { light: 'github-light', dark: 'github-dark' }
  }))

  return md
}

// ============================================================================
// 公式保护与还原（仅 Client 模式使用）
// ============================================================================

/** 公式占位符前缀 */
const PLACEHOLDER = {
  BLOCK: '%%MATH_BLOCK_',
  INLINE: '%%MATH_INLINE_'
} as const

/**
 * 保护公式：将 $...$ 和 $$...$$ 替换为占位符
 * 
 * 目的：防止 Markdown 解析器将公式中的 _ 解析为斜体标记
 * 
 * @example
 * 输入: "公式 $x_1$ 测试"
 * 输出: { text: "公式 %%MATH_INLINE_0%% 测试", formulas: ["$x_1$"] }
 */
function protectMath(content: string): { text: string; formulas: string[] } {
  const formulas: string[] = []

  // 1. 先处理块级公式 $$...$$（贪婪匹配，支持多行）
  let text = content.replace(/\$\$([\s\S]+?)\$\$/g, (match) => {
    formulas.push(match)
    return `${PLACEHOLDER.BLOCK}${formulas.length - 1}%%`
  })

  // 2. 再处理行内公式 $...$（非贪婪，单行）
  text = text.replace(/\$([^\$\n]+?)\$/g, (match) => {
    formulas.push(match)
    return `${PLACEHOLDER.INLINE}${formulas.length - 1}%%`
  })

  return { text, formulas }
}

/**
 * 还原公式：将占位符替换回原始公式
 * 
 * 输出格式：
 * - 行内公式: <span class="math-tex math-inline">$...$</span>
 * - 块级公式: <div class="math-tex math-block">$$...$$</div>
 * 
 * 前端 MathJax 通过 .math-tex 类名识别并渲染
 */
function restoreMath(html: string, formulas: string[]): string {
  // 还原块级公式
  html = html.replace(
    new RegExp(`${PLACEHOLDER.BLOCK}(\\d+)%%`, 'g'),
    (_, idx) => {
      const formula = formulas[parseInt(idx)]
      return `<div class="math-tex math-block">${escapeHtml(formula)}</div>`
    }
  )

  // 还原行内公式
  html = html.replace(
    new RegExp(`${PLACEHOLDER.INLINE}(\\d+)%%`, 'g'),
    (_, idx) => {
      const formula = formulas[parseInt(idx)]
      return `<span class="math-tex math-inline">${escapeHtml(formula)}</span>`
    }
  )

  return html
}

/**
 * HTML 转义：防止公式中的特殊字符破坏 HTML 结构
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// ============================================================================
// 导出 API
// ============================================================================

/**
 * 渲染 Markdown 内容为 HTML
 * 
 * @param content - Markdown 原始内容
 * @returns 渲染后的 HTML 字符串
 * 
 * @example
 * // SSR 模式：公式直接渲染为 SVG
 * const html = await renderMarkdown("# 标题\n$E=mc^2$")
 * 
 * @example
 * // Client 模式：公式保留原始 TeX，由前端渲染
 * // 设置 MATHJAX_MODE=client
 * const html = await renderMarkdown("# 标题\n$E=mc^2$")
 * // 输出: <h1>标题</h1>\n<span class="math-tex">$E=mc^2$</span>
 */
export async function renderMarkdown(content: string): Promise<string> {
  const mode = (process.env.MATHJAX_MODE || 'ssr').toLowerCase() as 'ssr' | 'client'

  if (mode === 'client') {
    // Client 模式流程：
    // 1. 保护公式 → 2. 渲染 Markdown → 3. 还原公式
    const { text, formulas } = protectMath(content)
    const renderer = await getRenderer('client')
    const html = renderer.render(text)
    return restoreMath(html, formulas)
  }

  // SSR 模式：MathJax 插件直接处理公式
  const renderer = await getRenderer('ssr')
  return renderer.render(content)
}
