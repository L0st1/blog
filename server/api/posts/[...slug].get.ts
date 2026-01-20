import { loadPosts } from '~/content/loader'
import { renderMarkdown } from '~/server/utils/markdown'

export default defineEventHandler(async (event) => {
  // catch-all 路由参数是完整路径字符串，如 "2026/hello-world"
  const slug = getRouterParam(event, 'slug')
  const post = loadPosts().find(p => p.slug === slug)

  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  }

  // 服务端渲染 Markdown 为 HTML
  const html = await renderMarkdown(post.body)

  return {
    slug: post.slug,
    meta: post.meta,
    html
  }
})
