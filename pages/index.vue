<script setup lang="ts">
import type { PostMeta } from '~/content/schema'

interface PostItem {
  slug: string
  meta: PostMeta
}

const { data: posts } = await useAsyncData<PostItem[]>('posts', () =>
  $fetch('/api/posts')
)
</script>

<template>
  <div>
    <h1>博客文章</h1>
    <ul v-if="posts && posts.length">
      <li v-for="post in posts" :key="post.slug">
        <NuxtLink :to="`/blog/${post.slug}`">
          {{ post.meta.title }}
        </NuxtLink>
        <p v-if="post.meta.summary">{{ post.meta.summary }}</p>
      </li>
    </ul>
    <p v-else>暂无文章</p>
  </div>
</template>
