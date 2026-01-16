import { loadPosts } from '~/content/loader'

export default defineEventHandler(() => {
  const posts = loadPosts()
  
  // 返回文章列表，按日期排序（如果有的话）
  return posts.map(post => ({
    slug: post.slug,
    meta: post.meta
  }))
})
