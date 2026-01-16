import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import type { PostMeta } from './schema'

export interface Post {
  slug: string
  meta: PostMeta
  body: string
}

const POSTS_DIR = path.resolve('content/posts')

export function loadPosts(): Post[] {
  const files = fs.readdirSync(POSTS_DIR, { recursive: true }) as string[]

  return files
    .filter(f => f.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
      const { data, content } = matter(raw)

      return {
        slug: file.replace(/\.md$/, ''),
        meta: data as PostMeta,
        body: content
      }
    })
}