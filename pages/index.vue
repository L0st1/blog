<script setup lang="ts">
import type { ContentCollectionItem } from '@nuxt/content'

type Post = ContentCollectionItem & {
  date?: string
  description?: string
}

const SECTIONS = [
  { id: 'engineering', pathPrefix: '/engineering', title: 'Engineering' },
  { id: 'thinking', pathPrefix: '/thinking', title: 'Thinking' },
  { id: 'life', pathPrefix: '/life', title: 'Life' },
] as const

function postsInSection(posts: Post[], pathPrefix: string) {
  return posts
    .filter(
      p => p.path === pathPrefix || p.path.startsWith(`${pathPrefix}/`),
    )
    .sort((a, b) => {
      const da = a.date ?? ''
      const db = b.date ?? ''
      return db.localeCompare(da)
    })
}

const { data: posts } = await useAsyncData('posts', () =>
  queryCollection('content').order('date', 'DESC').all()) as { data: Ref<Post[] | null> }

const sectionsWithPosts = computed(() =>
  SECTIONS.map(section => ({
    ...section,
    posts: postsInSection(posts.value ?? [], section.pathPrefix),
  })),
)
</script>

<template>
  <div class="home">
    <header class="home-header">
      <h1 class="text-zinc-900 dark:text-zinc-50">
        L0st1
      </h1>
      <p class="subtitle text-zinc-600 dark:text-zinc-400">
        Vue · TypeScript · Category theory enthusiasts and learners
      </p>
    </header>

    <div class="sections">
      <section
        v-for="section in sectionsWithPosts"
        :key="section.id"
        class="section rounded-lg border border-zinc-200 bg-zinc-100/80 dark:border-zinc-800 dark:bg-zinc-900/40"
        :aria-labelledby="`section-${section.id}`"
      >
        <h2 :id="`section-${section.id}`" class="section-title border-b border-zinc-200 text-zinc-800 dark:border-zinc-700 dark:text-zinc-100">
          {{ section.title }}
        </h2>
        <ul v-if="section.posts.length" class="post-list">
          <li v-for="post in section.posts" :key="post.path" class="post-item">
            <NuxtLink :to="`/blog${post.path}`" class="post-link text-blue-600 dark:text-blue-400">
              {{ post.title }}
            </NuxtLink>
            <p v-if="post.description" class="post-desc text-zinc-600 dark:text-zinc-400">
              {{ post.description }}
            </p>
            <time v-if="post.date" class="post-date text-zinc-500 dark:text-zinc-500" :datetime="post.date">{{ post.date }}</time>
          </li>
        </ul>
        <p v-else class="empty text-zinc-500 dark:text-zinc-500">
          暂无文章
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
}

.home-header {
  margin-bottom: 2.5rem;
  text-align: center;
}

.home-header h1 {
  margin: 0 0 0.5rem;
  font-size: 1.75rem;
}

.subtitle {
  margin: 0;
  font-size: 0.95rem;
}

.sections {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  align-items: start;
}

.section {
  padding: 1.25rem;
  min-height: 8rem;
}

.section-title {
  margin: 0 0 1rem;
  padding-bottom: 0.75rem;
  font-size: 1.05rem;
  font-weight: 600;
}

.post-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.post-item + .post-item {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgb(228 228 231);
}

.dark .post-item + .post-item {
  border-top-color: rgb(63 63 70);
}

.post-link {
  font-weight: 500;
  text-decoration: none;
}

.post-link:hover {
  text-decoration: underline;
}

.post-desc {
  margin: 0.35rem 0 0;
  font-size: 0.875rem;
  line-height: 1.5;
}

.post-date {
  display: block;
  margin-top: 0.35rem;
  font-size: 0.8rem;
}

.empty {
  margin: 0;
  font-size: 0.9rem;
}

@media (max-width: 900px) {
  .sections {
    grid-template-columns: 1fr;
  }
}
</style>
