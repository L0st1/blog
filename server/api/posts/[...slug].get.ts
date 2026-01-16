import { loadPosts } from '~/content/loader'

export default defineEventHandler((event) => {
  // catch-all 路由参数是完整路径字符串，如 "2026/hello-world"
  const slug = getRouterParam(event, 'slug')
  const post = loadPosts().find(p => p.slug === slug)

  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  }

  return post
})
